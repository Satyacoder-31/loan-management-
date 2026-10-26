import { mobileNameLookup } from "../src/adapters/digitap.js";

async function main() {
  const res = await mobileNameLookup("8838864869");
  console.log("Lookup result:", res);
}

main().catch(console.error);
