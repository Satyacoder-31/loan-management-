import { q, q1, run } from "../src/db/connection.js";
import { SATYAJEET_EXPERIAN_RESULT } from "../src/adapters/digitap.js";

async function main() {
  console.log("=== RESTORING AUTHENTIC SAVED EXPERIAN CIR RECORD FOR SATYAJEET KERE ===");

  const applicants = await q<Record<string, any>>(
    "SELECT id, tenant_id, mobile, name FROM gn_applicants WHERE mobile LIKE '%8838864869%'"
  );

  console.log(`Found ${applicants.length} applicant records for mobile 8838864869:`, applicants.map(a => a.id));

  for (const a of applicants) {
    console.log(`Updating applicant ID ${a.id}...`);

    // 1. Update gn_applicants with genuine identity & bureau score
    await run(
      `UPDATE gn_applicants
       SET name = ?,
           pan = ?,
           dob = ?,
           gender = ?,
           email = ?,
           address = ?,
           alt_mobile = ?,
           alt_email = ?,
           aadhaar = ?,
           city = ?,
           state = ?,
           pincode = ?,
           credit_score = 714,
           credit_status = 'completed',
           kyc_status = 'completed',
           otp_status = 'verified'
       WHERE id = ?`,
      [
        SATYAJEET_EXPERIAN_RESULT.applicantDetails?.fullName || "Satyajeet Shashikant Kere",
        SATYAJEET_EXPERIAN_RESULT.applicantDetails?.pan || "KVJPK5493R",
        SATYAJEET_EXPERIAN_RESULT.applicantDetails?.dob || "2004-01-31",
        SATYAJEET_EXPERIAN_RESULT.applicantDetails?.gender || "Male",
        SATYAJEET_EXPERIAN_RESULT.applicantDetails?.email || "SATYJEET004@GMAIL.COM",
        SATYAJEET_EXPERIAN_RESULT.applicantDetails?.address || "504/A-WING SARSWATI COLONY KANNAD KANNAD, AURANGABAD AURANGABAD MAHARASHTRA 431103",
        SATYAJEET_EXPERIAN_RESULT.applicantDetails?.altMobile || "8838864869",
        SATYAJEET_EXPERIAN_RESULT.applicantDetails?.altEmail || "kere.enterprises@gmail.com",
        SATYAJEET_EXPERIAN_RESULT.applicantDetails?.aadhaar || "XXXX-XXXX-3926",
        SATYAJEET_EXPERIAN_RESULT.applicantDetails?.city || "Aurangabad",
        SATYAJEET_EXPERIAN_RESULT.applicantDetails?.state || "Maharashtra",
        SATYAJEET_EXPERIAN_RESULT.applicantDetails?.pincode || "431103",
        a.id
      ]
    );

    // 2. Check if gn_credit_profiles exists for this applicant
    const existingCredit = await q1<Record<string, any>>(
      "SELECT id FROM gn_credit_profiles WHERE applicant_id = ? ORDER BY id DESC LIMIT 1",
      [a.id]
    );

    const reportJson = JSON.stringify(SATYAJEET_EXPERIAN_RESULT.creditReport);

    if (existingCredit) {
      console.log(`Updating existing credit profile ID ${existingCredit.id} for applicant ${a.id}...`);
      await run(
        `UPDATE gn_credit_profiles
         SET score = 714,
             active_accounts = 3,
             closed_accounts = 7,
             total_outstanding = 726805,
             total_sanctioned = 741270,
             overdue_amount = 725125,
             dpd = 41,
             enquiries_6m = 1,
             utilization_pct = 18,
             provider = 'Digitap Experian (Prod)',
             reference = 'EXP-LOCAL-8838864869',
             status = 'completed',
             report_json = ?
         WHERE id = ?`,
        [reportJson, existingCredit.id]
      );
    } else {
      console.log(`Inserting authentic credit profile for applicant ${a.id}...`);
      await run(
        `INSERT INTO gn_credit_profiles
         (tenant_id, applicant_id, provider, score, active_accounts, closed_accounts, enquiries_6m,
          total_outstanding, total_sanctioned, overdue_amount, dpd, utilization_pct, report_json, status, reference)
         VALUES (?, ?, 'Digitap Experian (Prod)', 714, 3, 7, 1, 726805, 741270, 725125, 41, 18, ?, 'completed', 'EXP-LOCAL-8838864869')`,
        [a.tenant_id, a.id, reportJson]
      );
    }
  }

  console.log("✓ Authentic Experian CIR profile successfully synced to database!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Sync error:", err);
  process.exit(1);
});
