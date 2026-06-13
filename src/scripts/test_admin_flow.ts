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

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAdminFlow() {
  const email = "admin@nexhouz.com";
  const password = "adminpassword123";
  
  console.log(`\nLogging in as ${email}...`);
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (authError) {
    console.error("Login FAILED:", authError.message);
    process.exit(1);
  }
  
  console.log("Login SUCCESS!");
  console.log(`User UID: ${authData.user.id}`);
  
  // 1. Fetch properties
  console.log("\nFetching properties as logged-in Admin...");
  const { data: properties, error: propertiesError } = await supabase
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
    
  if (propertiesError) {
    console.error("Properties Fetch FAILED:", propertiesError.message);
    console.error("Details:", propertiesError.details);
    console.error("Hint:", propertiesError.hint);
  } else {
    console.log(`✓ Properties Fetch SUCCESS! Found: ${properties?.length} listings.`);
  }

  // 2. Fetch leads
  console.log("\nFetching leads as logged-in Admin...");
  const { data: leads, error: leadsError } = await supabase
    .from("leads")
    .select(`
      *,
      properties (title)
    `);
    
  if (leadsError) {
    console.error("Leads Fetch FAILED:", leadsError.message);
    console.error("Details:", leadsError.details);
    console.error("Hint:", leadsError.hint);
  } else {
    console.log(`✓ Leads Fetch SUCCESS! Found: ${leads?.length} leads.`);
  }
}

testAdminFlow().catch(console.error);
