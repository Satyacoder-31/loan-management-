import { q1 } from "../src/db/connection.js";
import { pullExperianReport } from "../src/adapters/digitap.js";

async function main() {
  console.log("=== VERIFYING SATYAJEET AUTHENTIC DATA ===");

  // 1. Check DB Applicant
  const applicant = await q1<Record<string, any>>("SELECT id, mobile, name, pan, dob, email, credit_score FROM gn_applicants WHERE id = 475");
  console.log("DB Applicant:", applicant);

  // 2. Check DB Credit Profile
  const credit = await q1<Record<string, any>>("SELECT id, applicant_id, score, dpd, total_outstanding, report_json FROM gn_credit_profiles WHERE applicant_id = 475");
  let rep: any = null;
  if (credit?.report_json) {
    try { rep = JSON.parse(credit.report_json); } catch {}
  }
  console.log("DB Credit:", {
    id: credit?.id,
    score: credit?.score,
    dpd: credit?.dpd,
    total_outstanding: credit?.total_outstanding,
    providerRef: rep?.providerRef,
    tradelines: rep?.tradelines
  });

  // 3. Test pullExperianReport function
  const report = await pullExperianReport({ mobile: "8838864869", name: "Satyajeet Shashikant Kere" });
  console.log("pullExperianReport Output:", {
    score: report.score,
    scoreBand: report.scoreBand,
    dpdMax: report.dpdMax,
    totalOutstanding: report.totalOutstanding,
    tradelinesCount: report.tradelines?.length,
    tradelines: report.tradelines,
    applicantDetails: report.applicantDetails
  });

  process.exit(0);
}

main().catch(console.error);
