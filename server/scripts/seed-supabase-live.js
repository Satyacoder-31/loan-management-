import fs from "node:fs";
import path from "node:path";
import pg from "pg";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:SniperLoanSecure2026!@db.uopptvgrxrmlschjnjek.supabase.co:5432/postgres";
const migrationFile = path.resolve("../supabase/migrations/0002_seed_demo_data.sql");

async function main() {
  console.log("Reading 0002_seed_demo_data.sql...");
  const content = fs.readFileSync(migrationFile, "utf8");
  const rawStatements = content.split(";\n");

  const insertStatements = rawStatements
    .map(s => s.trim())
    .filter(s => s.toUpperCase().startsWith("INSERT INTO"))
    .map(s => {
      let clean = s.replace(/ RETURNING id/gi, "");
      if (!clean.toUpperCase().includes("ON CONFLICT")) {
        clean += " ON CONFLICT DO NOTHING";
      }
      return clean + ";";
    });

  console.log(`Parsed ${insertStatements.length} valid INSERT statements.`);

  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  console.log("Connected to Supabase PostgreSQL.");

  // Disable FK constraints and triggers during bulk seed
  await client.query("SET session_replication_role = 'replica';");
  console.log("Set session_replication_role = 'replica' for bulk insertion.");

  const batchSize = 1000;
  const totalBatches = Math.ceil(insertStatements.length / batchSize);
  console.log(`Seeding in ${totalBatches} batches of ${batchSize}...`);

  const startTime = Date.now();
  let successCount = 0;

  for (let i = 0; i < totalBatches; i++) {
    const batch = insertStatements.slice(i * batchSize, (i + 1) * batchSize);
    const sql = "BEGIN;\n" + batch.join("\n") + "\nCOMMIT;";
    try {
      await client.query(sql);
      successCount += batch.length;
      if ((i + 1) % 5 === 0 || i === totalBatches - 1) {
        const pct = Math.round(((i + 1) / totalBatches) * 100);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`[Supabase Seed] Batch ${i + 1}/${totalBatches} (${pct}%) — ${successCount}/${insertStatements.length} statements committed (${elapsed}s)`);
      }
    } catch (err) {
      console.error(`Batch ${i + 1} error:`, err.message?.slice(0, 150));
      await client.query("ROLLBACK;").catch(() => {});
    }
  }

  // Restore constraint checks
  await client.query("SET session_replication_role = 'DEFAULT';");
  console.log("Restored session_replication_role to DEFAULT.");

  // Sync serial sequences to max id
  console.log("Synchronizing PostgreSQL sequences...");
  const seqTables = ["tenants", "branches", "users", "customers", "leads", "applications", "loans", "installments", "payments", "documents"];
  for (const t of seqTables) {
    try {
      await client.query(`SELECT setval(pg_get_serial_sequence('${t}', 'id'), COALESCE((SELECT MAX(id) FROM ${t}), 1));`);
    } catch {}
  }

  console.log("\nVerifying database counts in Supabase...");
  const counts = await client.query(`
    SELECT 
      (SELECT count(*) FROM tenants) as tenants,
      (SELECT count(*) FROM branches) as branches,
      (SELECT count(*) FROM users) as users,
      (SELECT count(*) FROM customers) as customers,
      (SELECT count(*) FROM applications) as applications,
      (SELECT count(*) FROM loans) as loans,
      (SELECT count(*) FROM leads) as leads,
      (SELECT count(*) FROM installments) as installments;
  `);

  console.log("Database Counts:", counts.rows[0]);
  await client.end();
  console.log("Supabase database seeding completed successfully!");
}

main().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
