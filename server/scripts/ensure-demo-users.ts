import { ensureDemoUsers } from "../src/routes/auth.js";
import { q } from "../src/db/connection.js";

async function main() {
  console.log("Ensuring demo users in Supabase PostgreSQL...");
  await ensureDemoUsers();
  console.log("Demo users inserted/updated successfully!");

  const demoUsers = await q<{ id: number; name: string; email: string; role: string }>(
    "SELECT id, name, email, role FROM users WHERE email LIKE '%@nexus.demo' ORDER BY id LIMIT 10"
  );
  console.log("Verified demo users:", demoUsers);
  process.exit(0);
}

main().catch(err => {
  console.error("Failed to ensure demo users:", err);
  process.exit(1);
});
