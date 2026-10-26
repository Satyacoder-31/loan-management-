import { Router } from "express";
import { asyncH } from "../middleware.js";
import { processWebhookEvent } from "../core/webhook-handler.js";

export const webhooksRouter = Router();

webhooksRouter.post(
  "/google-form",
  asyncH(async (req, res) => {
    const { q, q1, run } = await import("../db/connection.js");
    const { aplEvent } = await import("../core/gn-co.js");
    const payload = req.body || {};

    // Extract all candidate phone fields from Google Form / Apps Script payload
    const rawRegMobile = String(
      payload.registered_mobile ||
      payload["Registered Mobile Number"] ||
      payload["Registered Mobile"] ||
      payload["Registered Phone"] ||
      payload["Registered Mobile (10-digit)"] ||
      payload["Enter Registered Mobile Number"] ||
      payload.mobile ||
      payload.phone ||
      payload["Mobile Number"] ||
      payload["Mobile"] ||
      payload["Phone"] ||
      ""
    );
    const rawWhatsapp = String(
      payload.whatsapp_number ||
      payload.whatsapp ||
      payload["WhatsApp Number"] ||
      payload["WhatsApp"] ||
      payload["Whatsapp Number"] ||
      payload["Customer WhatsApp"] ||
      ""
    );

    const cleanRegMobile = rawRegMobile.replace(/\D/g, "").slice(-10);
    const cleanWhatsapp = rawWhatsapp.replace(/\D/g, "").slice(-10);

    const searchMobile = cleanRegMobile || cleanWhatsapp;
    if (!searchMobile || searchMobile.length < 10) {
      res.status(400).json({ error: "Missing or invalid 10-digit registered mobile number in Google Form payload" });
      return;
    }

    // 1. Prioritize lookup by Registered Mobile Number first
    let applicants: Array<Record<string, any>> = [];
    if (cleanRegMobile && cleanRegMobile.length === 10) {
      applicants = await q<Record<string, any>>(
        "SELECT * FROM gn_applicants WHERE mobile LIKE ? ORDER BY id DESC LIMIT 5",
        [`%${cleanRegMobile}%`]
      );
    }

    // 2. If not matched by primary mobile, search by alt_mobile or notes (whatsapp_number)
    if (!applicants.length && cleanWhatsapp && cleanWhatsapp.length === 10) {
      applicants = await q<Record<string, any>>(
        "SELECT * FROM gn_applicants WHERE alt_mobile LIKE ? OR notes LIKE ? ORDER BY id DESC LIMIT 5",
        [`%${cleanWhatsapp}%`, `%"whatsapp_number":"${cleanWhatsapp}"%`]
      );
    }

    // 3. Fallback: check across both fields
    if (!applicants.length) {
      applicants = await q<Record<string, any>>(
        "SELECT * FROM gn_applicants WHERE mobile LIKE ? OR alt_mobile LIKE ? OR notes LIKE ? ORDER BY id DESC LIMIT 5",
        [`%${searchMobile}%`, `%${searchMobile}%`, `%${searchMobile}%`]
      );
    }

    if (!applicants.length) {
      res.status(404).json({ ok: false, message: `No active applicant found matching registered mobile ${cleanRegMobile || searchMobile}` });
      return;
    }

    for (const a of applicants) {
      const isPersonal = (a.loan_type || "").toLowerCase().includes("personal") || (a.employment_type || "").toLowerCase().includes("salaried");
      const docs: Array<{ code: string; name: string; url?: string }> = [
        {
          code: "pan",
          name: isPersonal ? `PAN Card - ${a.name}.pdf` : `PAN Card (Entity & Director) - ${a.name}.pdf`,
          url: payload.pan_url || payload["PAN Card URL"] || payload["PAN Card"] || payload["Upload PAN Card"] || payload["PAN"] || "uploaded"
        },
        {
          code: "aadhaar",
          name: `Aadhaar Card (Masked) - ${a.name}.pdf`,
          url: payload.aadhaar_url || payload["Aadhaar Card URL"] || payload["Aadhaar Card"] || payload["Upload Aadhaar Card"] || payload["Aadhaar"] || "uploaded"
        },
        {
          code: "bank_statement",
          name: isPersonal ? `Salary Account Bank Statement (6 Months) - ${a.bank_name || "HDFC Bank"}.pdf` : `Current Account Bank Statement (12 Months) - ${a.bank_name || "HDFC Bank"}.pdf`,
          url: payload.bank_statement_url || payload["Bank Statement URL"] || payload["Bank Statement"] || payload["Upload Bank Statement"] || "uploaded"
        },
        {
          code: "salary_slip",
          name: isPersonal ? `Payment Slip / Salary Slip (Last 3 Months) - ${a.name}.pdf` : `Salary Slip / Director Remuneration - ${a.name}.pdf`,
          url: payload.salary_slip_url || payload.income_url || payload["Payment Slip"] || payload["Salary Slip"] || payload["Upload Salary Slip"] || "uploaded"
        },
        {
          code: "form_16",
          name: isPersonal ? `Form # 16 (Part A & Part B - Annual TDS Certificate) - ${a.name}.pdf` : `Form # 16 / Form 16A (TDS Certificates) - ${a.name}.pdf`,
          url: payload.form_16_url || payload["Form 16"] || payload["Form # 16"] || payload["Upload Form 16"] || "uploaded"
        }
      ];

      if (!isPersonal) {
        docs.push({
          code: "itr",
          name: `ITRs & Financial Computations (Last 2-3 Assessment Years) - ${a.name}.pdf`,
          url: payload.itr_url || payload["ITR"] || payload["ITRs"] || payload["Upload ITR"] || "uploaded"
        });
        if (a.gst) {
          docs.push({
            code: "gst",
            name: `GST Registration Certificate & GSTR-3B - ${a.gst}.pdf`,
            url: payload.gst_url || payload["GST"] || payload["Upload GST"] || "uploaded"
          });
        }
      }

      docs.push({
        code: "photo",
        name: `Borrower Photograph - ${a.name}.jpg`,
        url: payload.photo_url || payload["Photo"] || payload["Upload Photo"] || "uploaded"
      });

      for (const d of docs) {
        const existing = await q1<Record<string, any>>(
          "SELECT * FROM gn_documents WHERE tenant_id = ? AND entity_type = 'applicant' AND entity_id = ? AND doc_type = ?",
          [a.tenant_id, a.id, d.code]
        );
        if (existing) {
          await run("UPDATE gn_documents SET name = ?, status = 'pending', file_url = ? WHERE id = ?", [d.name, d.url || null, existing.id]);
        } else {
          await run(
            "INSERT INTO gn_documents (tenant_id, entity_type, entity_id, doc_type, name, status, file_url) VALUES (?, 'applicant', ?, ?, ?, 'pending', ?)",
            [a.tenant_id, a.id, d.code, d.name, d.url || null]
          );
        }
      }

      let meta: any = {};
      try { if (a.notes && a.notes.startsWith("{")) meta = JSON.parse(a.notes); } catch {}
      meta.google_form_submitted = true;
      meta.google_form_submitted_at = new Date().toISOString();
      meta.google_form_matched_mobile = cleanRegMobile || searchMobile;
      if (cleanWhatsapp) meta.google_form_whatsapp = cleanWhatsapp;
      meta.google_form_payload = payload;

      await run("UPDATE gn_applicants SET doc_status = 'in_progress', notes = ?, updated_at = datetime('now') WHERE id = ?", [JSON.stringify(meta), a.id]);
      await aplEvent(
        a.tenant_id,
        a.id,
        "GOOGLE FORM RESPONSE RECEIVED",
        `${docs.length} documents uploaded via Google Form for registered mobile +91 ${a.mobile}${cleanWhatsapp ? ` (via WhatsApp +91 ${cleanWhatsapp})` : ""}`,
        a.assigned_to || 1
      );
    }

    res.json({ ok: true, matched_applicants: applicants.length, registered_mobile: cleanRegMobile || searchMobile, whatsapp: cleanWhatsapp });
  })
);

webhooksRouter.post(
  "/:provider",
  asyncH(async (req, res) => {
    const provider = req.params.provider;
    const rawBody = JSON.stringify(req.body);
    const payload = req.body;

    const result = await processWebhookEvent(provider, rawBody, payload, req.headers);
    res.status(200).json(result);
  })
);
