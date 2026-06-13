import fs from "fs";
import path from "path";

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
    console.log("Loaded .env.local variables.");
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    }
  }
} catch (e) {
  console.error("Error loading .env.local:", e);
}

async function testNormalize() {
  const { fetchAllProperties } = await import("../lib/db");
  console.log("=== Testing fetchAllProperties & normalizeProperty ===");
  
  const properties = await fetchAllProperties();
  console.log(`Successfully fetched and normalized: ${properties.length} properties.`);
  if (properties.length > 0) {
    console.log("First Property sample normalized output:");
    console.log(properties[0]);
  }
}

testNormalize().catch(console.error);
