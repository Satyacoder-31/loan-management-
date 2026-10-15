# Digitap enablement report — KYC Validation Suite v4.91

Probed: 2026-10-15T12:42:55.674Z · env **UAT** · client **07625809** · host `https://svcdemo.digitap.work`

Synthetic payloads only (format-valid, non-existent records) — no real profile touched,
no customer data sent. One call per endpoint.

| endpoint | path | HTTP | result_code | verdict | latency | note |
|---|---|---|---|---|---|---|
| pan_basic_v1 | `/validation/kyc/v1/pan_basic` | 401 | — | auth_failed | 516ms | Client Authentication Failed |
| pan_basic_v2 | `/validation/kyc/v2/pan_basic` | 401 | — | auth_failed | 583ms | Client Authentication Failed |
| pan_details | `/validation/kyc/v1/pan_details` | 401 | — | auth_failed | 131ms | Client Authentication Failed |
| pan_details_bc | `/validation/kyc/v1/pan_details_bc` | 401 | — | auth_failed | 126ms | Client Authentication Failed |
| pan_details_plus | `/validation/kyc/v1/pan_details_plus` | 401 | — | auth_failed | 4175ms | Client Authentication Failed |
| pan_206ab | `/validation/kyc/v1/form206ab_compliance_status` | 401 | — | auth_failed | 4039ms | Client Authentication Failed |
| pan_itr | `/validation/kyc/v1/itr_basic` | 401 | — | auth_failed | 4072ms | Client authentication failed |
| pan_to_name | `/validation/kyc/v1/pan_to_name` | 401 | — | auth_failed | 2901ms | Client Authentication Failed |
| pan_to_fname | `/validation/kyc/v1/pan_to_fname` | 401 | — | auth_failed | 5369ms | Client Authentication Failed |
| pan_profile | `/validation/kyc/v1/pan_profile` | 503 | — | unexpected | 134ms | — |
| pan_account_linkage | `/validation/misc/v1/pan-account-linkage` | 503 | — | unexpected | 48ms | — |
| voter | `/validation/kyc/v1/voter` | 401 | — | auth_failed | 325ms | Client Authentication Failed |
| passport | `/validation/kyc/v1/passport` | 401 | — | auth_failed | 2931ms | Client Authentication Failed |
| pan_aadhaar_link | `/validation/kyc/v1/pan_aadhaar_link` | 401 | — | auth_failed | 2928ms | Client Authentication Failed |
| pan_to_masked_aadhaar | `/validation/kyc/v1/pan_to_masked_aadhaar` | 401 | — | auth_failed | 199ms | Client Authentication Failed |
| aadhaar_to_masked_pan | `/validation/kyc/v1/aadhaar_to_masked_pan` | 401 | — | auth_failed | 279ms | Client Authentication Failed |
| aadhaar_to_unmasked_pan | `/validation/kyc/v1/aadhaar_to_unmasked_pan` | 401 | — | auth_failed | 161ms | Client Authentication Failed |
| dl | `/validation/kyc/v1/dl` | 401 | — | auth_failed | 3337ms | Client Authentication Failed |
| dl_plus | `/validation/kyc/v1/dl_plus` | 401 | — | auth_failed | 242ms | Client Authentication Failed |
| udid | `/validation/kyc/v1/kyc_udid_verification` | 401 | — | auth_failed | 4031ms | Client Authentication Failed |
| experian | `/validation/misc/v1/mobile-name-lookup` | 200 | 101 | enabled | 2822ms | — |
| mnv_otp | `/validation/misc/v1/mobile-name-lookup` | 200 | 101 | enabled | 3525ms | — |
| mnv_silent | `/validation/misc/v1/mobile-name-lookup` | 200 | 101 | enabled | 3519ms | — |
| mnv_report | `/validation/misc/v1/mobile-name-lookup` | 200 | 101 | enabled | 3600ms | — |

**Enabled: 4/24** — HTTP 200 + result 101/102/103 = credentials OK + product enabled.

Legend: 401 = wrong credentials for this env · 403 = whitelist the server egress IP with
Digitap · 412 = ask your RM to enable the product · 400 = endpoint reachable, check payload.