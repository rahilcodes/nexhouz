import fs from "fs";
import path from "path";
import { Client } from "pg";

// Load environment variables manually from .env.local
try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf-8");
    envFile.split("\n").forEach(line => {
      const parts = line.split("=");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join("=").trim().replace(/['"]/g, "");
        if (key && !key.startsWith("#")) {
          process.env[key] = value;
        }
      }
    });
    console.log("Loaded .env.local environment variables successfully.");
  }
} catch (e) {
  console.error("Error loading .env.local file:", e);
}

async function runSetup() {
  const client = new Client({
    host: 'db.yjxtmgkkwlyfkzjonwvb.supabase.co',
    port: 5432,
    user: 'postgres',
    password: '7hTvZ/)p6qS2^^_',
    database: 'postgres',
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log("Connecting to PostgreSQL...");
    await client.connect();
    console.log("Connected successfully. Reading schema.sql...");
    
    const schemaSqlPath = path.resolve(process.cwd(), "src/scripts/schema.sql");
    const sql = fs.readFileSync(schemaSqlPath, "utf8");
    
    console.log("Running DDL scripts on Supabase...");
    await client.query(sql);
    console.log("Database schema initialized successfully!");
  } catch (err: any) {
    console.error("Database initialization failed:", err.message || err);
  } finally {
    await client.end();
  }
}

runSetup();
