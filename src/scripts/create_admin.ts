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
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local!");
  process.exit(1);
}

// Initialize admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdmin() {
  const email = "admin@nexhouz.com";
  const password = "adminpassword123";
  
  console.log(`Attempting to create admin user: ${email}...`);
  
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });
  
  if (error) {
    console.error("Failed to create admin user:", error.message);
    process.exit(1);
  }
  
  console.log("\n=== ADMIN USER CREATED SUCCESSFULLY ===");
  console.log(`Email ID: ${email}`);
  console.log(`Password: ${password}`);
  console.log("=======================================");
  
  // Link profile row if needed
  if (data?.user?.id) {
    const { error: profileErr } = await supabase
      .from("profiles")
      .upsert({
        id: data.user.id,
        email: email,
        full_name: "NexHouz Administrator",
        role: "admin"
      }, { onConflict: "id" });
      
    if (profileErr) {
      console.warn("Note: Profile row linking warning -", profileErr.message);
    } else {
      console.log("Admin profile record created/updated successfully.");
    }
  }
}

createAdmin().catch(console.error);
