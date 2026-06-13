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
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing credentials in env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log("=== NexHouz Migration Verification ===");
  
  const tables = [
    "builders",
    "locations",
    "amenities",
    "projects",
    "properties",
    "property_images",
    "floor_plans",
    "property_recommendation_reports",
    "leads"
  ];
  
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true });
      
    if (error) {
      console.error(`- Table [${table}]: Error - ${error.message}`);
    } else {
      console.log(`- Table [${table}]: Count = ${count}`);
    }
  }
  
  console.log("\n=== Checking One Property Structure ===");
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
    `)
    .limit(1)
    .maybeSingle();
    
  if (error) {
    console.error("Error fetching sample property:", error.message);
  } else if (!data) {
    console.log("No properties found in database!");
  } else {
    console.log("Sample Property Title:", data.title);
    console.log("Slug:", data.slug);
    console.log("Price:", data.price);
    console.log("Location Name:", data.locations?.name);
    console.log("Project Name:", data.projects?.name);
    console.log("Images Count:", data.property_images?.length);
    console.log("Amenities Count:", data.property_amenities?.length);
    console.log("Floor Plans Count:", data.floor_plans?.length);
    console.log("Recommendation Report:", data.property_recommendation_reports);
  }
}

verify().catch(console.error);
