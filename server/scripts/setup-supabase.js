import fs from "node:fs";
import path from "node:path";
import pg from "pg";

const connectionString = "postgresql://postgres:SniperLoanSecure2026!@db.uopptvgrxrmlschjnjek.supabase.co:5432/postgres";

async function main() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  console.log("Connecting to Supabase PostgreSQL at db.uopptvgrxrmlschjnjek.supabase.co...");
  await client.connect();
  console.log("Connected successfully!");

  const migrationFile = path.resolve("../supabase/migrations/0001_provider_hub.sql");
  if (fs.existsSync(migrationFile)) {
    console.log("Applying 0001_provider_hub.sql...");
    const sql = fs.readFileSync(migrationFile, "utf8");
    await client.query(sql);
    console.log("0001_provider_hub.sql applied successfully!");
  }

  const tablesRes = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);

  console.log("Current public tables in Supabase:", tablesRes.rows.map(r => r.table_name));
  await client.end();
}

main().catch(err => {
  console.error("Setup error:", err);
  process.exit(1);
});
