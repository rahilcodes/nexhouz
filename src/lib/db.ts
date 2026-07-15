import { supabase } from "./supabaseClient";
import { Property, FloorPlan, AQIData, NearbyAmenities } from "@/data/properties";

// Normalizes database property payload to UI Property model
export function normalizeProperty(dbProp: any): Property {
  // Extract primary image
  let primaryImage = "/images/hero_modernist_villa.png";
  const allImages: string[] = [];
  if (dbProp.property_images && dbProp.property_images.length > 0) {
    const sorted = [...dbProp.property_images].sort((a, b) => a.display_order - b.display_order);
    const primary = sorted.find(img => img.is_primary) || sorted[0];
    primaryImage = primary.image_url;
    sorted.forEach(img => allImages.push(img.image_url));
  } else if (dbProp.image_url) {
    primaryImage = dbProp.image_url;
    allImages.push(dbProp.image_url);
  }

  // Extract amenities
  const amenities: string[] = [];
  if (dbProp.property_amenities && dbProp.property_amenities.length > 0) {
    dbProp.property_amenities.forEach((pa: any) => {
      if (pa.amenities && pa.amenities.name) {
        amenities.push(pa.amenities.name);
      }
    });
  }

  // Extract floor plans
  const floorPlans: FloorPlan[] = [];
  if (dbProp.floor_plans && dbProp.floor_plans.length > 0) {
    dbProp.floor_plans.forEach((fp: any) => {
      floorPlans.push({
        type: fp.unit_type,
        size: Number(fp.size_sqft),
        facing: fp.facing || "East",
        price: Number(fp.price)
      });
    });
  }

  // Extract location intelligence
  const locationName = dbProp.locations?.name || "Kokapet";
  const city = dbProp.locations?.city || "Hyderabad";
  
  const aqi: AQIData = {
    score: dbProp.locations?.aqi_score ?? 64,
    dominantPollutant: dbProp.locations?.dominant_pollutant ?? "PM2.5",
    pm25: Number(dbProp.locations?.pm25 ?? 17.2),
    pm10: Number(dbProp.locations?.pm10 ?? 20.4),
    o3: Number(dbProp.locations?.o3 ?? 72),
    no2: Number(dbProp.locations?.no2 ?? 32.9),
    so2: Number(dbProp.locations?.so2 ?? 5.6),
    co: Number(dbProp.locations?.co ?? 587)
  };

  let cleanDescription = dbProp.description || "";
  const customStatsMatch = cleanDescription.match(/<!-- CONNECTIVITY_STATS:([\s\S]*?)-->/);
  let customStats: Record<string, number> = {};
  
  if (customStatsMatch) {
    try {
      customStats = JSON.parse(customStatsMatch[1].trim());
      cleanDescription = cleanDescription.replace(/<!-- CONNECTIVITY_STATS:[\s\S]*?-->/g, "").trim();
    } catch (e) {
      console.error("Error parsing custom connectivity stats:", e);
    }
  }

  // Extract custom property specs (like areaUnit, plotSize, plotSizeUnit)
  const customSpecsMatch = cleanDescription.match(/<!-- PROPERTY_SPECS:([\s\S]*?)-->/);
  let customSpecs: any = {};
  if (customSpecsMatch) {
    try {
      customSpecs = JSON.parse(customSpecsMatch[1].trim());
      cleanDescription = cleanDescription.replace(/<!-- PROPERTY_SPECS:[\s\S]*?-->/g, "").trim();
    } catch (e) {
      console.error("Error parsing custom property specs:", e);
    }
  }

  const nearby: NearbyAmenities = {
    ...(dbProp.nearby_hospitals !== null && dbProp.nearby_hospitals !== undefined ? { hospitals: dbProp.nearby_hospitals } : {}),
    ...(dbProp.nearby_malls !== null && dbProp.nearby_malls !== undefined ? { malls: dbProp.nearby_malls } : {}),
    ...(dbProp.nearby_schools !== null && dbProp.nearby_schools !== undefined ? { schools: dbProp.nearby_schools } : {}),
    ...(dbProp.nearby_restaurants !== null && dbProp.nearby_restaurants !== undefined ? { restaurants: dbProp.nearby_restaurants } : {}),
    ...(dbProp.nearby_metro_stations !== null && dbProp.nearby_metro_stations !== undefined ? { metroStations: dbProp.nearby_metro_stations } : {}),
    ...(dbProp.nearby_railway_stations !== null && dbProp.nearby_railway_stations !== undefined ? { railwayStations: dbProp.nearby_railway_stations } : {}),
    ...(dbProp.nearby_it_parks !== null && dbProp.nearby_it_parks !== undefined ? { itParks: dbProp.nearby_it_parks } : {}),
    ...customStats
  };

  // Extract Recommendation Report
  let recommendationReport = undefined;
  if (dbProp.property_recommendation_reports) {
    const rep = dbProp.property_recommendation_reports;
    recommendationReport = {
      investmentPotential: rep.investment_potential ?? 8,
      familyFriendliness: rep.family_friendliness ?? 8,
      commuteConvenience: rep.commute_convenience ?? 9,
      schoolAccess: rep.school_access ?? 8,
      hospitalAccess: rep.hospital_access ?? 7,
      futureAppreciation: rep.future_appreciation ?? 9,
      builderTrustRating: rep.builder_trust_rating ?? 9,
      whyRecommended: rep.why_recommended ?? "Recommended for its premium investment and spatial layout profile."
    };
  }

  return {
    id: dbProp.id,
    title: dbProp.title,
    slug: dbProp.slug,
    location: `${locationName}, ${city}`,
    price: Number(dbProp.price),
    type: dbProp.property_type,
    bhk: dbProp.bhk,
    area: dbProp.property_type === "Plot"
      ? `${(customSpecs.plotSize || Number(dbProp.area_sqft)).toLocaleString()} ${customSpecs.plotSizeUnit || "sq yds"}`
      : `${Number(dbProp.area_sqft).toLocaleString()} ${customSpecs.areaUnit || "sq ft"}`,
    areaUnit: customSpecs.areaUnit || "sq ft",
    plotSize: customSpecs.plotSize !== undefined ? Number(customSpecs.plotSize) : undefined,
    plotSizeUnit: customSpecs.plotSizeUnit || "sq yds",
    possession: dbProp.possession_status,
    investmentType: dbProp.investment_type,
    description: cleanDescription,
    architect: dbProp.architect || "",
    featured: dbProp.featured || false,
    image: primaryImage,
    amenities,
    scores: {
      architecturalIntegrity: dbProp.score_architectural ?? 90,
      investmentYield: Number(dbProp.score_yield ?? 8.0),
      spatialEfficiency: dbProp.score_spatial ?? 90,
      automationTier: dbProp.score_automation ?? "Tier 2 (Pro)"
    },
    reraNumber: dbProp.projects?.rera_number || "",
    possessionDate: dbProp.projects?.possession_date || "",
    projectName: dbProp.projects?.name || "",
    nearby,
    aqi,
    floorPlans,
    images: allImages.length > 0 ? allImages : [primaryImage],
    recommendationReport,
    udsPerAcre: dbProp.uds_per_acre !== undefined && dbProp.uds_per_acre !== null
      ? Number(dbProp.uds_per_acre)
      : (dbProp.property_type === "Apartment" ? Number(dbProp.nearby_railway_stations ?? 100) : undefined),
    brochureUrl: dbProp.brochure_url || ""
  };
}

export async function fetchAllProperties(): Promise<Property[]> {
  try {
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
      console.error("Supabase fetchAllProperties error:", error.message);
      return [];
    }
    if (!data) return [];
    
    return data.map(normalizeProperty);
  } catch (e) {
    console.error("Connection error fetching properties:", e);
    return [];
  }
}

export async function fetchPropertyBySlug(slug: string): Promise<Property | null> {
  try {
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
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error(`Supabase fetchPropertyBySlug error [${slug}]:`, error.message);
      return null;
    }
    if (!data) return null;
    
    return normalizeProperty(data);
  } catch (e) {
    console.error(`Connection error fetching property slug [${slug}]:`, e);
    return null;
  }
}

export async function fetchFeaturedProperties(): Promise<Property[]> {
  try {
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
      .eq("featured", true)
      .limit(6);

    if (error) {
      console.error("Supabase fetchFeaturedProperties error:", error.message);
      return [];
    }
    if (!data) return [];
    
    return data.map(normalizeProperty);
  } catch (e) {
    console.error("Connection error fetching featured properties:", e);
    return [];
  }
}

export async function submitLead(lead: {
  propertyId?: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  leadType: "general" | "callback" | "property_inquiry" | "ai_advisor";
}): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("leads")
      .insert({
        property_id: lead.propertyId || null,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        notes: lead.notes,
        lead_type: lead.leadType,
        status: "new"
      });

    if (error) {
      console.error("Supabase submitLead error:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Connection error submitting lead:", e);
    return false;
  }
}

export async function submitLeadAndGetId(lead: {
  propertyId?: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  leadType: "general" | "callback" | "property_inquiry" | "ai_advisor";
}): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .rpc("create_lead_v2", {
        p_name: lead.name,
        p_email: lead.email,
        p_phone: lead.phone,
        p_notes: lead.notes,
        p_lead_type: lead.leadType,
        p_property_id: lead.propertyId || null
      });

    if (error) {
      console.error("Supabase create_lead_v2 error:", error.message);
      return null;
    }
    return data as string;
  } catch (e) {
    console.error("Connection error calling create_lead_v2 RPC:", e);
    return null;
  }
}


export async function fetchLeads(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select(`
        *,
        properties (title)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetchLeads error:", error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error("Connection error fetching leads:", e);
    return [];
  }
}

export async function updateLeadStatus(id: string, status: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Supabase updateLeadStatus error:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Connection error updating lead:", e);
    return false;
  }
}

export async function deleteProperty(id: string): Promise<boolean> {
  try {
    // Cascading deletes will handle child tables (property_images, floor_plans, etc.) in Supabase,
    // but just to be safe, we run delete on properties which cascades.
    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase deleteProperty error:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Connection error deleting property:", e);
    return false;
  }
}

export async function saveProperty(form: any): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Resolve Location ID
    const rawLoc = form.location || "Kokapet, Hyderabad";
    const locNeighborhood = rawLoc.split(",")[0].trim();
    const locCity = (rawLoc.split(",")[1] || "Hyderabad").trim();
    
    let { data: locData, error: locFindErr } = await supabase
      .from("locations")
      .select("id")
      .eq("name", locNeighborhood)
      .maybeSingle();
      
    if (locFindErr) {
      console.error("Error finding location:", locFindErr);
      throw new Error(`Location lookup failed: ${locFindErr.message}`);
    }
    
    let locationId = locData?.id;
    
    const locationPayload = {
      name: locNeighborhood,
      slug: locNeighborhood.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      city: locCity,
      state: "Telangana",
      aqi_score: form.aqi?.score !== undefined ? Number(form.aqi.score) : 64,
      dominant_pollutant: form.aqi?.dominantPollutant || "PM2.5",
      pm25: form.aqi?.pm25 !== undefined ? Number(form.aqi.pm25) : 17.2,
      pm10: form.aqi?.pm10 !== undefined ? Number(form.aqi.pm10) : 20.4,
      o3: form.aqi?.o3 !== undefined ? Number(form.aqi.o3) : 72,
      no2: form.aqi?.no2 !== undefined ? Number(form.aqi.no2) : 32.9,
      so2: form.aqi?.so2 !== undefined ? Number(form.aqi.so2) : 5.6,
      co: form.aqi?.co !== undefined ? Number(form.aqi.co) : 587
    };

    if (!locationId) {
      const { data: newLoc, error: newLocErr } = await supabase
        .from("locations")
        .insert(locationPayload)
        .select("id")
        .single();
        
      if (newLocErr) {
        console.error("Error inserting location:", newLocErr);
        throw new Error(`Location registration failed: ${newLocErr.message}`);
      }
      locationId = newLoc?.id;
    } else {
      const { error: locUpdateErr } = await supabase
        .from("locations")
        .update({
          aqi_score: locationPayload.aqi_score,
          dominant_pollutant: locationPayload.dominant_pollutant,
          pm25: locationPayload.pm25,
          pm10: locationPayload.pm10,
          o3: locationPayload.o3,
          no2: locationPayload.no2,
          so2: locationPayload.so2,
          co: locationPayload.co
        })
        .eq("id", locationId);
      if (locUpdateErr) {
        console.error("Error updating location AQI:", locUpdateErr);
      }
    }

    if (!locationId) {
      throw new Error("Unable to resolve location ID.");
    }

    // 2. Resolve Builder ID
    const builderName = form.builderName || form.architect || "Signature Developers";
    let { data: builderData, error: builderFindErr } = await supabase
      .from("builders")
      .select("id")
      .eq("name", builderName)
      .maybeSingle();
      
    if (builderFindErr) {
      console.error("Error finding builder:", builderFindErr);
      throw new Error(`Builder lookup failed: ${builderFindErr.message}`);
    }
    
    let builderId = builderData?.id;
    if (!builderId) {
      const { data: newBuilder, error: newBuilderErr } = await supabase
        .from("builders")
        .insert({
          name: builderName,
          slug: builderName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          description: "Premium property developer partners."
        })
        .select("id")
        .single();
        
      if (newBuilderErr) {
        console.error("Error inserting builder:", newBuilderErr);
        throw new Error(`Builder registration failed: ${newBuilderErr.message}`);
      }
      builderId = newBuilder?.id;
    }

    if (!builderId) {
      throw new Error("Unable to resolve builder ID.");
    }

    // 3. Resolve Project ID
    const projectName = form.projectName || `${form.title} Project`;
    let { data: projectData, error: projectFindErr } = await supabase
      .from("projects")
      .select("id")
      .eq("name", projectName)
      .maybeSingle();
      
    if (projectFindErr) {
      console.error("Error finding project:", projectFindErr);
      throw new Error(`Project lookup failed: ${projectFindErr.message}`);
    }
    
    let projectId = projectData?.id;
    const projectPayload = {
      builder_id: builderId,
      location_id: locationId,
      name: projectName,
      slug: projectName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      rera_number: form.reraNumber || `RERA-${Date.now()}`,
      possession_date: form.possessionDate || (form.possession === "Ready" ? "Ready" : "Dec 2027")
    };

    if (!projectId) {
      const { data: newProj, error: newProjErr } = await supabase
        .from("projects")
        .insert(projectPayload)
        .select("id")
        .single();
        
      if (newProjErr) {
        console.error("Error inserting project:", newProjErr);
        throw new Error(`Project registration failed: ${newProjErr.message}`);
      }
      projectId = newProj?.id;
    } else {
      const { error: projectUpdateErr } = await supabase
        .from("projects")
        .update({
          rera_number: form.reraNumber || undefined,
          possession_date: form.possessionDate || undefined
        })
        .eq("id", projectId);
      if (projectUpdateErr) {
        console.error("Error updating project RERA/Possession:", projectUpdateErr);
      }
    }

    if (!projectId) {
      throw new Error("Unable to resolve project ID.");
    }

    // 4. Save Property
    const areaSqft = parseInt(form.area?.toString().replace(/[^0-9]/g, "") || "2000") || 2000;
    
    let targetSlug = form.slug || form.title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (!form.id) {
      // Insertion: check if the slug already exists to prevent unique key violation
      const { data: existing } = await supabase
        .from("properties")
        .select("id")
        .eq("slug", targetSlug)
        .maybeSingle();
      if (existing) {
        targetSlug = `${targetSlug}-${Math.random().toString(36).substring(2, 6)}`;
      }
    }

    const standardKeys = ["hospitals", "malls", "schools", "restaurants", "metroStations", "railwayStations", "itParks"];
    const customStats: Record<string, number> = {};
    if (form.nearby) {
      Object.keys(form.nearby).forEach(key => {
        if (!standardKeys.includes(key)) {
          customStats[key] = (form.nearby as any)[key];
        }
      });
    }

    let descriptionClean = (form.description || "")
      .replace(/<!-- CONNECTIVITY_STATS:[\s\S]*?-->/g, "")
      .replace(/<!-- PROPERTY_SPECS:[\s\S]*?-->/g, "")
      .trim();

    const customSpecs = {
      areaUnit: form.areaUnit || "sq ft",
      plotSize: form.plotSize ? Number(form.plotSize) : undefined,
      plotSizeUnit: form.plotSizeUnit || "sq yds"
    };

    let suffixComments = "";
    if (Object.keys(customStats).length > 0) {
      suffixComments += `\n\n<!-- CONNECTIVITY_STATS:${JSON.stringify(customStats)} -->`;
    }
    if (customSpecs.areaUnit !== "sq ft" || customSpecs.plotSize !== undefined) {
      suffixComments += `\n\n<!-- PROPERTY_SPECS:${JSON.stringify(customSpecs)} -->`;
    }
    let descriptionPayload = `${descriptionClean}${suffixComments}`;

    const propertyPayload = {
      project_id: projectId,
      location_id: locationId,
      title: form.title,
      slug: targetSlug,
      price: Number(form.price),
      property_type: form.type,
      bhk: Number(form.bhk),
      area_sqft: areaSqft,
      possession_status: form.possession,
      investment_type: form.investmentType,
      description: descriptionPayload,
      architect: form.architect || builderName,
      featured: !!form.featured,
      score_architectural: Number(form.scores?.architecturalIntegrity ?? 90),
      score_yield: Number(form.scores?.investmentYield ?? 8.0),
      score_spatial: Number(form.scores?.spatialEfficiency ?? 90),
      score_automation: form.scores?.automationTier ?? "Tier 2 (Pro)",
      
      nearby_hospitals: form.nearby?.hospitals !== undefined ? form.nearby.hospitals : null,
      nearby_malls: form.nearby?.malls !== undefined ? form.nearby.malls : null,
      nearby_schools: form.nearby?.schools !== undefined ? form.nearby.schools : null,
      nearby_restaurants: form.nearby?.restaurants !== undefined ? form.nearby.restaurants : null,
      nearby_metro_stations: form.nearby?.metroStations !== undefined ? form.nearby.metroStations : null,
      nearby_railway_stations: form.nearby?.railwayStations !== undefined ? form.nearby.railwayStations : null,
      nearby_it_parks: form.nearby?.itParks !== undefined ? form.nearby.itParks : null,
      uds_per_acre: form.type === "Apartment" ? Number(form.udsPerAcre ?? 100) : null,
      brochure_url: form.brochureUrl || null
    };

    let propertyId = form.id;
    if (propertyId) {
      // Update
      const { error: propErr } = await supabase
        .from("properties")
        .update(propertyPayload)
        .eq("id", propertyId);
        
      if (propErr) {
        console.error("Error updating property:", propErr);
        throw new Error(`Property update failed: ${propErr.message}`);
      }
    } else {
      // Insert
      const { data: newProp, error: propErr } = await supabase
        .from("properties")
        .insert(propertyPayload)
        .select("id")
        .single();
        
      if (propErr) {
        console.error("Error inserting property:", propErr);
        throw new Error(`Property creation failed: ${propErr.message}`);
      }
      propertyId = newProp?.id;
    }

    if (!propertyId) {
      throw new Error("Unable to resolve property ID after save.");
    }

    // 5. Save Images
    const { error: imgDelErr } = await supabase.from("property_images").delete().eq("property_id", propertyId);
    if (imgDelErr) {
      console.error("Error deleting property images:", imgDelErr);
      throw new Error(`Failed to clean old images: ${imgDelErr.message}`);
    }
    
    const rawImageList = form.images && form.images.length > 0 ? form.images : [form.image];
    const imageList = Array.from(new Set(rawImageList)).filter((url): url is string => typeof url === "string" && !!url.trim());
    for (let k = 0; k < imageList.length; k++) {
      const isPrimary = imageList[k] === form.image || k === 0;
      const { error: imgInsErr } = await supabase.from("property_images").insert({
        property_id: propertyId,
        image_url: imageList[k],
        display_order: k,
        is_primary: isPrimary
      });
      if (imgInsErr) {
        console.error("Error inserting property image:", imgInsErr);
        throw new Error(`Failed to save image ${k + 1}: ${imgInsErr.message}`);
      }
    }

    // 6. Save Amenities
    const { error: amDelErr } = await supabase.from("property_amenities").delete().eq("property_id", propertyId);
    if (amDelErr) {
      console.error("Error deleting property amenities:", amDelErr);
      throw new Error(`Failed to clean old amenities: ${amDelErr.message}`);
    }

    if (form.amenities && form.amenities.length > 0) {
      const uniqueAmenities = Array.from(new Set(form.amenities)).filter((a): a is string => typeof a === "string" && !!a.trim());
      for (const am of uniqueAmenities) {
        let { data: amData, error: amFindErr } = await supabase
          .from("amenities")
          .select("id")
          .eq("name", am)
          .maybeSingle();
          
        if (amFindErr) {
          console.error("Error finding amenity:", amFindErr);
          throw new Error(`Amenity lookup failed: ${amFindErr.message}`);
        }
        
        let amenityId = amData?.id;
        if (!amenityId) {
          const { data: newAm, error: newAmErr } = await supabase
            .from("amenities")
            .insert({ name: am, category: "General" })
            .select("id")
            .single();
            
          if (newAmErr) {
            console.error("Error inserting amenity:", newAmErr);
            throw new Error(`Failed to register amenity '${am}': ${newAmErr.message}`);
          }
          amenityId = newAm?.id;
        }
        
        if (amenityId) {
          const { error: paInsErr } = await supabase.from("property_amenities").insert({
            property_id: propertyId,
            amenity_id: amenityId
          });
          if (paInsErr) {
            console.error("Error linking property amenity:", paInsErr);
            throw new Error(`Failed to associate amenity '${am}': ${paInsErr.message}`);
          }
        }
      }
    }

    // 7. Save Floor Plans
    const { error: fpDelErr } = await supabase.from("floor_plans").delete().eq("property_id", propertyId);
    if (fpDelErr) {
      console.error("Error deleting floor plans:", fpDelErr);
      throw new Error(`Failed to clean old floor plans: ${fpDelErr.message}`);
    }

    if (form.floorPlans && form.floorPlans.length > 0) {
      for (const fp of form.floorPlans) {
        const { error: fpInsErr } = await supabase.from("floor_plans").insert({
          property_id: propertyId,
          unit_type: fp.type || fp.unit_type,
          size_sqft: Number(fp.size || fp.size_sqft),
          facing: fp.facing || "East",
          price: Number(fp.price)
        });
        if (fpInsErr) {
          console.error("Error inserting floor plan:", fpInsErr);
          throw new Error(`Failed to save floor plan: ${fpInsErr.message}`);
        }
      }
    }

    // 8. Save Recommendation Report
    const { error: repDelErr } = await supabase.from("property_recommendation_reports").delete().eq("property_id", propertyId);
    if (repDelErr) {
      console.error("Error deleting recommendation report:", repDelErr);
      throw new Error(`Failed to clean old recommendation report: ${repDelErr.message}`);
    }

    if (form.showRecommendationReport && form.recommendationReport) {
      const rep = form.recommendationReport;
      const { error: repInsErr } = await supabase.from("property_recommendation_reports").insert({
        property_id: propertyId,
        investment_potential: Number(rep.investmentPotential ?? 8),
        family_friendliness: Number(rep.familyFriendliness ?? 8),
        commute_convenience: Number(rep.commuteConvenience ?? 9),
        school_access: Number(rep.schoolAccess ?? 8),
        hospital_access: Number(rep.hospitalAccess ?? 7),
        future_appreciation: Number(rep.futureAppreciation ?? 9),
        builder_trust_rating: Number(rep.builderTrustRating ?? 9),
        why_recommended: rep.whyRecommended || "Recommended for its premium investment and spatial efficiency profile."
      });
      if (repInsErr) {
        console.error("Error inserting recommendation report:", repInsErr);
        throw new Error(`Failed to save recommendation report: ${repInsErr.message}`);
      }
    }

    return { success: true };
  } catch (e: any) {
    console.error("Error saving property in db service:", e);
    return { success: false, error: e.message || String(e) };
  }
}

export async function saveAiLeadProfile(leadId: string, profile: {
  budget: number;
  purpose: string;
  office_location: string;
  family_size: number;
  property_type: string;
  priority: string;
  lead_score: number;
}): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("lead_profiles")
      .upsert({
        lead_id: leadId,
        budget: profile.budget,
        purpose: profile.purpose,
        office_location: profile.office_location,
        family_size: profile.family_size,
        property_type: profile.property_type,
        priority: profile.priority,
        lead_score: profile.lead_score
      });

    if (error) {
      console.error("Supabase saveAiLeadProfile error:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Connection error saving AI lead profile:", e);
    return false;
  }
}

export async function saveAiConversation(leadId: string, conversation: any[], summary: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("ai_conversations")
      .insert({
        lead_id: leadId,
        conversation,
        summary
      });

    if (error) {
      console.error("Supabase saveAiConversation error:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Connection error saving AI conversation:", e);
    return false;
  }
}

export async function saveLeadRecommendations(leadId: string, recommendations: {
  property_id: string;
  match_score: number;
  reasoning: string;
}[]): Promise<boolean> {
  try {
    const payloads = recommendations.map(rec => ({
      lead_id: leadId,
      property_id: rec.property_id,
      match_score: rec.match_score,
      reasoning: rec.reasoning
    }));

    const { error } = await supabase
      .from("lead_recommendations")
      .insert(payloads);

    if (error) {
      console.error("Supabase saveLeadRecommendations error:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Connection error saving lead recommendations:", e);
    return false;
  }
}

export async function saveSiteVisit(leadId: string, propertyId: string, date: string, status: string = "Scheduled", notes: string = ""): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("site_visits")
      .insert({
        lead_id: leadId,
        property_id: propertyId,
        date,
        status,
        notes
      });

    if (error) {
      console.error("Supabase saveSiteVisit error:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Connection error saving site visit:", e);
    return false;
  }
}

export async function fetchAiCrmLeads(): Promise<any[] | null> {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select(`
        *,
        lead_profiles (*),
        ai_conversations (*),
        lead_recommendations (*, properties (title)),
        site_visits (*, properties (title))
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetchAiCrmLeads table check failed:", error.message);
      return null;
    }
    
    return (data || []).filter(lead => lead.lead_profiles !== null);
  } catch (e) {
    console.warn("Connection error fetching AI CRM leads:", e);
    return null;
  }
}

