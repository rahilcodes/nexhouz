import { Property } from "@/data/properties";
import { supabase } from "./supabaseClient";
import { saveAiLeadProfile, saveAiConversation, saveLeadRecommendations, saveSiteVisit, submitLead, submitLeadAndGetId } from "./db";

export interface AdvisorState {
  step: number; // 1 to 13 (local fallback steps)
  leadId?: string;
  profile: {
    budget?: number;
    purpose?: string;
    office_location?: string;
    family_size?: number;
    property_type?: string;
    possession?: "Ready" | "Under Construction" | "Flexible";
    priority?: string;
    special_requirements?: string;
    name?: string;
    phone?: string;
    recommendedIds?: string[];
  };
}

// Default exported system prompt — editable from the Admin AI Brain panel
export const DEFAULT_SYSTEM_PROMPT =
`
# NEXHOUZ ELITE DIGITAL PROPERTY ADVISOR
## MASTER AI SYSTEM PROMPT (PRODUCTION VERSION)

You are NexHouz Property Advisor. You are NOT an AI chatbot.
You are a senior luxury real estate consultant with deep expertise in Hyderabad's premium residential market.
You have personally advised hundreds of buyers, investors, NRI clients, technology executives, entrepreneurs, and families.
Your tone must be warm, sophisticated, empathetic, and highly consultative. NEVER sound like a database query or a rigid chatbot.

CORE PHILOSOPHY:
"We do not recommend what is easiest to sell. We recommend what is most suitable for the buyer."
Trust comes before conversion. Suitability comes before inventory. Quality comes before quantity.

CONVERSATION ROADMAP STEPS:
Your interaction progresses through these logical discovery and action steps:
- Step 1: Initial greeting and welcome (Budget query).
- Step 2: Budget selection captured -> Query purpose (Self-use, Investment, Both).
- Step 3: Purpose captured -> Query office commute / micro-market focus.
- Step 4: Commute captured -> Query family configuration / size.
- Step 5: Family configuration captured -> Query preferred property type (Apartment, Villa, Penthouse).
- Step 6: Property type captured -> Query possession timeline (Ready to Move, Under Construction, Flexible).
- Step 7: Possession timeline captured -> Query highest suitability priority (Schools, Commute, Appreciation, Lifestyle, Yield).
- Step 8: Priority captured -> Query special requirements (Seniors, Pets, Home Office, NRI) or clarifications.
- Step 9: Special requirements captured -> Present Top 3 recommendations and ask for WhatsApp number using the exact phrase:
  "I'd be happy to send these recommendations, floor plans, pricing updates, and availability details directly to you. What's the best WhatsApp number to send them to?"
- Step 10: WhatsApp captured -> Ask for Name.
- Step 11: Name captured (lead saved) -> Suggest site visit schedule options. Always use this exact phrase:
  "Would you like to schedule a site visit for any of these properties? We have availability This Weekend, Next Weekend, or we can arrange a Custom Date that suits you."
- Step 12: Site visit selection captured -> Confirm booking and provide summary.
- Step 13: Conversation finalized / Graceful exit.

CRITICAL STATE-TAG RULE (MANDATORY):
At the very end of EVERY single response you send, you MUST append a state tag on a new line in this exact format:
[STATE: step=X, chips=Chip 1 | Chip 2 | Chip 3]
- "step" MUST be the active step number (1 to 13) matching the user's conversational state.
- "chips" MUST be a pipe-separated list of 2 to 4 short, context-appropriate quick-reply choices for the question you just asked. Keep them concise (1-3 words, no emojis).
- Example: If you just asked for budget range, append: [STATE: step=1, chips=Under 3 Cr | 3-5 Cr | 5-8 Cr | 8 Cr+]
- Example: If you just asked for property type, append: [STATE: step=5, chips=Apartment | Villa | Penthouse | Flexible]
- If no chips are needed or you are waiting for free-text (like name or custom inputs), you can omit the chips parameter: [STATE: step=10]

CONVERSATIONAL UPGRADES:
1. ORGANIC HOOKING & COMPOUNDING:
   If the user provides a detailed answer (e.g. "I want a 3 BHK ready flat in Kokapet for self use under 4 Cr"), do NOT ask for those parameters again. Acknowledge them warmly with professional commentary, group them, update the profile, and move directly to the next missing detail (e.g. commute or family size). Skip steps programmatically by setting the appropriate step number in your state tag!

2. HANDLING OBJECTIONS & DROP-OUTS (GRACEFUL BACK-OFF):
   If the user says "Not interested", "Stop", "No thanks", or similar:
   - Do NOT try to force them back into the discovery steps or ask for their WhatsApp.
   - Respond with high empathy and step back politely: "Understood. No worries at all. If you ever want to check premium listings in Hyderabad or get a second opinion on a builder, you can reach our desk at +91 85858 54853 or email us at advisory@nexhouz.com. Safe house hunting!"
   - Append tag: [STATE: step=13, chips=Start Over | Browse Listings | Call Us]

3. HANDLING CONTACT INQUIRIES:
   If the user asks "How do I contact you?" or "What is your phone number?":
   - Provide the company coordinates: Phone: +91 85858 54853, Email: advisory@nexhouz.com, Office: Kokapet, Hyderabad.
   - Suggest chips: [STATE: step=state.step, chips=Book Meeting | Call Desk | Chat Main]

4. NARRATIVE LUXURY PROPERTY PITCHING:
   When presenting properties (Step 9), pitch the *soul* of the property. Connect its features directly to the buyer's priorities:
   - Example: "Since shorter commute and top schools are your highest priority for the family, I've selected the [Prestige Beverly Hills] (95% Match) because it's situated just 10 minutes from Oakridge School and features a clean RERA profile..."
   - ALWAYS wrap property titles in brackets, e.g. [Jubilee Ridge Pavilion] or [prop-1] so the UI can render interactive cards.
   - Recommend a maximum of THREE properties from the provided inventory. Never hallucinate properties outside of the supplied list.
`;

// Returns the active system prompt (localStorage override or default)
export function getActiveSystemPrompt(): string {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("nexhouz_advisor_prompt");
    if (stored && stored.trim().length > 100) return stored;
  }
  return DEFAULT_SYSTEM_PROMPT;
}

// Returns active business memory injected as a second system message
export function getBusinessMemory(): string {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("nexhouz_business_memory");
    if (stored && stored.trim().length > 10) return stored;
  }
  return "";
}

// Helper to format currency in INR
export function formatINR(price: number): string {
  if (price >= 10000000) {
    return `₹${parseFloat((price / 10000000).toFixed(2))} Cr`;
  }
  return `₹${parseFloat((price / 100000).toFixed(2))} Lakhs`;
}

// Clean text summary of properties for OpenAI context injection
function serializeInventory(properties: Property[]): string {
  return properties.map(p => {
    return `ID: ${p.id}
Title: ${p.title}
Project Name: ${p.projectName}
Location: ${p.location}
Price: ${formatINR(p.price)} (${p.price} INR)
Type: ${p.type}
BHK: ${p.bhk}
Possession: ${p.possession}
Amenities: ${p.amenities.join(", ")}
Featured: ${p.featured}
Scores: Architectural: ${p.scores.architecturalIntegrity}/100, Yield: ${p.scores.investmentYield}%, Spatial: ${p.scores.spatialEfficiency}/100
RERA: ${p.reraNumber || "N/A"}`;
  }).join("\n---\n");
}

// Main API proxy client caller
async function queryOpenAiAdvisor(
  history: { sender: "user" | "bot"; text: string }[],
  properties: Property[]
): Promise<string | null> {
  const endpoint = 
    process.env.NEXT_PUBLIC_CHAT_ENDPOINT || 
    (process.env.NODE_ENV === "production" ? "/api/chat.php" : "/api/chat");
  
  // Convert history format to OpenAI messages
  const activePrompt = getActiveSystemPrompt();
  const businessMemory = getBusinessMemory();
  const messages: { role: string; content: string }[] = [
    { role: "system", content: activePrompt },
    ...(businessMemory ? [{ role: "system", content: `BUSINESS CONTEXT:\n${businessMemory}` }] : []),
    { role: "system", content: `CURRENT INVENTORY:\n${serializeInventory(properties)}` },
    ...history.map(msg => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text
    }))
  ];

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.5
      })
    });

    if (!res.ok) {
      const errData = await res.json();
      console.warn("OpenAI proxy request failed:", errData.error || res.statusText);
      return null;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (e) {
    console.warn("Exception calling OpenAI proxy:", e);
    return null;
  }
}

// Client-side local state machine fallback
// Client-side local state machine fallback
function runLocalFallback(
  input: string,
  state: AdvisorState,
  properties: Property[]
): { responseText: string; properties?: Property[]; nextState: AdvisorState; chips?: string[] } {
  const q = input.toLowerCase().trim();
  const nextState = { ...state };
  nextState.profile = { ...state.profile };
  
  let responseText = "";
  let matchedProperties: Property[] = [];
  let chips: string[] = [];

  // Special early exit / objection handler
  if (state.step < 12 && (q === "not interested" || q === "stop" || q === "no thanks" || q === "no interest" || q.includes("don't want") || q.includes("dont want"))) {
    nextState.step = 13;
    responseText = "Understood. No worries at all. If you ever want to check premium listings in Hyderabad or get a second opinion on a builder, you can reach our desk at +91 85858 54853 or email us at advisory@nexhouz.com. Safe house hunting!";
    chips = ["Start Over", "Browse Listings", "Call Us"];
    return { responseText, nextState, chips };
  }

  // Special contact handler
  if (q.includes("contact") || q.includes("phone number") || q.includes("email") || q.includes("reach you") || q.includes("call you")) {
    responseText = "You can reach our desk directly at **+91 85858 54853** or email us at **advisory@nexhouz.com**. Our physical office is located in **Kokapet, Hyderabad**.\n\nHow else can I assist you with your search?";
    chips = ["Book Meeting", "Call Desk", "Browse Listings"];
    return { responseText, nextState, chips };
  }

  // Handle steps
  if (state.step === 1 && input !== "") {
    // Transition from Step 1 to Step 2 (budget was asked, input contains budget)
    const budgetMatch = q.match(/([\d.]+)\s*(?:cr|crore|crores)/);
    if (budgetMatch) {
      nextState.profile.budget = parseFloat(budgetMatch[1]) * 10000000;
    } else if (q.includes("1.5") && q.includes("under")) {
      nextState.profile.budget = 12000000;
    } else if (q.includes("1.5") && q.includes("3")) {
      nextState.profile.budget = 22500000;
    } else if (q.includes("3-5") || (q.includes("3") && q.includes("5"))) {
      nextState.profile.budget = 40000000;
    } else if (q.includes("5") && (q.includes("above") || q.includes("+") || q.includes("more"))) {
      nextState.profile.budget = 65000000;
    } else if (q.includes("1.5")) {
      nextState.profile.budget = 12000000;
    } else if (q.includes("3")) {
      nextState.profile.budget = 30000000;
    } else if (q.includes("5")) {
      nextState.profile.budget = 50000000;
    } else {
      nextState.profile.budget = 30000000; // default 3 Cr
    }
    nextState.step = 2; // move to Purpose
  } else if (state.step === 2) {
    // Transition from Step 2 to Step 3 (purpose was asked, input contains purpose)
    if (q.includes("self") || q.includes("live") || q.includes("home")) {
      nextState.profile.purpose = "Self Use";
    } else if (q.includes("invest") || q.includes("rent") || q.includes("yield")) {
      nextState.profile.purpose = "Investment";
    } else {
      nextState.profile.purpose = "Both";
    }
    nextState.step = 3; // move to Commute
  } else if (state.step === 3) {
    // Transition from Step 3 to Step 4 (commute was asked, input contains commute)
    nextState.profile.office_location = input;
    nextState.step = 4; // move to Family Size
  } else if (state.step === 4) {
    // Transition from Step 4 to Step 5 (family size was asked, input contains family size)
    const sizeMatch = q.match(/(\d+)/);
    nextState.profile.family_size = sizeMatch ? parseInt(sizeMatch[1], 10) : 4;
    nextState.step = 5; // move to Property Type
  } else if (state.step === 5) {
    // Transition from Step 5 to Step 6 (property type was asked, input contains property type)
    if (q.includes("villa") || q.includes("independent")) {
      nextState.profile.property_type = "Villa";
    } else if (q.includes("penthouse")) {
      nextState.profile.property_type = "Penthouse";
    } else if (q.includes("apartment") || q.includes("flat")) {
      nextState.profile.property_type = "Apartment";
    } else {
      nextState.profile.property_type = "Flexible";
    }
    nextState.step = 6; // move to Possession
  } else if (state.step === 6) {
    // Transition from Step 6 to Step 7 (possession was asked, input contains possession)
    if (q.includes("ready") || q.includes("rtm") || q.includes("1")) {
      nextState.profile.possession = "Ready";
    } else if (q.includes("construction") || q.includes("under") || q.includes("ongoing") || q.includes("2")) {
      nextState.profile.possession = "Under Construction";
    } else {
      nextState.profile.possession = "Flexible";
    }
    nextState.step = 7; // move to Priority
  } else if (state.step === 7) {
    // Transition from Step 7 to Step 8 (priority was asked, input contains priority)
    if (q.includes("commute") || q.includes("work")) nextState.profile.priority = "Commute";
    else if (q.includes("school") || q.includes("education") || q.includes("kids")) nextState.profile.priority = "Schools";
    else if (q.includes("appreciat") || q.includes("growth") || q.includes("value")) nextState.profile.priority = "Appreciation";
    else if (q.includes("luxury") || q.includes("lifestyle") || q.includes("club")) nextState.profile.priority = "Luxury Lifestyle";
    else if (q.includes("yield") || q.includes("rent")) nextState.profile.priority = "Rental Yield";
    else nextState.profile.priority = "Peaceful Living";

    nextState.step = 8; // move to Special Requirements
  } else if (state.step === 8) {
    // Transition from Step 8 to Step 9 (special requirements was asked, input contains special requirements)
    nextState.profile.special_requirements = input;
    nextState.step = 9; // move to Recommendations & WhatsApp Request
  } else if (state.step === 9) {
    // Transition from Step 9: user submits lead (WhatsApp number / Form)
    const localStructuredMatch = input.match(/My name is\s+(.+?)\s+and my WhatsApp number is\s+(\+?\d[\d\-\s]{7,12}\d)/i);
    if (localStructuredMatch) {
      nextState.profile.name = localStructuredMatch[1].trim();
      nextState.profile.phone = localStructuredMatch[2].replace(/\s+/g, "");
      nextState.step = 11; // Move directly to site visit options step
      
      const triggerSave = async () => {
        const summaryText = `AI qualification lead (fallback) for ${nextState.profile.name}. Budget: ${formatINR(nextState.profile.budget || 40000000)}, Office: ${nextState.profile.office_location || "N/A"}, Priority: ${nextState.profile.priority || "N/A"}.`;
        const createdId = await submitLeadAndGetId({
          name: nextState.profile.name || "AI Lead",
          email: `${(nextState.profile.name || "ai").toLowerCase().replace(/\s+/g, "")}@example.com`,
          phone: nextState.profile.phone || "",
          notes: summaryText,
          leadType: "ai_advisor"
        });

        if (createdId) {
          nextState.leadId = createdId;
          let score = 65;
          if ((nextState.profile.budget || 0) >= 30000000) score += 15;
          if (nextState.profile.possession === "Ready") score += 10;
          if (nextState.profile.phone) score += 10;
          score = Math.min(100, score);

          await saveAiLeadProfile(createdId, {
            budget: nextState.profile.budget || 40000000,
            purpose: nextState.profile.purpose || "Both",
            office_location: nextState.profile.office_location || "None",
            family_size: nextState.profile.family_size || 4,
            property_type: nextState.profile.property_type || "Apartment",
            priority: nextState.profile.priority || "Appreciation",
            lead_score: score
          });

          if (nextState.profile.recommendedIds) {
            await saveLeadRecommendations(createdId, nextState.profile.recommendedIds.map(pid => ({
              property_id: pid,
              match_score: 90,
              reasoning: "Selected based on budget compatibility, proximity to office, and schools."
            })));
          }

          await saveAiConversation(createdId, [
            { role: "assistant", content: "Welcome to NexHouz..." },
            { role: "user", content: `My budget is ${nextState.profile.budget}` }
          ], summaryText);
        }
      };
      triggerSave();
    } else {
      nextState.profile.phone = input.replace(/\s+/g, "");
      nextState.step = 10; // Ask for Name
    }
  } else if (state.step === 10) {
    nextState.profile.name = input.trim();
    nextState.step = 11; // Ask for site visit

    const triggerSave = async () => {
      const summaryText = `AI qualification lead (fallback) for ${nextState.profile.name}. Budget: ${formatINR(nextState.profile.budget || 40000000)}, Office: ${nextState.profile.office_location || "N/A"}, Priority: ${nextState.profile.priority || "N/A"}.`;
      const createdId = await submitLeadAndGetId({
        name: nextState.profile.name || "AI Lead",
        email: `${(nextState.profile.name || "ai").toLowerCase().replace(/\s+/g, "")}@example.com`,
        phone: nextState.profile.phone || "",
        notes: summaryText,
        leadType: "ai_advisor"
      });

      if (createdId) {
        nextState.leadId = createdId;
        let score = 65;
        if ((nextState.profile.budget || 0) >= 30000000) score += 15;
        if (nextState.profile.possession === "Ready") score += 10;
        if (nextState.profile.phone) score += 10;
        score = Math.min(100, score);

        await saveAiLeadProfile(createdId, {
          budget: nextState.profile.budget || 40000000,
          purpose: nextState.profile.purpose || "Both",
          office_location: nextState.profile.office_location || "None",
          family_size: nextState.profile.family_size || 4,
          property_type: nextState.profile.property_type || "Apartment",
          priority: nextState.profile.priority || "Appreciation",
          lead_score: score
        });

        if (nextState.profile.recommendedIds) {
          await saveLeadRecommendations(createdId, nextState.profile.recommendedIds.map(pid => ({
            property_id: pid,
            match_score: 90,
            reasoning: "Selected based on budget compatibility, proximity to office, and schools."
          })));
        }

        await saveAiConversation(createdId, [
          { role: "assistant", content: "Welcome to NexHouz..." },
          { role: "user", content: `My budget is ${nextState.profile.budget}` }
        ], summaryText);
      }
    };
    triggerSave();
  } else if (state.step === 11) {
    nextState.step = 12; // Confirm booking
    let dateString = "";
    if (q.includes("this") || q.includes("1")) {
      const thisSat = new Date();
      thisSat.setDate(thisSat.getDate() + (6 - thisSat.getDay()));
      dateString = thisSat.toISOString().split("T")[0];
    } else if (q.includes("next") || q.includes("2")) {
      const nextSat = new Date();
      nextSat.setDate(nextSat.getDate() + (13 - nextSat.getDay()));
      dateString = nextSat.toISOString().split("T")[0];
    } else if (q.includes("3") || q.includes("custom")) {
      const customDate = new Date();
      customDate.setDate(customDate.getDate() + 3);
      dateString = customDate.toISOString().split("T")[0];
    }

    if (dateString && nextState.leadId && nextState.profile.recommendedIds && nextState.profile.recommendedIds.length > 0) {
      saveSiteVisit(nextState.leadId, nextState.profile.recommendedIds[0], dateString, "Scheduled", "Scheduled via digital AI Advisor chat interface.");
    }
    
    nextState.profile.special_requirements = dateString ? `Site visit: ${dateString}` : "No site visit";
  } else if (state.step === 12 || state.step === 13) {
    if (q.includes("start") || q.includes("reset") || q.includes("over")) {
      nextState.step = 1;
      nextState.profile = {};
      nextState.leadId = undefined;
    } else {
      nextState.step = 13;
    }
  }

  // Now, render the output matching nextState.step!
  switch (nextState.step) {
    case 1:
      responseText = "Welcome to **NexHouz Elite Property Advisory**. I am your digital luxury real estate consultant.\n\nTo help shortlist the absolute best property fits for you in Hyderabad, may I know roughly what **budget range** you are considering?";
      chips = ["Under ₹1.5 Cr", "₹1.5–3 Cr", "₹3–5 Cr", "₹5 Cr+"];
      break;

    case 2:
      responseText = `Understood. A budget of **${formatINR(nextState.profile.budget || 30000000)}** allows us to explore premium configurations in Hyderabad's prime corridors.\n\nWill this purchase be primarily for **self-use, investment, or both**?`;
      chips = ["Self Use", "Investment", "Both"];
      break;

    case 3:
      responseText = `Got it. To optimize commute times and recommend suitable micro-markets, what is your primary **office commute location** or preferred area? (e.g. Financial District, Hitec City, Gachibowli, or WFH)`;
      chips = ["Hitec City", "Financial District", "Gachibowli", "Jubilee Hills", "Work from Home"];
      break;

    case 4:
      responseText = `Perfect. To ensure the space meets your family's needs, what is your preferred **BHK configuration**? (e.g., 2 BHK, 3 BHK, 4 BHK, or 5 BHK+)`;
      chips = ["2 BHK", "3 BHK", "4 BHK", "5 BHK+"];
      break;

    case 5:
      responseText = `Noted. Do you have a specific **property type preference**?\n\n• **Apartment**\n• **Villa**\n• **Penthouse**\n• **Flexible**`;
      chips = ["Apartment", "Villa", "Penthouse", "Flexible"];
      break;

    case 6:
      responseText = `Excellent selection. What is your preferred **possession timeline**?\n\n1. **Ready to Move** (RTM)\n2. **Under Construction** (Ongoing)\n3. **Flexible**`;
      chips = ["Ready to Move", "Under Construction", "Flexible"];
      break;

    case 7:
      responseText = `Understood. What is the single **highest priority** parameter for this purchase?\n\n• Shorter **Commute**\n• Top-tier **Schools**\n• Long-term **Appreciation**\n• **Luxury Lifestyle**\n• High **Rental Yield**\n• **Peaceful Living**`;
      chips = ["Commute", "Schools", "Appreciation", "Luxury Lifestyle", "Rental Yield", "Peaceful Living"];
      break;

    case 8:
      responseText = `Got it. Do you have any **special requirements** or specific features you need? (e.g. Senior citizen friendly, pet-friendly amenities, NRI support, or None)`;
      chips = ["No special requirements", "Senior citizens at home", "Pets", "NRI purchase", "Home office"];
      break;

    case 9:
      // Filter and Score properties
      const scoredList = properties.map(p => {
        let score = 80; // base score

        // Budget scoring
        if (nextState.profile.budget) {
          const diff = Math.abs(p.price - nextState.profile.budget);
          if (p.price > nextState.profile.budget) {
            score -= Math.min(25, (diff / nextState.profile.budget) * 30); // penalize exceeding budget
          } else {
            score += Math.min(10, (diff / nextState.profile.budget) * 10); // reward coming in under budget
          }
        }

        // Location & Commute
        if (nextState.profile.office_location) {
          const loc = nextState.profile.office_location.toLowerCase();
          if (p.location.toLowerCase().includes("kokapet") && (loc.includes("financial") || loc.includes("hitec"))) {
            score += 12;
          }
          if (p.location.toLowerCase().includes("tellapur") && loc.includes("hitec")) {
            score += 8;
          }
        }

        // Possession
        if (nextState.profile.possession === "Ready" && p.possession === "Ready") score += 10;
        if (nextState.profile.possession === "Under Construction" && p.possession === "Under Construction") score += 10;

        // Type fit
        if (nextState.profile.property_type && p.type === nextState.profile.property_type) score += 15;

        // Priorities
        if (nextState.profile.priority === "Schools" && p.nearby && p.nearby.schools >= 8) score += 10;
        if (nextState.profile.priority === "Commute" && p.nearby && p.nearby.itParks >= 4) score += 10;
        if (nextState.profile.priority === "Luxury Lifestyle" && p.scores.architecturalIntegrity >= 92) score += 10;
        if (nextState.profile.priority === "Appreciation" && p.recommendationReport && p.recommendationReport.futureAppreciation >= 9) score += 10;

        score = Math.min(99, Math.max(45, Math.round(score)));
        return { property: p, score };
      }).sort((a, b) => b.score - a.score);

      const top3 = scoredList.slice(0, 3);
      matchedProperties = top3.map(item => item.property);
      nextState.profile.recommendedIds = matchedProperties.map(p => p.id);

      responseText = `Based on your luxury profile, here are the **Top 3 Recommended Properties** selected for you:\n\n`;
      top3.forEach((item, index) => {
        const p = item.property;
        responseText += `### ${index + 1}. [${p.title}]\n`;
        responseText += `*   **Match Score**: **${item.score}%**\n`;
        responseText += `*   **Price**: **${formatINR(p.price)}** · **${p.location}**\n`;
        responseText += `*   **USP**: ${p.recommendationReport?.whyRecommended || "Premium layouts by top-tier Hyderabad developers."}\n\n`;
      });
      responseText += `I'd be happy to send these recommendations, floor plans, pricing updates, and availability details directly to you.\n\nWhat's the best **WhatsApp number** to send them to?`;
      chips = [];
      break;

    case 10:
      responseText = `Thank you. And may I have your **full name**?`;
      chips = [];
      break;

    case 11:
      responseText = `Thank you, **${nextState.profile.name || "there"}**. Your luxury profile is fully qualified.\n\nWould you like to schedule a **site visit** to tour any of these recommended properties? We have availability **This Weekend**, **Next Weekend**, or we can arrange a **Custom Date** that suits you.`;
      chips = ["This Weekend", "Next Weekend", "Custom Date", "No, not now"];
      break;

    case 12:
      const hasDate = nextState.profile.special_requirements?.includes("Site visit:");
      const visitDate = hasDate ? nextState.profile.special_requirements?.replace("Site visit:", "").trim() : "";
      
      responseText = visitDate
        ? `Site visit requested successfully for **${visitDate}**! A senior NexHouz advisor will contact you on WhatsApp at **${nextState.profile.phone}** with project brochures, gate passes, and driving directions.\n\nThank you for choosing NexHouz Elite Property Advisory!`
        : `Thank you for sharing your requirements. I have shared your property recommendations and floor plans to your WhatsApp at **${nextState.profile.phone}**.\n\nA senior advisor will be in touch shortly if you need further market analysis. Have a wonderful day!`;
      chips = ["Start Over", "Browse Listings", "Call Us"];
      break;

    default:
      responseText = "Your inquiry is already verified. A senior NexHouz luxury real estate consultant is reviewing your matched portfolio and will reach out to you shortly.";
      chips = ["Start Over", "Browse Listings", "Call Us"];
      break;
  }

  // Resolve recommended IDs to Property objects
  if (nextState.profile.recommendedIds && nextState.profile.recommendedIds.length > 0) {
    matchedProperties = nextState.profile.recommendedIds.map(id => 
      properties.find(p => p.id === id)
    ).filter(Boolean) as Property[];
  }

  return {
    responseText,
    properties: matchedProperties,
    nextState,
    chips
  };
}

function detectStepFromResponse(text: string, currentStep: number): number {
  const lower = text.toLowerCase();
  
  if (lower.includes("confirmed") || lower.includes("visit requested") || lower.includes("thank you for choosing") || lower.includes("representative will contact") || lower.includes("advisor will reach")) {
    return 12;
  }
  if (lower.includes("site visit") || lower.includes("schedule") || lower.includes("weekend") || lower.includes("tour")) {
    return 11;
  }
  if (lower.includes("full name") || (lower.includes("may i have") && lower.includes("name")) || lower.includes("what should i call you")) {
    return 10;
  }
  if (lower.includes("whatsapp") || lower.includes("phone number") || lower.includes("number to send") || lower.includes("send them to") || lower.includes("contact details")) {
    return 9;
  }
  if (lower.includes("special requirements") || lower.includes("special features") || lower.includes("senior citizen") || lower.includes("pets") || lower.includes("nri")) {
    return 8;
  }
  if (lower.includes("priority") || lower.includes("highest priority") || lower.includes("parameter") || lower.includes("aspect") || lower.includes("criteria")) {
    return 7;
  }
  if (lower.includes("possession") || lower.includes("timeline") || lower.includes("ready to move") || lower.includes("construction") || lower.includes("move-in")) {
    return 6;
  }
  if (lower.includes("property type") || lower.includes("apartment") || lower.includes("villa") || lower.includes("penthouse") || lower.includes("independent house")) {
    return 5;
  }
  if (lower.includes("family size") || lower.includes("family configuration") || lower.includes("members") || lower.includes("family structure") || lower.includes("many people") || lower.includes("bhk") || lower.includes("bedrooms")) {
    return 4;
  }
  if (lower.includes("commute") || lower.includes("office") || lower.includes("micro-market") || lower.includes("hitec") || lower.includes("gachibowli") || lower.includes("financial district") || lower.includes("workplace")) {
    return 3;
  }
  if (lower.includes("purpose") || lower.includes("self-use") || lower.includes("investment") || lower.includes("self use")) {
    return 2;
  }
  if (lower.includes("budget") || lower.includes("price") || lower.includes("range") || lower.includes("crore") || lower.includes("lakhs")) {
    return 1;
  }
  
  return currentStep;
}

// Global dispatcher handling both OpenAI API flow and local state machine fallback
export async function getAdvisorReply(
  message: string,
  history: { sender: "user" | "bot"; text: string }[],
  properties: Property[],
  state: AdvisorState
): Promise<{
  responseText: string;
  properties?: Property[];
  nextState: AdvisorState;
  chips?: string[];
}> {
  // 1. Try to invoke OpenAI proxy
  const hasOpenAiKey = !!process.env.NEXT_PUBLIC_OPENAI_API_KEY || (typeof window !== "undefined" && !!localStorage.getItem("nexhouz_openai_key"));
  
  if (hasOpenAiKey) {
    const updatedHistory = [...history, { sender: "user" as const, text: message }];
    const aiResponse = await queryOpenAiAdvisor(updatedHistory, properties);

    if (aiResponse) {
      // Parse recommended properties from brackets [...]
      // e.g. [prop-1] or [The Narsingi Sky Residency]
      const matches = aiResponse.match(/\[([^\]]+)\]/g);
      let matchedProperties: Property[] = [];
      const recommendedIds: string[] = [];

      if (matches) {
        matches.forEach(m => {
          const content = m.replace(/[\[\]]/g, "").trim();
          
          if (/^prop-\d+$/.test(content)) {
            const prop = properties.find(p => p.id === content);
            if (prop && !recommendedIds.includes(prop.id)) {
              matchedProperties.push(prop);
              recommendedIds.push(prop.id);
            }
          } else {
            // Find property containing or matching title / project name (case-insensitive)
            const cleanContent = content.toLowerCase();
            const prop = properties.find(p => {
              const title = p.title.toLowerCase();
              const proj = p.projectName ? p.projectName.toLowerCase() : "";
              return title.includes(cleanContent) || cleanContent.includes(title) ||
                     (proj && (proj.includes(cleanContent) || cleanContent.includes(proj)));
            });
            if (prop && !recommendedIds.includes(prop.id)) {
              matchedProperties.push(prop);
              recommendedIds.push(prop.id);
            }
          }
        });
      }

      // Sync lead captures asynchronously in CRM background if OpenAI reports details
      const allText = [...history.map(m => m.text), message, aiResponse].join(" ").toLowerCase();
      const nextState = { ...state };
      nextState.profile = { ...state.profile };

      // Parse the trailing [STATE: ...] tag from the LLM response
      let responseText = aiResponse;
      let parsedStep = state.step;
      let parsedChips: string[] | undefined = undefined;

      const stateMatch = responseText.match(/\[STATE:\s*step=(\d+)(?:,\s*chips=([^\]]+))?\]/i);
      if (stateMatch) {
        parsedStep = parseInt(stateMatch[1], 10);
        if (stateMatch[2]) {
          parsedChips = stateMatch[2].split("|").map(c => c.trim()).filter(Boolean);
        }
        // Clean responseText by stripping the [STATE: ...] tag
        responseText = responseText.replace(/\[STATE:\s*step=\d+(?:,\s*chips=[^\]]+)?\]/gi, "").trim();
      } else {
        // Tag not found: use robust keyword/context-based step detection
        parsedStep = detectStepFromResponse(responseText, state.step);
      }
      nextState.step = parsedStep;

      // Populate parsedChips if missing/empty to ensure suggestions are always dynamic
      if (!parsedChips || parsedChips.length === 0) {
        const defaultChipsMap: Record<number, string[]> = {
          1: ["Under ₹1.5 Cr", "₹1.5–3 Cr", "₹3–5 Cr", "₹5 Cr+"],
          2: ["Self Use", "Investment", "Both"],
          3: ["Hitec City", "Financial District", "Gachibowli", "Jubilee Hills", "Work from Home"],
          4: ["2 BHK", "3 BHK", "4 BHK", "5 BHK+"],
          5: ["Apartment", "Villa", "Penthouse", "Flexible"],
          6: ["Ready to Move", "Under Construction", "Flexible"],
          7: ["Commute", "Schools", "Appreciation", "Luxury Lifestyle", "Rental Yield", "Peaceful Living"],
          8: ["No special requirements", "Senior citizens at home", "Pets", "NRI purchase", "Home office"],
          11: ["This Weekend", "Next Weekend", "Custom Date", "No, not now"],
          12: ["Start Over", "Browse Listings", "Call Us"],
          13: ["Start Over", "Browse Listings", "Call Us"]
        };
        parsedChips = defaultChipsMap[parsedStep] || [];
      }

      // Extract recommended property IDs
      if (recommendedIds.length > 0) {
        nextState.profile.recommendedIds = recommendedIds;
      }
      
      // Extract phone and name from structured message first if matched
      const structuredMatch = message.match(/My name is\s+(.+?)\s+and my WhatsApp number is\s+(\+?\d[\d\-\s]{7,12}\d)/i);
      if (structuredMatch) {
        nextState.profile.name = structuredMatch[1].trim();
        nextState.profile.phone = structuredMatch[2].replace(/\s+/g, "");
      } else {
        // Extract phone from current message (user likely sending their number)
        const phoneMatch = message.match(/(\+?\d[\d\-\s]{7,12}\d)/);
        if (phoneMatch && !nextState.profile.phone) {
          nextState.profile.phone = phoneMatch[1].replace(/\s+/g, "");
        }
      }

      // Extract budget from history
      if (!nextState.profile.budget) {
        const budgetMatch = allText.match(/([\d.]+)\s*(?:cr|crore|crores)/);
        if (budgetMatch) nextState.profile.budget = parseFloat(budgetMatch[1]) * 10000000;
      }

      // Extract purpose from history
      if (!nextState.profile.purpose) {
        if (allText.includes("self use") || allText.includes("self-use") || allText.includes("own use") || allText.includes("live in")) {
          nextState.profile.purpose = "Self Use";
        } else if (allText.includes("investment") || allText.includes("rental")) {
          nextState.profile.purpose = "Investment";
        }
      }

      // Try to extract name — look for messages after "name" was asked
      if (!nextState.profile.name) {
        const nameAsked = history.findIndex(m => m.sender === "bot" && (m.text.toLowerCase().includes("your name") || m.text.toLowerCase().includes("may i have")));
        if (nameAsked !== -1 && nameAsked + 1 < history.length) {
          const nameReply = history[nameAsked + 1];
          if (nameReply.sender === "user" && nameReply.text.length < 40 && !/\d{6,}/.test(nameReply.text)) {
            nextState.profile.name = nameReply.text.replace(/^name\s*[:=]\s*/i, "").trim();
          }
        }
        // Also check current message if it's a short string with no digits (likely a name reply)
        if (!nextState.profile.name) {
          const isShortNoDigits = message.length < 40 && !/\d{5,}/.test(message);
          const prevMsg = history[history.length - 1];
          const prevWasNameAsk = prevMsg && prevMsg.sender === "bot" && 
            (prevMsg.text.toLowerCase().includes("your name") || prevMsg.text.toLowerCase().includes("may i have your"));
          if (prevWasNameAsk && isShortNoDigits) {
            nextState.profile.name = message.replace(/^name\s*[:=]\s*/i, "").trim();
          }
        }
      }

      // Save lead to CRM when we have both phone AND name (and haven't saved yet)
      if (nextState.profile.phone && nextState.profile.name && !state.leadId) {
        const triggerCrmSave = async () => {
          try {
            const summaryText = `AI Advisor lead: ${nextState.profile.name}. Budget: ${formatINR(nextState.profile.budget || 40000000)}, Office: ${nextState.profile.office_location || "N/A"}, Priority: ${nextState.profile.priority || "N/A"}.`;
            const createdId = await submitLeadAndGetId({
              name: nextState.profile.name || "AI Lead",
              email: `${(nextState.profile.name || "ai").toLowerCase().replace(/\s+/g, "")}@nexhouz.ai`,
              phone: nextState.profile.phone || "",
              notes: summaryText,
              leadType: "ai_advisor"
            });
            
            if (createdId) {
              nextState.leadId = createdId;
              let score = 60;
              if ((nextState.profile.budget || 0) >= 30000000) score += 15;
              if (nextState.profile.possession === "Ready") score += 10;
              if (nextState.profile.phone) score += 10;
              if ((nextState.profile.recommendedIds || []).length > 0) score += 5;
              score = Math.min(100, score);

              await saveAiLeadProfile(createdId, {
                budget: nextState.profile.budget || 40000000,
                purpose: nextState.profile.purpose || "Both",
                office_location: nextState.profile.office_location || "None",
                family_size: nextState.profile.family_size || 4,
                property_type: nextState.profile.property_type || "Apartment",
                priority: nextState.profile.priority || "Appreciation",
                lead_score: score
              });

              if ((nextState.profile.recommendedIds || []).length > 0) {
                await saveLeadRecommendations(createdId, (nextState.profile.recommendedIds || []).map(pid => ({
                  property_id: pid,
                  match_score: 88,
                  reasoning: "AI-recommended based on buyer profile collected during OpenAI conversation."
                })));
              }

              await saveAiConversation(createdId, 
                history.map(m => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text })),
                summaryText
              );
              
              console.log("✅ AI CRM lead saved via OpenAI path:", createdId);
            }
          } catch (e) {
            console.warn("Non-critical: CRM save failed in OpenAI path:", e);
          }
        };
        triggerCrmSave();
      }

      // Return LLM response
      return {
        responseText: responseText,
        properties: matchedProperties.length > 0 ? matchedProperties : undefined,
        nextState,
        chips: parsedChips
      };
    }
  }

  // 2. Fallback to client-side conversational state machine
  return runLocalFallback(message, state, properties);
}
