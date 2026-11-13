/**
 * GSTIN Authentication Advanced — PDF & HTML Generator
 * Generates pixel-accurate official GST registry reports matching the
 * GSTIN Authentication Advanced specification (UID / Provider TAEEQGY5).
 */

import PDFDocument from "pdfkit";

export interface GstinAdvancedDetails {
  // Column 1
  legalName: string;
  gstin: string;
  taxpayerType: string;
  constitutionOfBusiness: string;
  natureOfBusiness: string;
  stateJurisdiction: string;
  contactInfo: string;
  eInvoiceStatus: string;
  eKycValidation: string;
  delaySummary: string;
  goodsAndServices: string;

  // Column 2
  tradeName: string;
  status: string;
  registrationDate: string;
  principalAddress: string;
  aggregateTurnover: string;
  centerJurisdiction: string;
  members: string;
  aadhaarValidation: string;
  recentReturnFilings: string;
  filingGaps: string;

  // Metadata
  source?: string;
  verifiedAt?: string;
  providerCode?: string;
  verificationBadge?: string;
}

/**
 * Generate a binary PDF Buffer matching the official GSTIN Authentication Advanced reference layout.
 */
export async function generateGstinPdfBuffer(d: GstinAdvancedDetails): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 28 });
      const buffers: Buffer[] = [];

      doc.on("data", (chunk: Buffer) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err: Error) => reject(err));

      const pageWidth = 595.28;
      const margin = 28;
      const cardWidth = pageWidth - margin * 2;
      const cardHeight = 750;

      // Card Background with rounded corners
      doc.roundedRect(margin, margin, cardWidth, cardHeight, 14).fill("#FDFBF7");

      // Title Centered
      doc
        .fillColor("#0E2356")
        .fontSize(16.5)
        .font("Helvetica-Bold")
        .text("GSTIN Authentication Advanced", margin, margin + 26, {
          align: "center",
          width: cardWidth
        });

      const col1X = margin + 16;
      const col1W = 252;
      const col2X = margin + 276;
      const col2W = 252;

      function drawField(x: number, y: number, w: number, label: string, value: string, labelW = 96): number {
        doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#1E293B");
        doc.text(label, x, y, { width: labelW });
        doc.text(":", x + labelW, y);
        doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#0F172A");
        const valX = x + labelW + 10;
        const valW = w - (labelW + 10);
        doc.text(value || "—", valX, y, { width: valW, lineGap: 1.5 });
        const textH = doc.heightOfString(value || "—", { width: valW, lineGap: 1.5 });
        const labelH = doc.heightOfString(label, { width: labelW });
        return Math.max(textH, labelH);
      }

      let y = margin + 68;

      // Row 1: Legal Name & Trade Name
      drawField(col1X, y, col1W, "Legal Name", d.legalName);
      drawField(col2X, y, col2W, "Trade Name", d.tradeName);
      y += 28;

      // Row 2: GSTIN & Status
      drawField(col1X, y, col1W, "GSTIN", d.gstin);
      drawField(col2X, y, col2W, "Status", d.status);
      y += 28;

      // Row 3: Taxpayer Type & Registration Date
      drawField(col1X, y, col1W, "Taxpayer Type", d.taxpayerType);
      drawField(col2X, y, col2W, "Registration Date", d.registrationDate);
      y += 28;

      // Row 4: Constitution of Business & Principal Address
      drawField(col1X, y, col1W, "Constitution of Business", d.constitutionOfBusiness, 96);
      drawField(col2X, y, col2W, "Principal Address", d.principalAddress, 96);

      // Nature of Business sits below Constitution of Business
      drawField(col1X, y + 42, col1W, "Nature of Business", d.natureOfBusiness, 96);
      y += 86;

      // Row 5: State Jurisdiction & Aggregate Turnover
      drawField(col1X, y, col1W, "State Jurisdiction", d.stateJurisdiction, 96);
      drawField(col2X, y, col2W, "Aggregate Turnover", d.aggregateTurnover, 96);
      y += 62;

      // Row 6: Contact Info & Center Jurisdiction
      drawField(col1X, y, col1W, "Contact Info", d.contactInfo, 96);
      drawField(col2X, y, col2W, "Center Jurisdiction", d.centerJurisdiction, 96);
      y += 64;

      // Row 7: E-Invoice Status & Members
      drawField(col1X, y, col1W, "E-Invoice Status", d.eInvoiceStatus, 96);
      drawField(col2X, y, col2W, "Members", d.members, 96);
      y += 30;

      // Row 8: eKYC Validation & Aadhaar Validation
      drawField(col1X, y, col1W, "eKYC Validation", d.eKycValidation, 96);
      drawField(col2X, y, col2W, "Aadhaar Validation", d.aadhaarValidation, 96);
      y += 36;

      // Row 9: Delay Summary & Recent Return Filings
      drawField(col1X, y, col1W, "Delay Summary", d.delaySummary, 96);
      drawField(col2X, y, col2W, "Recent Return Filings", d.recentReturnFilings, 96);
      y += 124;

      // Row 10: Goods & Services & Filing Gaps
      drawField(col1X, y, col1W, "Goods & Services", d.goodsAndServices, 96);
      drawField(col2X, y, col2W, "Filing Gaps", d.filingGaps, 96);
      y += 70;

      // Bottom Badge: ✔ VERIFIED REGISTRY RESPONSE
      const badgeY = y + 30;
      const badgeCenterX = pageWidth / 2;

      // Emerald Circle with checkmark
      doc.circle(badgeCenterX - 85, badgeY + 4, 5.5).fill("#10B981");
      doc
        .path(`M ${badgeCenterX - 87.5} ${badgeY + 4} L ${badgeCenterX - 85.5} ${badgeY + 6.5} L ${badgeCenterX - 82.5} ${badgeY + 1.5}`)
        .lineWidth(1.2)
        .strokeColor("#FFFFFF")
        .stroke();

      doc
        .fillColor("#10B981")
        .fontSize(9.5)
        .font("Helvetica-Bold")
        .text("VERIFIED REGISTRY RESPONSE", badgeCenterX - 74, badgeY);

      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Generate a standalone printable HTML page matching the reference layout.
 */
export function generateGstinHtml(d: GstinAdvancedDetails): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GSTIN Authentication Advanced - ${d.gstin}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      padding: 24px 12px;
      display: flex;
      justify-content: center;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .print-actions {
      position: fixed;
      top: 16px;
      right: 20px;
      display: flex;
      gap: 10px;
      z-index: 1000;
    }
    .print-btn {
      background: #1e3a8a;
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .container {
      background-color: #FDFBF7;
      width: 100%;
      max-width: 800px;
      border-radius: 16px;
      padding: 40px 36px 32px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.06);
      border: 1px solid #e2e8f0;
    }
    .header-title {
      text-align: center;
      color: #0E2356;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.3px;
      margin-bottom: 32px;
    }
    .two-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 36px;
      row-gap: 16px;
    }
    .field-row {
      display: flex;
      align-items: flex-start;
      margin-bottom: 14px;
      font-size: 12.5px;
      line-height: 1.45;
    }
    .field-label {
      width: 140px;
      min-width: 140px;
      font-weight: 800;
      color: #1E293B;
      display: flex;
      justify-content: space-between;
      padding-right: 12px;
    }
    .field-val {
      flex: 1;
      font-weight: 800;
      color: #0F172A;
      word-break: break-word;
    }
    .badge-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 36px;
      padding-top: 20px;
      color: #10B981;
      font-weight: 800;
      font-size: 13.5px;
      letter-spacing: 0.5px;
    }
    .check-circle {
      width: 16px;
      height: 16px;
      background: #10B981;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 11px;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .container { border: none; box-shadow: none; border-radius: 0; max-width: 100%; padding: 10px; }
      .print-actions { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="print-actions">
    <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>
  <div class="container">
    <div class="header-title">GSTIN Authentication Advanced</div>
    <div class="two-cols">
      <!-- COLUMN 1 -->
      <div class="col">
        <div class="field-row">
          <div class="field-label"><span>Legal Name</span><span>:</span></div>
          <div class="field-val">${escapeHtml(d.legalName)}</div>
        </div>
        <div class="field-row">
          <div class="field-label"><span>GSTIN</span><span>:</span></div>
          <div class="field-val">${escapeHtml(d.gstin)}</div>
        </div>
        <div class="field-row">
          <div class="field-label"><span>Taxpayer Type</span><span>:</span></div>
          <div class="field-val">${escapeHtml(d.taxpayerType)}</div>
        </div>
        <div class="field-row">
          <div class="field-label"><span>Constitution of Business</span><span>:</span></div>
          <div class="field-val">${escapeHtml(d.constitutionOfBusiness)}</div>
        </div>
        <div class="field-row">
          <div class="field-label"><span>Nature of Business</span><span>:</span></div>
          <div class="field-val">${escapeHtml(d.natureOfBusiness)}</div>
        </div>
        <div class="field-row">
          <div class="field-label"><span>State Jurisdiction</span><span>:</span></div>
          <div class="field-val">${escapeHtml(d.stateJurisdiction)}</div>
        </div>
        <div class="field-row">
          <div class="field-label"><span>Contact Info</span><span>:</span></div>
          <div class="field-val">${escapeHtml(d.contactInfo)}</div>
        </div>
        <div class="field-row">
          <div class="field-label"><span>E-Invoice Status</span><span>:</span></div>
          <div class="field-val">${escapeHtml(d.eInvoiceStatus)}</div>
        </div>
        <div class="field-row">
          <div class="field-label"><span>eKYC Validation</span><span>:</span></div>
          <div class="field-val">${escapeHtml(d.eKycValidation)}</div>
        </div>
        <div class="field-row">
          <div class="field-label"><span>Delay Summary</span><span>:</span></div>
          <div class="field-val">${escapeHtml(d.delaySummary)}</div>
        </div>
        <div class="field-row">
          <div class="field-label"><span>Goods & Services</span><span>:</span></div>
          <div class="field-val">${escapeHtml(d.goodsAndServices)}</div>
        </div>
      </div>

      <!-- COLUMN 2 -->
      <div class="col">
        <div class="field-row">
          <div class="field-label"><span>Trade Name</span><span>:</span></div>
          <div class="field-val">${escapeHtml(d.tradeName)}</div>
        </div>
        <div class="field-row">
          <div class="field-label"><span>Status</span><span>:</span></div>
          <div class="field-val">${escapeHtml(d.status)}</div>
        </div>
        <div class="field-row">
          <div class="field-label"><span>Registration Date</span><span>:</span></div>
          <div class="field-val">${escapeHtml(d.registrationDate)}</div>
        </div>
        <div class="field-row">
          <div class="field-label"><span>Principal Address</span><span>:</span></div>
          <div class="field-val">${escapeHtml(d.principalAddress)}</div>
        </div>
        <div class="field-row">
          <div class="field-label"><span>Aggregate Turnover</span><span>:</span></div>
          <div class="field-val">${escapeHtml(d.aggregateTurnover)}</div>
        </div>
        <div class="field-row">
          <div class="field-label"><span>Center Jurisdiction</span><span>:</span></div>
          <div class="field-val">${escapeHtml(d.centerJurisdiction)}</div>
        </div>
        <div class="field-row">
          <div class="field-label"><span>Members</span><span>:</span></div>
          <div class="field-val">${escapeHtml(d.members)}</div>
        </div>
        <div class="field-row">
          <div class="field-label"><span>Aadhaar Validation</span><span>:</span></div>
          <div class="field-val">${escapeHtml(d.aadhaarValidation)}</div>
        </div>
        <div class="field-row">
          <div class="field-label"><span>Recent Return Filings</span><span>:</span></div>
          <div class="field-val">${escapeHtml(d.recentReturnFilings)}</div>
        </div>
        <div class="field-row">
          <div class="field-label"><span>Filing Gaps</span><span>:</span></div>
          <div class="field-val">${escapeHtml(d.filingGaps)}</div>
        </div>
      </div>
    </div>

    <!-- BADGE FOOTER -->
    <div class="badge-footer">
      <span class="check-circle">✓</span>
      <span>VERIFIED REGISTRY RESPONSE</span>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

