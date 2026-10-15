import { digitapConfig, formatDigitapTimestamp } from "../src/adapters/digitap.js";

async function main() {
  const cfg = digitapConfig("uat");
  console.log("Config:", cfg);
  if (!cfg.creds) return;

  const auth = "Basic " + Buffer.from(`${cfg.creds.clientId}:${cfg.creds.clientSecret}`).toString("base64");
  const ts = formatDigitapTimestamp();

  const payload = {
    client_ref_num: "test-" + Date.now(),
    mobile_no: "7908096603",
    name_lookup: 0,
    first_name: "Shubhra",
    last_name: "Dutta",
    date_of_birth: "1991-09-24",
    pan: "FAWPD4345T",
    email: "shubhra.dutta@digitap.ai",
    consent_message: "I hereby authorize Experian to pull my credit report for test purpose",
    consent_acceptance: "Yes",
    device_type: "web",
    otp: "123456",
    timestamp: ts,
    device_ip: "103.21.124.5"
  };

  const tests = [
    { name: "Mobile Lookup", url: "https://svcdemo.digitap.work/validation/misc/v1/mobile-name-lookup", body: { client_ref_num: "m-" + Date.now(), mobile: "7908096603" } },
    { name: "PAN Basic", url: "https://svcdemo.digitap.work/validation/kyc/v1/pan_basic", body: { client_ref_num: "p-" + Date.now(), pan: "FAWPD4345T" } },
    { name: "PAN Details", url: "https://svcdemo.digitap.work/validation/kyc/v1/pan_details", body: { client_ref_num: "pd-" + Date.now(), pan: "FAWPD4345T" } },
    { name: "Credit Analytics (apidemo)", url: "https://apidemo.digitap.work/credit_analytics/request", body: payload },
    { name: "Credit Analytics (svcdemo)", url: "https://svcdemo.digitap.work/credit_analytics/request", body: payload }
  ];

  for (const t of tests) {
    try {
      console.log(`\nTesting ${t.name} at ${t.url}...`);
      const res = await fetch(t.url, {
        method: "POST",
        headers: { "content-type": "application/json", "authorization": auth },
        body: JSON.stringify(t.body)
      });
      console.log(`Status: ${res.status}`);
      const text = await res.text();
      console.log(`Response: ${text.slice(0, 300)}`);
    } catch (e: any) {
      console.error(`Error:`, e.message);
    }
  }
}

main();
