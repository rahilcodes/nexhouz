import fs from "fs";
import path from "path";

// 1. Load environment variables manually from .env.local FIRST
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
    
    // Override the public anon key with the service role key for local testing to bypass RLS
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
      console.log("Overrode NEXT_PUBLIC_SUPABASE_ANON_KEY with SUPABASE_SERVICE_ROLE_KEY for RLS bypass.");
    }
  }
} catch (e) {
  console.error("Error loading .env.local:", e);
}

async function runTests() {
  // 2. Dynamically import DB functions to avoid hoisting before env vars load
  const { submitLead, fetchLeads, saveProperty, fetchAllProperties, deleteProperty } = await import("../lib/db");

  console.log("=== Testing Database Actions ===");
  
  // 1. Fetch properties
  const properties = await fetchAllProperties();
  console.log(`Successfully fetched ${properties.length} properties.`);
  if (properties.length === 0) {
    throw new Error("No properties in database to run lead submission test!");
  }
  
  const testProperty = properties[0];
  console.log(`Using property [id: ${testProperty.id}, title: ${testProperty.title}] for testing.`);

  // 2. Test Lead Submission
  console.log("\nSubmitting a test lead...");
  const leadPayload = {
    propertyId: testProperty.id,
    name: "Test User From Automation",
    email: "test.automated@nexhouz.com",
    phone: "+91 98765 43210",
    notes: "Automated test checking lead ingestion to Supabase.",
    leadType: "property_inquiry" as const
  };
  
  const leadSuccess = await submitLead(leadPayload);
  if (!leadSuccess) {
    throw new Error("Lead submission failed!");
  }
  console.log("✓ Lead submission returned success status.");
  
  // 3. Verify Lead in DB
  console.log("\nFetching leads...");
  const leads = await fetchLeads();
  const testLead = leads.find(l => l.email === "test.automated@nexhouz.com");
  if (!testLead) {
    throw new Error("Failed to find the submitted test lead in the database!");
  }
  console.log("✓ Test lead found in the database!");
  console.log("Lead Name:", testLead.name);
  console.log("Lead Type:", testLead.lead_type);
  console.log("Linked Property Title:", testLead.properties?.title);
  
  // 4. Test Property Creation
  console.log("\nCreating a dummy property via saveProperty...");
  const dummyProperty = {
    title: "Test Automated Modern Villa",
    slug: `test-automated-modern-villa-${Date.now()}`,
    location: "Kondapur, Hyderabad",
    price: 45000000,
    projectName: "Automated Testing Project",
    type: "Villa" as const,
    bhk: 4,
    area: "4,500 sq ft",
    possession: "Under Construction" as const,
    investmentType: "Capital Appreciation" as const,
    description: "An automated design test for Shopify-style property wizard storage.",
    architect: "Autopilot Architectures Ltd",
    featured: true,
    reraNumber: `RERA-TEST-${Date.now()}`,
    possessionDate: "Dec 2028",
    image: "/images/hero_modernist_villa.png",
    images: ["/images/hero_modernist_villa.png", "/images/obsidian_pavilion.png"],
    amenities: ["Private Infinity Lap Pool", "Tier 3 (Elite) Automation", "Lush Lagoon Gardens"],
    scores: {
      architecturalIntegrity: 95,
      investmentYield: 9.2,
      spatialEfficiency: 96,
      automationTier: "Tier 3 (Elite)" as const
    },
    nearby: {
      hospitals: 5,
      malls: 2,
      schools: 8,
      restaurants: 12,
      metroStations: 1,
      railwayStations: 0,
      itParks: 3
    },
    floorPlans: [
      { type: "4 BHK - West Facing", size: 4500, facing: "West", price: 45000000 },
      { type: "3 BHK - East Facing", size: 3600, facing: "East", price: 36000000 }
    ],
    recommendationReport: {
      investmentPotential: 9,
      familyFriendliness: 9,
      commuteConvenience: 8,
      schoolAccess: 9,
      hospitalAccess: 8,
      futureAppreciation: 10,
      builderTrustRating: 9,
      whyRecommended: "Highly recommended Villa choice with private pool and automated home automation systems in Kondapur."
    }
  };
  
  const saveSuccess = await saveProperty(dummyProperty);
  if (!saveSuccess) {
    throw new Error("Failed to save/create property via saveProperty!");
  }
  console.log("✓ Dummy property saved successfully.");
  
  // 5. Verify Property was created
  const allPropsAfter = await fetchAllProperties();
  const savedProp = allPropsAfter.find(p => p.title === "Test Automated Modern Villa");
  if (!savedProp) {
    throw new Error("Created property was not found in properties list!");
  }
  console.log("✓ Created property fetched successfully from DB!");
  console.log("Created Property ID:", savedProp.id);
  console.log("Property Amenities Count:", savedProp.amenities.length);
  console.log("Property Floor Plans Count:", savedProp.floorPlans?.length);
  console.log("Property Images Count:", savedProp.images?.length);
  console.log("Property Recommendation Report:", savedProp.recommendationReport);

  // 6. Delete Dummy Property
  console.log("\nDeleting dummy property...");
  const deleteSuccess = await deleteProperty(savedProp.id);
  if (!deleteSuccess) {
    throw new Error("Failed to delete the dummy property!");
  }
  console.log("✓ Dummy property deleted successfully!");
  
  console.log("\n=== ALL DATABASE INTEGRATION TESTS PASSED ===");
}

runTests().catch(e => {
  console.error("Test failed:", e);
  process.exit(1);
});
