import { Router } from "express";
import { z } from "zod";
import { q, q1, run } from "../db/connection.js";
import { asyncH } from "../middleware.js";

export const customerUploadRouter = Router();

let columnsMigrated = false;
async function ensureDocColumns() {
  if (columnsMigrated) return;
  try {
    await run("ALTER TABLE gn_documents ADD COLUMN IF NOT EXISTS file_url TEXT");
  } catch {}
  try {
    await run("ALTER TABLE gn_documents ADD COLUMN IF NOT EXISTS source TEXT");
  } catch {}
  columnsMigrated = true;
}

// Helper: resolve applicant by ID or by ref
async function findApplicant(idOrRef: string) {
  await ensureDocColumns();
  const isNumeric = /^\d+$/.test(idOrRef);
  if (isNumeric) {
    const a = await q1<Record<string, any>>("SELECT * FROM gn_applicants WHERE id = ?", [Number(idOrRef)]);
    if (a) return a;
  }
  return await q1<Record<string, any>>("SELECT * FROM gn_applicants WHERE ref = ?", [idOrRef]);
}

// 1. GET applicant public details & checklist
customerUploadRouter.get("/:idOrRef", asyncH(async (req, res) => {
  const applicant = await findApplicant(req.params.idOrRef);
  if (!applicant) {
    res.status(404).json({ error: "Applicant record not found or link has expired" });
    return;
  }

  // Parse notes/metadata
  let meta: any = {};
  try {
    if (applicant.notes && applicant.notes.startsWith("{")) {
      meta = JSON.parse(applicant.notes);
    }
  } catch {}

  // Fetch current documents for this applicant
  const existingDocs = await q<Record<string, any>>(
    "SELECT id, doc_type, name, status, file_url, created_at FROM gn_documents WHERE entity_type = 'applicant' AND entity_id = ? ORDER BY id ASC",
    [applicant.id]
  );

  const loanType = applicant.loan_type || "Green Energy Finance for Business";
  const empType = applicant.employment_type || "Self-employed";
  const isPersonal = loanType.toLowerCase().includes("personal") || loanType.toLowerCase().includes("individual") || empType.toLowerCase().includes("salaried");

  // Define dynamic checklist - EXCLUSIVELY required documents per loan profile
  const requiredDocs = isPersonal
    ? [
        {
          doc_type: "salary_slip",
          title: "Payment Slip (3 months)",
          desc: "Payment slip for 3 months (Mandatory for Salaried / Individual Green Energy Finance)",
          category: "Payment Slip (Salary)",
          required: true,
          accept: "application/pdf,image/*"
        },
        {
          doc_type: "form_16",
          title: "Form # 16",
          desc: "Form # 16 TDS Certificate (Mandatory for Salaried / Individual Green Energy Finance)",
          category: "Form # 16",
          required: true,
          accept: "application/pdf,image/*"
        }
      ]
    : [
        {
          doc_type: "salary_slip",
          title: "Salary Slip",
          desc: "Salary Slip / Remuneration proof (Mandatory for Green Energy Finance for Business)",
          category: "Remuneration",
          required: true,
          accept: "application/pdf,image/*"
        },
        {
          doc_type: "itr",
          title: "ITRs",
          desc: "Income Tax Returns & Computations (Mandatory for Green Energy Finance for Business)",
          category: "ITRs",
          required: true,
          accept: "application/pdf,image/*"
        },
        {
          doc_type: "form_16",
          title: "Form # 16",
          desc: "Form # 16 / 16A TDS Certificate (Mandatory for Green Energy Finance for Business)",
          category: "Form # 16",
          required: true,
          accept: "application/pdf,image/*"
        }
      ];

  const allowedDocTypes = isPersonal
    ? ["salary_slip", "payment_slip", "form_16", "form16"]
    : ["salary_slip", "payment_slip", "itr", "form_16", "form16"];

  const filteredDocs = existingDocs.filter(d => allowedDocTypes.includes(d.doc_type));

  // Mask mobile for privacy
  const rawMobile = applicant.mobile || "";
  const maskedMobile = rawMobile.length >= 10
    ? `${rawMobile.slice(0, 2)}******${rawMobile.slice(-2)}`
    : rawMobile;

  res.json({
    ok: true,
    applicant: {
      id: applicant.id,
      ref: applicant.ref,
      name: applicant.name,
      masked_mobile: maskedMobile,
      loan_type: loanType,
      loan_amount: applicant.loan_amount || 500000,
      employment_type: empType,
      city: applicant.city,
      submitted: !!meta.customer_submitted,
      submitted_at: meta.customer_submitted_at || null
    },
    checklist: requiredDocs,
    uploaded_docs: filteredDocs
  });
}));

// 2. POST single document upload (base64 data URI / file)
customerUploadRouter.post("/:idOrRef/doc", asyncH(async (req, res) => {
  const applicant = await findApplicant(req.params.idOrRef);
  if (!applicant) {
    res.status(404).json({ error: "Applicant record not found" });
    return;
  }

  const b = z.object({
    doc_type: z.string().min(1),
    name: z.string().min(1),
    file_data: z.string().min(1), // Base64 data URI (data:...;base64,...)
    mime_type: z.string().optional()
  }).parse(req.body);

  const t = applicant.tenant_id;
  const docType = b.doc_type === "form16" ? "form_16" : b.doc_type;

  // Check if document already exists
  const existing = await q1<Record<string, any>>(
    "SELECT * FROM gn_documents WHERE tenant_id = ? AND entity_type = 'applicant' AND entity_id = ? AND (doc_type = ? OR (doc_type = 'form16' AND ? = 'form_16') OR (doc_type = 'form_16' AND ? = 'form16'))",
    [t, applicant.id, docType, docType, docType]
  );

  let docId: number;
  if (!existing) {
    const r = await run(
      `INSERT INTO gn_documents (tenant_id, entity_type, entity_id, doc_type, name, status, file_url, source)
       VALUES (?, 'applicant', ?, ?, ?, 'uploaded', ?, 'customer_portal')`,
      [t, applicant.id, docType, b.name, b.file_data]
    );
    docId = r.lastId;
  } else {
    await run(
      "UPDATE gn_documents SET name = ?, status = 'uploaded', file_url = ?, source = 'customer_portal' WHERE id = ?",
      [b.name, b.file_data, existing.id]
    );
    docId = existing.id;
  }

  // Update applicant doc status
  await run(
    "UPDATE gn_applicants SET doc_status = 'in_progress', updated_at = datetime('now') WHERE id = ?",
    [applicant.id]
  );

  // Log timeline event
  await run(
    `INSERT INTO gn_applicant_events (tenant_id, applicant_id, event, note, created_at)
     VALUES (?, ?, 'CUSTOMER MOBILE UPLOAD', ?, datetime('now'))`,
    [t, applicant.id, `Uploaded ${b.name} (${b.doc_type}) via Branded Customer Portal`]
  );

  const updatedDoc = await q1<Record<string, any>>(
    "SELECT id, doc_type, name, status, file_url, created_at FROM gn_documents WHERE id = ?",
    [docId]
  );

  res.json({
    ok: true,
    message: `${b.name} uploaded successfully`,
    doc: updatedDoc
  });
}));

// 3. POST complete submission
customerUploadRouter.post("/:idOrRef/complete", asyncH(async (req, res) => {
  const applicant = await findApplicant(req.params.idOrRef);
  if (!applicant) {
    res.status(404).json({ error: "Applicant record not found" });
    return;
  }

  const t = applicant.tenant_id;
  let meta: any = {};
  try {
    if (applicant.notes && applicant.notes.startsWith("{")) {
      meta = JSON.parse(applicant.notes);
    }
  } catch {}

  meta.customer_submitted = true;
  meta.customer_submitted_at = new Date().toISOString();
  meta.customer_upload_channel = "branded_mobile_portal";

  await run(
    "UPDATE gn_applicants SET doc_status = 'in_progress', notes = ?, updated_at = datetime('now') WHERE id = ?",
    [JSON.stringify(meta), applicant.id]
  );

  // Timeline event
  await run(
    `INSERT INTO gn_applicant_events (tenant_id, applicant_id, event, note, created_at)
     VALUES (?, ?, 'CUSTOMER COMPLETED DOCUMENT UPLOAD', 'Borrower finished uploading all KYC and income documents via Mobile Portal', datetime('now'))`,
    [t, applicant.id]
  );

  // Add notification in gn_inbox_messages
  await run(
    `INSERT INTO gn_inbox_messages (tenant_id, direction, channel, to_contact, subject, body, related_type, related_id, status)
     VALUES (?, 'in', 'portal', ?, 'Customer Documents Submitted', ?, 'applicant', ?, 'unread')`,
    [
      t,
      applicant.mobile || "Customer",
      `All requested verification documents were submitted by ${applicant.name} (+91 ${applicant.mobile}) via the Mobile Portal. Ready for admin verification.`,
      applicant.id
    ]
  );

  res.json({
    ok: true,
    message: "All documents submitted successfully. Loan officer has been notified."
  });
}));
