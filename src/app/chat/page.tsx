"use client";

import { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, X, Send, Award, ShieldCheck, ArrowRight,
  MapPin, Home, Phone, User, Calendar, CheckCircle,
  Building2, Clock, Star, ChevronRight, TrendingUp,
  Layers, RotateCcw, Search
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { getAdvisorReply, AdvisorState } from "@/lib/chatService";
import { fetchAllProperties } from "@/lib/db";
import { Property } from "@/data/properties";

// ─────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────
interface ChatMessage {
  sender: "user" | "bot";
  text: string;
  properties?: Property[];
  matchScores?: Record<string, number>;
  type?: "normal" | "lead_capture" | "site_visit" | "summary";
}

// ─────────────────────────────────────────────────
// Contextual typing status messages per step
// ─────────────────────────────────────────────────
const TYPING_MESSAGES = [
  "Analyzing your requirements…",
  "Matching against 27 properties…",
  "Checking RERA compliance…",
  "Evaluating commute routes…",
  "Computing match scores…",
  "Reviewing builder credibility…",
  "Assessing appreciation potential…",
  "Preparing personalized insights…",
];

// ─────────────────────────────────────────────────
// Quick-reply chip config per chat step
// ─────────────────────────────────────────────────
const STEP_CHIPS: Record<number, string[]> = {
  1: ["Under ₹3 Cr", "₹3–5 Cr", "₹5–8 Cr", "₹8 Cr+"],
  2: ["Self Use", "Investment", "Both"],
  3: ["Hitec City", "Financial District", "Gachibowli", "Jubilee Hills", "Work from Home"],
  4: ["2 members", "3–4 members", "5+ members (joint family)"],
  5: ["Apartment", "Villa", "Penthouse", "Flexible"],
  6: ["Ready to Move", "Under Construction", "Flexible"],
  7: ["Commute", "Schools", "Appreciation", "Luxury Lifestyle", "Rental Yield", "Peaceful Living"],
  8: ["No special requirements", "Senior citizens at home", "Pets", "NRI purchase", "Home office"],
  11: ["This Weekend", "Next Weekend", "Custom Date", "No, not now"],
  12: ["Start Over", "Browse Listings", "Call Us"],
  13: ["Start Over", "Browse Listings", "Call Us"],
};

// Helper to render dynamic icons next to suggestion chips
function getChipIcon(text: string) {
  const clean = text.toLowerCase().trim();
  if (clean.includes("self use")) return <Home size={11} className="text-gray-400" />;
  if (clean.includes("investment")) return <TrendingUp size={11} className="text-gray-400" />;
  if (clean.includes("apartment")) return <Building2 size={11} className="text-gray-400" />;
  if (clean.includes("villa")) return <Home size={11} className="text-gray-400" />;
  if (clean.includes("penthouse")) return <Layers size={11} className="text-gray-400" />;
  if (clean.includes("start over")) return <RotateCcw size={11} className="text-gray-400" />;
  if (clean.includes("browse")) return <Search size={11} className="text-gray-400" />;
  if (clean.includes("call")) return <Phone size={11} className="text-gray-400" />;
  return null;
}

// ─────────────────────────────────────────────────
// Inline Lead Capture Card Component
// ─────────────────────────────────────────────────
function LeadCaptureCard({ onSubmit, isSubmitting }: {
  onSubmit: (name: string, phone: string) => void;
  isSubmitting: boolean;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim().length >= 10) {
      onSubmit(name.trim(), phone.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[85%] bg-white border border-brand-red/20 rounded-2xl overflow-hidden shadow-md mt-2"
    >
      <div className="bg-brand-red/5 px-5 py-3.5 border-b border-brand-red/10 flex items-center gap-2">
        <Sparkles size={14} className="text-brand-red" />
        <p className="text-xs font-extrabold text-brand-black">Get Floor Plans & Pricing on WhatsApp</p>
      </div>
      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        <div className="relative">
          <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full pl-8 pr-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-brand-red font-semibold bg-gray-50"
            required
          />
        </div>
        <div className="relative">
          <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="tel"
            placeholder="WhatsApp number (10 digits)"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full pl-8 pr-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-brand-red font-semibold bg-gray-50"
            pattern="[0-9+\- ]{10,15}"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !name.trim() || phone.trim().length < 10}
          className="w-full py-2.5 bg-brand-red text-white text-xs font-extrabold rounded-xl hover:bg-brand-red/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending…</>
          ) : (
            <><Send size={12} /> Send Me Property Details</>
          )}
        </button>
        <p className="text-[9px] text-gray-400 text-center font-semibold">🔒 No spam. WhatsApp only. You can opt out anytime.</p>
      </form>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────
// Site Visit Picker Component
// ─────────────────────────────────────────────────
function SiteVisitPicker({ onSelect }: { onSelect: (option: string) => void }) {
  const [customDate, setCustomDate] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const thisWeekend = (() => {
    const d = new Date();
    d.setDate(d.getDate() + (6 - d.getDay() + 7) % 7 || 7);
    return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  })();
  const nextWeekend = (() => {
    const d = new Date();
    d.setDate(d.getDate() + (6 - d.getDay() + 7) % 7 + 7 || 14);
    return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  })();

  const options = [
    { id: "this_weekend", label: "This Weekend", date: thisWeekend, icon: "🗓️" },
    { id: "next_weekend", label: "Next Weekend", date: nextWeekend, icon: "📅" },
    { id: "custom", label: "Pick a Date", date: "Choose your own", icon: "🔧" },
    { id: "no", label: "Not Now", date: "Skip for now", icon: "🙅" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[85%] bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-md mt-2"
    >
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 bg-gray-50/80">
        <Calendar size={13} className="text-brand-red" />
        <p className="text-xs font-extrabold text-brand-black">Schedule Site Visit</p>
      </div>
      <div className="p-3 grid grid-cols-2 gap-2">
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => {
              if (opt.id === "custom") { setShowCustom(true); setSelected("custom"); return; }
              setSelected(opt.id);
              onSelect(opt.label);
            }}
            className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selected === opt.id
                ? "border-brand-red bg-brand-red/5"
                : "border-gray-100 hover:border-brand-red/30 bg-white"
            }`}
          >
            <span className="text-base">{opt.icon}</span>
            <span className="text-[11px] font-extrabold text-brand-black mt-1">{opt.label}</span>
            <span className="text-[9px] text-gray-400 font-semibold">{opt.date}</span>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {showCustom && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="px-3 pb-3">
            <input
              type="date"
              value={customDate}
              onChange={e => setCustomDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-brand-red font-semibold"
            />
            <button
              onClick={() => { if (customDate) onSelect(`Custom: ${customDate}`); }}
              disabled={!customDate}
              className="w-full mt-2 py-2 bg-brand-red text-white text-xs font-extrabold rounded-xl hover:bg-brand-red/90 disabled:opacity-40 transition-all"
            >
              Confirm Date
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────
// Conversation Summary Card
// ─────────────────────────────────────────────────
function ConversationSummary({ profile, recommendedProperties }: {
  profile: AdvisorState["profile"];
  recommendedProperties: Property[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[90%] bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg mt-2"
    >
      <div className="bg-brand-black px-5 py-3.5 flex items-center gap-2">
        <CheckCircle size={14} className="text-emerald-400" />
        <p className="text-xs font-extrabold text-white">Your Advisory Summary</p>
      </div>

      {/* Profile summary */}
      <div className="p-4 grid grid-cols-2 gap-2 border-b border-gray-100">
        {[
          { icon: "💰", label: "Budget", value: profile.budget ? `₹${(profile.budget / 10000000).toFixed(1)} Cr` : "N/A" },
          { icon: "🏠", label: "Purpose", value: profile.purpose || "N/A" },
          { icon: "🏢", label: "Commute", value: profile.office_location || "N/A" },
          { icon: "🏗️", label: "Type", value: profile.property_type || "N/A" },
          { icon: "📦", label: "Possession", value: profile.possession || "Flexible" },
          { icon: "⭐", label: "Priority", value: profile.priority || "N/A" },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="text-sm">{item.icon}</span>
            <div>
              <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">{item.label}</p>
              <p className="text-[11px] font-extrabold text-brand-black">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended properties */}
      {recommendedProperties.length > 0 && (
        <div className="p-4 space-y-2 border-b border-gray-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Your Top Matches</p>
          {recommendedProperties.slice(0, 3).map(prop => (
            <Link
              key={prop.id}
              href={`/properties/${prop.slug}`}
              target="_blank"
              className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl hover:bg-brand-red/5 border border-gray-100 hover:border-brand-red/20 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-extrabold text-brand-black truncate group-hover:text-brand-red transition-colors">{prop.title}</p>
                <p className="text-[8px] text-gray-400 font-bold">{prop.location.split(",")[0]} · {prop.possession === "Ready" ? "RTM" : "Ongoing"}</p>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-[10px] font-black text-brand-red">
                  ₹{prop.price >= 10000000 ? `${(prop.price / 10000000).toFixed(1)} Cr` : `${(prop.price / 100000).toFixed(0)}L`}
                </span>
                <ChevronRight size={10} className="text-gray-400 group-hover:text-brand-red transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="p-4 flex gap-2">
        <Link href="/" className="flex-1 py-2.5 text-center text-xs font-extrabold bg-gray-100 hover:bg-gray-200 text-brand-black rounded-xl transition-all">
          Back to Home
        </Link>
        <Link href="/properties" className="flex-1 py-2.5 text-center text-xs font-extrabold bg-brand-red text-white rounded-xl hover:bg-brand-red/90 transition-all">
          Browse All Properties
        </Link>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────
// Upgraded Property Card
// ─────────────────────────────────────────────────
function PropertyCard({ prop, matchScore }: { prop: Property; matchScore?: number }) {
  return (
    <Link
      href={`/properties/${prop.slug}`}
      target="_blank"
      className="w-48 bg-white border border-gray-150 rounded-2xl overflow-hidden shrink-0 snap-start shadow-sm hover:shadow-lg hover:border-brand-red/30 transition-all flex flex-col justify-between group cursor-pointer"
    >
      <div className="relative h-28 bg-gray-50 overflow-hidden">
        <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Match score badge */}
        {matchScore && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[8px] font-black flex items-center gap-1">
            <Star size={7} className="fill-white" />{matchScore}% Match
          </div>
        )}
        {/* RTM badge */}
        <div className="absolute top-2 left-2 bg-brand-black/80 text-white px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase">
          {prop.possession === "Ready" ? "RTM" : "Ongoing"}
        </div>
        {/* BHK overlay on image bottom */}
        <div className="absolute bottom-2 left-2 text-white text-[9px] font-extrabold">
          <span className="bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded">{prop.bhk} · {prop.type}</span>
        </div>
      </div>
      <div className="p-3 space-y-2.5 flex-grow flex flex-col justify-between">
        <div className="space-y-0.5">
          <h4 className="text-[11px] font-black text-brand-black group-hover:text-brand-red transition-colors line-clamp-2 leading-tight">{prop.title}</h4>
          <div className="flex items-center gap-1 text-gray-400">
            <MapPin size={8} />
            <p className="text-[8px] font-extrabold uppercase tracking-widest truncate">{prop.location.split(",")[0]}</p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
          <span className="text-[12px] font-black text-brand-red">
            ₹{prop.price >= 10000000 ? `${(prop.price / 10000000).toFixed(2)} Cr` : `${(prop.price / 100000).toFixed(0)} L`}
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest text-brand-black group-hover:text-brand-red transition-colors flex items-center gap-0.5">
            View <ArrowRight size={8} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────
// Render message text with bold formatting
// ─────────────────────────────────────────────────
function MessageText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-extrabold">{part.slice(2, -2)}</strong>;
        }
        // Handle markdown-style headers
        if (part.startsWith("# ") || part.startsWith("## ")) {
          return <span key={i} className="block font-black text-brand-black mt-2 mb-0.5">{part.replace(/^#+\s/, "")}</span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// ─────────────────────────────────────────────────
// Main Chat Content
// ─────────────────────────────────────────────────
function ChatContent() {
  const searchParams = useSearchParams();
  const botName = searchParams.get("bot") || "NexHouz AI Advisor";

  const [liveProperties, setLiveProperties] = useState<Property[]>([]);
  const [chatState, setChatState] = useState<AdvisorState>({ step: 1, profile: {} });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [typingMsgIdx, setTypingMsgIdx] = useState(0);
  const [leadCaptureSubmitted, setLeadCaptureSubmitted] = useState(false);
  const [siteVisitSelected, setSiteVisitSelected] = useState(false);
  const [isLeadSubmitting, setIsLeadSubmitting] = useState(false);
  const [summaryProps, setSummaryProps] = useState<Property[]>([]);
  const [activeChips, setActiveChips] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Rotate typing messages every 1.8s
  useEffect(() => {
    if (!isBotTyping) return;
    const interval = setInterval(() => {
      setTypingMsgIdx(i => (i + 1) % TYPING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isBotTyping]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isBotTyping]);

  // Synchronize chat messages and state to localStorage for seamless widget handoff
  useEffect(() => {
    if (chatMessages.length > 0) {
      localStorage.setItem("nexhouz_chat_history", JSON.stringify(chatMessages));
      localStorage.setItem("nexhouz_chat_state", JSON.stringify(chatState));
      localStorage.setItem("nexhouz_lead_captured", leadCaptureSubmitted ? "true" : "false");
      localStorage.setItem("nexhouz_site_visit_selected", siteVisitSelected ? "true" : "false");
    }
  }, [chatMessages, chatState, leadCaptureSubmitted, siteVisitSelected]);

  // Load properties + start/restore chat
  useEffect(() => {
    async function load() {
      const props = await fetchAllProperties();
      setLiveProperties(props);

      // Check if we have active chat state in localStorage
      const storedHistory = localStorage.getItem("nexhouz_chat_history");
      const storedState = localStorage.getItem("nexhouz_chat_state");
      const storedLeadCaptured = localStorage.getItem("nexhouz_lead_captured") === "true";
      const storedSiteVisit = localStorage.getItem("nexhouz_site_visit_selected") === "true";

      if (storedHistory && storedState) {
        try {
          const parsedHistory = JSON.parse(storedHistory);
          const parsedState = JSON.parse(storedState);
          setChatMessages(parsedHistory);
          setChatState(parsedState);
          setLeadCaptureSubmitted(storedLeadCaptured);
          setSiteVisitSelected(storedSiteVisit);
          
          // Find any recommended properties in stored state
          if (parsedState.profile?.recommendedIds) {
            const matchedProps = parsedState.profile.recommendedIds.map((id: string) => 
              props.find(p => p.id === id)
            ).filter(Boolean) as Property[];
            setSummaryProps(matchedProps);
          }
          return; // Skip initial greeting since we restored state
        } catch (e) {
          console.error("Error loading chat history:", e);
        }
      }

      setIsBotTyping(true);
      const initialState: AdvisorState = { step: 1, profile: {} };
      setChatState(initialState);
      try {
        const reply = await getAdvisorReply("", [], props, initialState);
        const newMsgs = [{ sender: "bot" as const, text: reply.responseText, properties: reply.properties }];
        setChatMessages(newMsgs);
        setChatState(reply.nextState);
        if (reply.chips && reply.chips.length > 0) {
          setActiveChips(reply.chips);
        } else {
          setActiveChips([]);
        }
      } catch {
        const newMsgs = [{ sender: "bot" as const, text: "Welcome to **NexHouz Elite Property Advisory**. I am your digital real estate consultant.\n\nTo help shortlist the absolute best property fits for you in Hyderabad, may I know roughly what **budget range** you are considering?" }];
        setChatMessages(newMsgs);
        setChatState({ step: 1, profile: {} });
      } finally {
        setIsBotTyping(false);
      }
    }
    load();
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isBotTyping) return;
    const userMsg = text.trim();

    const historyBefore = chatMessages.map(m => ({ sender: m.sender, text: m.text }));
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    setIsBotTyping(true);

    try {
      const reply = await getAdvisorReply(userMsg, historyBefore, liveProperties, chatState);
      
      // Track recommended properties for summary
      if (reply.properties && reply.properties.length > 0) {
        setSummaryProps(reply.properties);
      }

      // Determine if we should render special UI components
      const nextStep = reply.nextState.step;
      const responseText = reply.responseText;
      const lowerResponse = responseText.toLowerCase();
      const hasRecommendations = summaryProps.length > 0 || (reply.properties && reply.properties.length > 0);

      // Lead capture: triggered when GPT asks for WhatsApp/contact AND we have property recommendations
      const isLeadCapture = !leadCaptureSubmitted && hasRecommendations && (
        nextStep === 9 ||
        lowerResponse.includes("whatsapp number") ||
        (lowerResponse.includes("whatsapp") && lowerResponse.includes("send")) ||
        lowerResponse.includes("best number") ||
        (lowerResponse.includes("phone number") && lowerResponse.includes("send")) ||
        lowerResponse.includes("send them to") ||
        (lowerResponse.includes("floor plans") && lowerResponse.includes("directly"))
      );

      // Site visit: only after lead is captured, triggered by site-visit specific language
      const isSiteVisit = !siteVisitSelected && leadCaptureSubmitted && (
        nextStep === 11 ||
        (lowerResponse.includes("site visit") && (lowerResponse.includes("weekend") || lowerResponse.includes("schedule") || lowerResponse.includes("date"))) ||
        (lowerResponse.includes("this weekend") && lowerResponse.includes("next weekend"))
      );

      // Conversation end: final thank-you or confirmed site visit booking
      const isConversationEnd = !isSiteVisit && (
        nextStep >= 12 ||
        lowerResponse.includes("senior advisor will be in touch") ||
        lowerResponse.includes("senior nexhouz advisor will contact") ||
        lowerResponse.includes("thank you for choosing nexhouz") ||
        (lowerResponse.includes("site visit") && lowerResponse.includes("confirmed") && siteVisitSelected)
      );

      const newMsg: ChatMessage = {
        sender: "bot",
        text: responseText,
        properties: reply.properties,
        type: isLeadCapture ? "lead_capture" : isSiteVisit ? "site_visit" : isConversationEnd ? "summary" : "normal"
      };

      setChatMessages(prev => [...prev, newMsg]);
      setChatState(reply.nextState);
      if (reply.chips && reply.chips.length > 0) {
        setActiveChips(reply.chips);
      } else {
        setActiveChips([]);
      }
    } catch {
      setChatMessages(prev => [...prev, { sender: "bot", text: "I apologize — please repeat that. I want to make sure I fully understand your requirements." }]);
    } finally {
      setIsBotTyping(false);
    }
  }, [chatMessages, chatState, isBotTyping, leadCaptureSubmitted, liveProperties, siteVisitSelected]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(chatInput);
  };

  const handleChipClick = (chip: string) => {
    // Clean chip text (remove emoji)
    const cleaned = chip.replace(/[\u{1F300}-\u{1F9FF}]/gu, "").replace(/[🏠📈🏢🏗️📦⭐📅🗓️🙅🔧]/g, "").trim();
    sendMessage(cleaned);
  };

  const handleLeadCaptureSubmit = async (name: string, phone: string) => {
    setIsLeadSubmitting(true);
    setLeadCaptureSubmitted(true);
    // Send as a structured message that the AI can parse
    const combinedMsg = `My name is ${name} and my WhatsApp number is ${phone}`;
    await sendMessage(combinedMsg);
    setIsLeadSubmitting(false);
  };

  const handleSiteVisitSelect = (option: string) => {
    setSiteVisitSelected(true);
    sendMessage(option);
  };

  // Get current step chips
  const currentChips = activeChips.length > 0 ? activeChips : (STEP_CHIPS[chatState.step] || []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50 text-brand-black">
      <Navbar />

      {/* Main container beneath Navbar */}
      <main className="flex-1 mt-[76px] p-4 overflow-hidden max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-4">

        {/* Left Sidebar */}
        <div className="w-full md:w-72 shrink-0 h-full flex flex-col bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          {/* Bot identity header */}
          <div className="p-5 pb-4 border-b border-gray-50 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-brand-red/5 border border-brand-red/10 flex items-center justify-center text-brand-red shrink-0">
                <Sparkles size={18} className="animate-pulse" />
              </div>
              <div>
                <h2 className="font-extrabold text-brand-black text-sm">{botName}</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[9px] text-emerald-600 font-extrabold uppercase tracking-wider">Active 24/7 Advisor</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
              Senior luxury real estate consultant. Personally advising buyers in Hyderabad since 2018.
            </p>
          </div>

          {/* Discovery Roadmap */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-gray-50/30">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-400">Consultation Roadmap</h3>
            <div className="space-y-2.5">
              {[
                { step: 1, label: "Budget Range" },
                { step: 2, label: "Self-Use or Investment" },
                { step: 3, label: "Office Commute" },
                { step: 4, label: "Family Size" },
                { step: 5, label: "Property Type" },
                { step: 6, label: "Possession Target" },
                { step: 7, label: "Priority Parameter" },
                { step: 8, label: "Special Requirements" },
                { step: 9, label: "Top 3 Matched" },
                { step: 10, label: "Contact Captured" },
                { step: 11, label: "Site Visit Booked" },
              ].map((s) => {
                const isCompleted = chatState.step > s.step;
                const isActive = chatState.step === s.step;
                return (
                  <div key={s.step} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-black border transition-all ${
                      isCompleted ? "bg-emerald-500 border-emerald-500 text-white" :
                      isActive ? "bg-brand-red border-brand-red text-white shadow-sm shadow-brand-red/20 animate-pulse" :
                      "border-gray-200 text-gray-400 bg-white"
                    }`}>
                      {isCompleted ? "✓" : s.step}
                    </div>
                    <span className={`text-[11px] font-bold transition-all ${
                      isCompleted ? "text-gray-400 line-through" :
                      isActive ? "text-brand-black font-extrabold" : "text-gray-400"
                    }`}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom trust badges */}
          <div className="p-4 bg-brand-black text-white space-y-2">
            <div className="flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-wider text-white/90">
              <Award size={12} className="text-brand-red" />
              <span>RERA & GHMC Vetted Listings</span>
            </div>
            <div className="flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-wider text-white/90">
              <ShieldCheck size={12} className="text-brand-red" />
              <span>100% Commission-Free Guidance</span>
            </div>
          </div>
        </div>

        {/* Right: Chat Container */}
        <div className="flex-grow h-full flex flex-col bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          {/* Messages */}
          <div className="flex-grow p-5 overflow-y-auto space-y-4 bg-gray-50/40">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                {/* Message bubble */}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-brand-red text-white rounded-tr-sm shadow-md shadow-brand-red/10 font-semibold"
                    : "bg-white border border-gray-100 text-brand-black rounded-tl-sm shadow-sm font-medium"
                }`}>
                  {msg.sender === "bot"
                    ? <MessageText text={msg.text} />
                    : msg.text
                  }
                </div>

                {/* Special inline UI after bot messages */}
                {msg.sender === "bot" && (
                  <>
                    {/* Property cards */}
                    {msg.properties && msg.properties.length > 0 && (
                      <div
                        className="mt-3 w-full max-w-[90%] flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
                        style={{ scrollbarWidth: "none" }}
                      >
                        {msg.properties.map((prop, pi) => (
                          <PropertyCard
                            key={prop.id}
                            prop={prop}
                            matchScore={95 - pi * 7}
                          />
                        ))}
                      </div>
                    )}

                    {/* Lead capture inline card (only on the relevant message, not submitted yet) */}
                    {msg.type === "lead_capture" && !leadCaptureSubmitted && i === chatMessages.length - 1 && (
                      <LeadCaptureCard
                        onSubmit={handleLeadCaptureSubmit}
                        isSubmitting={isLeadSubmitting}
                      />
                    )}

                    {/* Site visit picker */}
                    {msg.type === "site_visit" && !siteVisitSelected && i === chatMessages.length - 1 && (
                      <SiteVisitPicker onSelect={handleSiteVisitSelect} />
                    )}

                    {/* Conversation summary */}
                    {msg.type === "summary" && i === chatMessages.length - 1 && (
                      <ConversationSummary
                        profile={chatState.profile}
                        recommendedProperties={summaryProps}
                      />
                    )}
                  </>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isBotTyping && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-xl bg-brand-red/5 border border-brand-red/10 flex items-center justify-center shrink-0">
                  <Sparkles size={11} className="text-brand-red animate-pulse" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex flex-col gap-1.5 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-[9px] font-semibold text-gray-400 animate-pulse">{TYPING_MESSAGES[typingMsgIdx]}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick-reply chips */}
          <AnimatePresence>
            {currentChips.length > 0 && !isBotTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="px-4 py-2.5 border-t border-gray-50 flex gap-2 flex-wrap bg-gray-50/50"
              >
                {currentChips.map(chip => (
                  <button
                    key={chip}
                    onClick={() => handleChipClick(chip)}
                    className="px-3 py-1.5 bg-white border border-gray-200 hover:border-brand-red hover:text-brand-red text-gray-600 text-[10px] font-extrabold rounded-full transition-all cursor-pointer whitespace-nowrap hover:shadow-sm active:scale-95 flex items-center gap-1.5"
                  >
                    {getChipIcon(chip)}
                    {chip}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input form */}
          <form onSubmit={handleSend} className="p-3.5 border-t border-gray-100 bg-white flex items-center gap-2.5 shrink-0">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your response or tap a suggestion above…"
              className="flex-1 bg-gray-50 border border-gray-200 px-4 py-3 text-xs rounded-full focus:outline-none focus:border-brand-red font-semibold transition-all placeholder:text-gray-400"
              disabled={isBotTyping}
            />
            <button
              type="submit"
              disabled={isBotTyping || !chatInput.trim()}
              className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center hover:bg-brand-red/90 active:scale-95 transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-brand-red/10"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
