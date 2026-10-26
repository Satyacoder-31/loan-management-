import { autoFetchApplicantData, createApplication } from "../src/core/gn-co.js";
import { q, q1, run } from "../src/db/connection.js";

async function main() {
  process.env.EXPERIAN_LIVE_ENABLED = "true";
  
  // 1. Create a test applicant
  const res = await run(
    `INSERT INTO gn_applicants (tenant_id, ref, name, mobile)
     VALUES (1, 'TEST-' || round(extract(epoch from now()) * 1000), 'Applicant', '8838864869') RETURNING id`
  );
  const applicantId = res.lastId || (res as any)[0]?.id;
  console.log("Created applicant:", applicantId);

  // 2. Run autoFetchApplicantData
  const result = await autoFetchApplicantData(1, applicantId, 1, { otp: "123456" });
  console.log("Auto fetch result:", {
    name: result.name,
    pan: result.pan,
    score: result.score,
    tradelinesCount: result.tradelines?.length || 0,
    creditReport: result.creditReport ? "Present" : "Missing"
  });

  // 3. Inspect what is in gn_credit_profiles
  const credit = await q1(
    "SELECT * FROM gn_credit_profiles WHERE applicant_id = ? ORDER BY id DESC LIMIT 1",
    [applicantId]
  );
  console.log("Database credit profile:", {
    id: credit?.id,
    score: credit?.score,
    active_accounts: credit?.active_accounts,
    closed_accounts: credit?.closed_accounts,
    report_json_length: credit?.report_json?.length
  });

  const parsedReport = credit?.report_json ? JSON.parse(credit.report_json) : null;
  console.log("Parsed report tradelines:", parsedReport?.tradelines?.length);
  if (parsedReport?.tradelines?.length) {
    console.log("First tradeline:", parsedReport.tradelines[0]);
  }
}

main().then(() => process.exit(0)).catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
