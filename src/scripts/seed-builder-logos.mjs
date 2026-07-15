// Script to create builder_logos table and seed default Hyderabad builder logos
// Run: node scripts/seed-builder-logos.mjs

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { readFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Sign in as admin to bypass RLS
const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
  email: "admin@nexhouz.com",
  password: "adminpassword123"
});

if (authError) {
  console.error("Auth failed:", authError.message);
  process.exit(1);
}
console.log("✅ Authenticated as admin");

// Default Hyderabad builders
const builders = [
  {
    name: "Hallmark Developers",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png",
    website_url: "https://www.hallmarkdevelopers.com",
    display_order: 1,
    active: true
  },
  {
    name: "Aparna Constructions",
    logo_url: "",
    website_url: "https://www.aparnaone.com",
    display_order: 2,
    active: true
  },
  {
    name: "Prestige Group",
    logo_url: "",
    website_url: "https://www.prestigeconstructions.com",
    display_order: 3,
    active: true
  },
  {
    name: "Ramky Estates",
    logo_url: "",
    website_url: "https://www.ramky.com",
    display_order: 4,
    active: true
  },
  {
    name: "My Home Constructions",
    logo_url: "",
    website_url: "https://www.myhomeconstructions.com",
    display_order: 5,
    active: true
  },
  {
    name: "INCOR Infrastructure",
    logo_url: "",
    website_url: "https://www.incorinfrastructure.com",
    display_order: 6,
    active: true
  },
  {
    name: "Aliens Space Station",
    logo_url: "",
    website_url: "https://www.aliensgroup.in",
    display_order: 7,
    active: true
  },
  {
    name: "Vertex Homes",
    logo_url: "",
    website_url: "https://www.vertexhomeshyd.com",
    display_order: 8,
    active: true
  }
];

const { data, error } = await supabase
  .from("builder_logos")
  .upsert(builders, { onConflict: "name" });

if (error) {
  console.error("Error seeding builder logos:", error.message);
} else {
  console.log("✅ Builder logos seeded successfully");
}
