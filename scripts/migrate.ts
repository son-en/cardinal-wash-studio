import "dotenv/config";
import { migrate } from "drizzle-orm/libsql/migrator";
import { db, client } from "../src/lib/db";

async function main() {
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations applied.");
  client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
