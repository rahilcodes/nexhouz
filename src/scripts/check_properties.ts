import fs from "fs";
import path from "path";

// Load environment variables manually
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
  }
} catch (e) {
  console.error("Error loading .env.local:", e);
}

async function checkProps() {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  const { data, error } = await supabase
    .from("properties")
    .select("id, title, slug, price");

  if (error) {
    console.error("Error fetching properties:", error);
    return;
  }

  console.log("=== Properties in Supabase ===");
  data?.forEach(p => {
    console.log(`ID: ${p.id} | Title: "${p.title}" | Slug: "${p.slug}" | Price: ${p.price}`);
  });
}

checkProps();
