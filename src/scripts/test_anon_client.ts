import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

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
  }
} catch (e) {
  console.error("Error loading .env.local:", e);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing credentials in env");
  process.exit(1);
}

// Initialize public anon client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testQuery() {
  console.log("=== Testing fetchAllProperties using ANON key ===");
  
  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      locations (*),
      projects (*),
      property_images (*),
      property_amenities (amenities (*)),
      floor_plans (*),
      property_recommendation_reports (*)
    `);
    
  if (error) {
    console.error("Query FAILED:", error.message);
    console.error("Details:", error.details);
    console.error("Hint:", error.hint);
  } else {
    console.log("Query SUCCESS!");
    console.log(`Fetched properties count: ${data?.length}`);
    if (data && data.length > 0) {
      console.log("Sample property structure from anon key:");
      const prop = data[0];
      console.log("- Title:", prop.title);
      console.log("- Location:", prop.locations);
      console.log("- Project:", prop.projects);
      console.log("- Images Count:", prop.property_images?.length);
      console.log("- Amenities Count:", prop.property_amenities?.length);
      console.log("- Floor Plans Count:", prop.floor_plans?.length);
      console.log("- Recommendation Report:", prop.property_recommendation_reports);
    }
  }
}

testQuery().catch(console.error);
