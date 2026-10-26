# Digitap enablement report — KYC Validation Suite v4.91

Probed: 2026-10-20T11:19:02.431Z · env **PROD** · client **01338635** · host `https://svc.digitap.ai`

Synthetic payloads only (format-valid, non-existent records) — no real profile touched,
no customer data sent. One call per endpoint.

| endpoint | path | HTTP | result_code | verdict | latency | note |
|---|---|---|---|---|---|---|
| pan_basic_v1 | `/validation/kyc/v1/pan_basic` | 200 | 103 | enabled | 4290ms | No record found for the given input |
| pan_basic_v2 | `/validation/kyc/v2/pan_basic` | 200 | 103 | enabled | 1961ms | No record found for the given input |
| pan_details | `/validation/kyc/v1/pan_details` | 200 | 103 | enabled | 3444ms | No record found for the given input |
| pan_details_bc | `/validation/kyc/v1/pan_details_bc` | 412 | — | not_enabled | 91ms | PAN Status Check is not Enabled. Please contact support/RM |
| pan_details_plus | `/validation/kyc/v1/pan_details_plus` | 200 | 103 | enabled | 1520ms | No record found for the given input |
| pan_206ab | `/validation/kyc/v1/form206ab_compliance_status` | 200 | 102 | enabled | 1005ms | Invalid ID number or combination of inputs |
| pan_itr | `/validation/kyc/v1/itr_basic` | 200 | 109 | enabled | 2914ms | No ITR filing records found for the PAN for the search period |
| pan_to_name | `/validation/kyc/v1/pan_to_name` | 401 | — | auth_failed | 272ms | Client Authentication Failed |
| pan_to_fname | `/validation/kyc/v1/pan_to_fname` | 200 | 103 | enabled | 2034ms | No record found for the given input |
| pan_profile | `/validation/kyc/v1/pan_profile` | 503 | — | unexpected | 60ms | Service Disabled |
| pan_account_linkage | `/validation/misc/v1/pan-account-linkage` | 503 | — | unexpected | 78ms | Service Disabled |
| voter | `/validation/kyc/v1/voter` | 200 | 103 | enabled | 1238ms | No record found for the given input |
| passport | `/validation/kyc/v1/passport` | 200 | 103 | enabled | 5449ms | No Records Found for the Given ID or Combination of Inputs |
| pan_aadhaar_link | `/validation/kyc/v1/pan_aadhaar_link` | 200 | 103 | enabled | 4393ms | — |
| pan_to_masked_aadhaar | `/validation/kyc/v1/pan_to_masked_aadhaar` | 200 | 102 | enabled | 5989ms | Invalid ID Number or Combination of Inputs |
| aadhaar_to_masked_pan | `/validation/kyc/v1/aadhaar_to_masked_pan` | 200 | 101 | enabled | 4198ms | — |
| aadhaar_to_unmasked_pan | `/validation/kyc/v1/aadhaar_to_unmasked_pan` | 401 | — | auth_failed | 235ms | Client Authentication Failed |
| dl | `/validation/kyc/v1/dl` | 200 | 102 | enabled | 3143ms | Invalid ID number or combination of inputs |
| dl_plus | `/validation/kyc/v1/dl_plus` | 200 | 102 | enabled | 3117ms | Invalid ID number or combination of inputs |
| udid | `/validation/kyc/v1/kyc_udid_verification` | 200 | 103 | enabled | 5825ms | No record found for the given input |
| experian | `/validation/misc/v1/mobile-name-lookup` | 200 | 101 | enabled | 288ms | — |
| mnv_otp | `/validation/misc/v1/mobile-name-lookup` | 200 | 101 | enabled | 215ms | — |
| mnv_silent | `/validation/misc/v1/mobile-name-lookup` | 200 | 101 | enabled | 293ms | — |
| mnv_report | `/validation/misc/v1/mobile-name-lookup` | 200 | 101 | enabled | 177ms | — |

**Enabled: 19/24** — HTTP 200 + result 101/102/103 = credentials OK + product enabled.

Legend: 401 = wrong credentials for this env · 403 = whitelist the server egress IP with
Digitap · 412 = ask your RM to enable the product · 400 = endpoint reachable, check payload.