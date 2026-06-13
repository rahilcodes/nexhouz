import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { properties } from "../data/properties";

// 1. Load environment variables manually from .env.local
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-supabase")) {
  console.error("ERROR: Please set actual NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local first!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helpers
function getNeighborhood(locStr: string): string {
  const neighborhoods = ["Kokapet", "Jubilee Hills", "Hitec City", "Financial District", "Kondapur", "Gandipet", "Narsingi", "Tellapur", "Madhapur", "Whitefield"];
  for (const nh of neighborhoods) {
    if (locStr.toLowerCase().includes(nh.toLowerCase())) {
      return nh;
    }
  }
  return "Kokapet";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

function parseArea(areaStr: string): number {
  const num = parseInt(areaStr.replace(/[^\d]/g, ""), 10);
  return isNaN(num) ? 3500 : num;
}

const MOCK_GALLERY = [
  "/images/hero_modernist_villa.png",
  "/images/obsidian_pavilion.png",
  "/images/vanguard_penthouse.png",
  "/images/hyderabad_luxury_towers.png",
  "/images/hyderabad_skyline_facade.png",
];

async function runMigration() {
  console.log("Starting NexHouz Supabase Data Seeding...");

  // 1. Seed Builders
  console.log("Seeding builders...");
  const builderNames = ["Prestige Estates Projects Ltd", "Signature Builders", "DLF Luxury Homes", "Zaha Hadid Developments"];
  const builderMap: Record<string, string> = {};
  
  for (const name of builderNames) {
    const slug = slugify(name);
    const { data, error } = await supabase
      .from("builders")
      .upsert({ name, slug, logo_url: `/images/builders/${slug}.png`, description: `${name} represents elite class real estate developments in Hyderabad.` }, { onConflict: "name" })
      .select("id")
      .single();
      
    if (error) {
      console.error(`Error inserting builder ${name}:`, error.message);
    } else if (data) {
      builderMap[name] = data.id;
    }
  }

  // 2. Seed Locations
  console.log("Seeding locations...");
  const locationNames = ["Kokapet", "Jubilee Hills", "Hitec City", "Financial District", "Kondapur", "Gandipet", "Narsingi", "Tellapur", "Madhapur", "Whitefield"];
  const locationMap: Record<string, string> = {};
  
  for (const name of locationNames) {
    const slug = slugify(name);
    const { data, error } = await supabase
      .from("locations")
      .upsert({
        name, slug, city: "Hyderabad", state: "Telangana",
        aqi_score: 64, dominant_pollutant: "PM2.5", pm25: 16.5, pm10: 22.1, o3: 65, no2: 28.5, so2: 4.8, co: 512
      }, { onConflict: "name" })
      .select("id")
      .single();
      
    if (error) {
      console.error(`Error inserting location ${name}:`, error.message);
    } else if (data) {
      locationMap[name] = data.id;
    }
  }

  // 3. Seed Amenities Lookup
  console.log("Seeding global amenities lookup...");
  const allAmenities = new Set<string>();
  properties.forEach(p => p.amenities.forEach(a => allAmenities.add(a)));
  
  const amenityMap: Record<string, string> = {};
  for (const name of Array.from(allAmenities)) {
    const { data, error } = await supabase
      .from("amenities")
      .upsert({ name, icon_name: "Check", category: "General" }, { onConflict: "name" })
      .select("id")
      .single();
      
    if (error) {
      console.error(`Error inserting amenity ${name}:`, error.message);
    } else if (data) {
      amenityMap[name] = data.id;
    }
  }

  // 4. Seed Projects & Properties
  console.log("Seeding projects, properties, images, floor plans, and reports...");
  
  for (let i = 0; i < properties.length; i++) {
    const mockProp = properties[i];
    const nbh = getNeighborhood(mockProp.location);
    const locationId = locationMap[nbh];
    
    // Assign a builder based on index
    const builderName = builderNames[i % builderNames.length];
    const builderId = builderMap[builderName];
    
    // Create a Project for this property
    const projectName = `${mockProp.title.replace("The ", "")} Project`;
    const projectSlug = slugify(projectName);
    
    const { data: projectData, error: projErr } = await supabase
      .from("projects")
      .upsert({
        builder_id: builderId,
        location_id: locationId,
        name: projectName,
        slug: projectSlug,
        rera_number: mockProp.reraNumber || `PRM/KA/RERA/${1200 + i}/${400 + i}/PR/290224/00${6000 + i}`,
        possession_date: mockProp.possessionDate || (mockProp.possession === "Ready" ? "Ready to Move" : "Dec 2027"),
        description: `Premium development under the management of ${builderName} situated at ${nbh}.`
      }, { onConflict: "slug" })
      .select("id")
      .single();
      
    if (projErr || !projectData) {
      console.error(`Error inserting project ${projectName}:`, projErr?.message);
      continue;
    }
    
    const projectId = projectData.id;
    
    // Insert Property
    const areaSqft = parseArea(mockProp.area);
    const { data: propertyData, error: propErr } = await supabase
      .from("properties")
      .upsert({
        project_id: projectId,
        location_id: locationId,
        title: mockProp.title,
        slug: mockProp.slug,
        price: mockProp.price,
        property_type: mockProp.type,
        bhk: mockProp.bhk,
        area_sqft: areaSqft,
        possession_status: mockProp.possession,
        investment_type: mockProp.investmentType,
        description: mockProp.description,
        architect: mockProp.architect,
        featured: mockProp.featured,
        
        score_architectural: mockProp.scores.architecturalIntegrity,
        score_yield: mockProp.scores.investmentYield,
        score_spatial: mockProp.scores.spatialEfficiency,
        score_automation: mockProp.scores.automationTier,
        
        nearby_hospitals: mockProp.nearby?.hospitals || 12,
        nearby_malls: mockProp.nearby?.malls || 6,
        nearby_schools: mockProp.nearby?.schools || 10,
        nearby_restaurants: mockProp.nearby?.restaurants || 15,
        nearby_metro_stations: mockProp.nearby?.metroStations || 2,
        nearby_railway_stations: mockProp.nearby?.railwayStations || 1,
        nearby_it_parks: mockProp.nearby?.itParks || 4
      }, { onConflict: "slug" })
      .select("id")
      .single();
      
    if (propErr || !propertyData) {
      console.error(`Error inserting property ${mockProp.title}:`, propErr?.message);
      continue;
    }
    
    const propertyId = propertyData.id;
    console.log(`Successfully seeded Property: ${mockProp.title}`);

    // Insert Images (Primary + 2 mock gallery images)
    await supabase.from("property_images").delete().eq("property_id", propertyId);
    
    // Primary
    await supabase.from("property_images").insert({
      property_id: propertyId,
      image_url: mockProp.image,
      display_order: 0,
      is_primary: true
    });
    
    // Gallery
    const galleryImages = MOCK_GALLERY.filter(img => img !== mockProp.image).slice(0, 2);
    for (let k = 0; k < galleryImages.length; k++) {
      await supabase.from("property_images").insert({
        property_id: propertyId,
        image_url: galleryImages[k],
        display_order: k + 1,
        is_primary: false
      });
    }

    // Link Amenities
    await supabase.from("property_amenities").delete().eq("property_id", propertyId);
    for (const am of mockProp.amenities) {
      const amenityId = amenityMap[am];
      if (amenityId) {
        await supabase.from("property_amenities").insert({
          property_id: propertyId,
          amenity_id: amenityId
        });
      }
    }

    // Insert Floor Plans
    await supabase.from("floor_plans").delete().eq("property_id", propertyId);
    if (mockProp.floorPlans && mockProp.floorPlans.length > 0) {
      for (const fp of mockProp.floorPlans) {
        await supabase.from("floor_plans").insert({
          property_id: propertyId,
          unit_type: fp.type,
          size_sqft: fp.size,
          facing: fp.facing,
          price: fp.price
        });
      }
    } else {
      // Generate default floor plans based on BHK
      const layouts = [
        { type: `${mockProp.bhk} BHK`, size: areaSqft, facing: "East", price: mockProp.price },
        { type: `${mockProp.bhk - 1} BHK`, size: Math.round(areaSqft * 0.8), facing: "West", price: Math.round(mockProp.price * 0.78) }
      ].filter(l => l.size > 500);
      
      for (const layout of layouts) {
        await supabase.from("floor_plans").insert({
          property_id: propertyId,
          unit_type: layout.type,
          size_sqft: layout.size,
          facing: layout.facing,
          price: layout.price
        });
      }
    }

    // Insert Recommendation Report
    await supabase.from("property_recommendation_reports").delete().eq("property_id", propertyId);
    await supabase.from("property_recommendation_reports").insert({
      property_id: propertyId,
      investment_potential: Math.min(10, Math.max(1, Math.round(mockProp.scores.investmentYield + 1))),
      family_friendliness: 8,
      commute_convenience: 9,
      school_access: 8,
      hospital_access: 7,
      future_appreciation: 9,
      builder_trust_rating: 9,
      why_recommended: `This property is highly recommended for buyers seeking a ${mockProp.investmentType} profile. Architecturally crafted by ${mockProp.architect}, it offers exceptional spatial efficiency across a ${mockProp.area} layout. Positioned in the prime ${nbh} micro-market, it features excellent infrastructure and direct access to major IT nodes.`
    });
  }

  console.log("NexHouz Database Seeding completed successfully!");
}

runMigration().catch(err => {
  console.error("Migration failed:", err);
});
