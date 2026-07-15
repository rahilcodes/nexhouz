"use client";

import { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Send, Award, ShieldCheck, ArrowRight,
  MapPin, Home, Phone, User, Calendar, CheckCircle,
  Building2, Star, ChevronRight, TrendingUp,
  Layers, RotateCcw, Search
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { CONTAINER } from "@/components/ui/theme";
import { getAdvisorReply, AdvisorState } from "@/lib/chatService";
import { fetchAllProperties } from "@/lib/db";
import { Property } from "@/data/properties";

const formatPrice = (price: number) => {
  if (price >= 10000000) {
    return `₹${parseFloat((price / 10000000).toFixed(2))} Cr`;
  }
  return `₹${parseFloat((price / 100000).toFixed(2))} Lakhs`;
};

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
  13: ["Start Over", "Browse Listings", "Call Us"],
};

// Helper to render dynamic icons next to suggestion chips
function getChipIcon(text: string) {
  const clean = text.toLowerCase().trim();
  if (clean.includes("self use")) return <Home size={11} className="text-[#948d7c]" />;
  if (clean.includes("investment")) return <TrendingUp size={11} className="text-[#948d7c]" />;
  if (clean.includes("apartment")) return <Building2 size={11} className="text-[#948d7c]" />;
  if (clean.includes("villa")) return <Home size={11} className="text-[#948d7c]" />;
  if (clean.includes("penthouse")) return <Layers size={11} className="text-[#948d7c]" />;
  if (clean.includes("start over")) return <RotateCcw size={11} className="text-[#948d7c]" />;
  if (clean.includes("browse")) return <Search size={11} className="text-[#948d7c]" />;
  if (clean.includes("call")) return <Phone size={11} className="text-[#948d7c]" />;
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
      className="w-full max-w-[85%] bg-white border border-[#EEE9E0] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(30,25,15,0.08)] mt-2"
    >
      <div className="bg-[#FAF7F1] px-5 py-3.5 border-b border-[#EEE9E0] flex items-center gap-2">
        <Sparkles size={14} className="text-[#D31E28]" />
        <p className="text-[12.5px] font-semibold text-[#0A0A0A]">Get Floor Plans &amp; Pricing on WhatsApp</p>
      </div>
      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        <div className="relative">
          <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#948d7c]" />
          <input
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full pl-8 pr-4 py-2.5 text-[12.5px] border-[1.5px] border-[#e0d9cb] rounded-[10px] focus:outline-none focus:border-[#D31E28] font-medium bg-white text-[#0A0A0A] placeholder-[#948d7c] transition-colors"
            required
          />
        </div>
        <div className="relative">
          <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#948d7c]" />
          <input
            type="tel"
            placeholder="WhatsApp number (10 digits)"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full pl-8 pr-4 py-2.5 text-[12.5px] border-[1.5px] border-[#e0d9cb] rounded-[10px] focus:outline-none focus:border-[#D31E28] font-medium bg-white text-[#0A0A0A] placeholder-[#948d7c] transition-colors"
            pattern="[0-9+\- ]{10,15}"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !name.trim() || phone.trim().length < 10}
          className="w-full py-3 bg-[#D31E28] hover:bg-[#B8171F] text-white text-[12.5px] font-semibold rounded-[10px] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending…</>
          ) : (
            <><Send size={12} /> Send Me Property Details</>
          )}
        </button>
        <p className="text-[10px] text-[#948d7c] text-center font-medium">🔒 No spam. WhatsApp only. You can opt out anytime.</p>
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
      className="w-full max-w-[85%] bg-white border border-[#EEE9E0] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(30,25,15,0.08)] mt-2"
    >
      <div className="px-4 py-3 border-b border-[#EEE9E0] flex items-center gap-2 bg-[#FAF7F1]">
        <Calendar size={13} className="text-[#D31E28]" />
        <p className="text-[12.5px] font-semibold text-[#0A0A0A]">Schedule Site Visit</p>
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
                ? "border-[#D31E28] bg-[#fdf6f6]"
                : "border-[#EEE9E0] hover:border-[#d8d2c6] bg-white"
            }`}
          >
            <span className="text-base">{opt.icon}</span>
            <span className="text-[11.5px] font-semibold text-[#0A0A0A] mt-1">{opt.label}</span>
            <span className="text-[10px] text-[#948d7c] font-medium">{opt.date}</span>
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
              className="w-full px-3 py-2 text-xs border-[1.5px] border-[#e0d9cb] rounded-[10px] focus:outline-none focus:border-[#D31E28] font-medium text-[#0A0A0A] transition-colors"
            />
            <button
              onClick={() => { if (customDate) onSelect(`Custom: ${customDate}`); }}
              disabled={!customDate}
              className="w-full mt-2 py-2.5 bg-[#D31E28] hover:bg-[#B8171F] text-white text-xs font-semibold rounded-[10px] disabled:opacity-40 transition-colors cursor-pointer"
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
      className="w-full max-w-[90%] bg-white border border-[#EEE9E0] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(30,25,15,0.1)] mt-2"
    >
      <div className="bg-[#0A0A0A] px-5 py-3.5 flex items-center gap-2">
        <CheckCircle size={14} className="text-emerald-400" />
        <p className="text-[12.5px] font-semibold text-white">Your Advisory Summary</p>
      </div>

      {/* Profile summary */}
      <div className="p-4 grid grid-cols-2 gap-2 border-b border-[#EEE9E0]">
        {[
          { icon: "💰", label: "Budget", value: profile.budget ? formatPrice(profile.budget) : "N/A" },
          { icon: "🏠", label: "Purpose", value: profile.purpose || "N/A" },
          { icon: "🏢", label: "Commute", value: profile.office_location || "N/A" },
          { icon: "🏗️", label: "Type", value: profile.property_type || "N/A" },
          { icon: "📦", label: "Possession", value: profile.possession || "Flexible" },
          { icon: "⭐", label: "Priority", value: profile.priority || "N/A" },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="text-sm">{item.icon}</span>
            <div>
              <p className="text-[9.5px] text-[#948d7c] font-semibold uppercase tracking-wider">{item.label}</p>
              <p className="text-[11.5px] font-semibold text-[#0A0A0A]">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended properties */}
      {recommendedProperties.length > 0 && (
        <div className="p-4 space-y-2 border-b border-[#EEE9E0]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#948d7c]">Your Top Matches</p>
          {recommendedProperties.slice(0, 3).map(prop => (
            <Link
              key={prop.id}
              href={`/properties/${prop.slug}`}
              target="_blank"
              className="flex items-center gap-3 p-2.5 bg-[#FAF7F1] rounded-xl border border-[#EEE9E0] hover:border-[#d8d2c6] transition-all group"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-[#0A0A0A] truncate group-hover:text-[#D31E28] transition-colors">{prop.title}</p>
                <p className="text-[9px] text-[#948d7c] font-medium">{prop.location.split(",")[0]} · {prop.possession === "Ready" ? "RTM" : "Ongoing"}</p>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-[10.5px] font-bold text-[#D31E28]">
                  {formatPrice(prop.price)}
                </span>
                <ChevronRight size={10} className="text-[#948d7c] group-hover:text-[#D31E28] transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="p-4 flex gap-2">
        <Link href="/" className="flex-1 py-2.5 text-center text-xs font-semibold border-[1.5px] border-[#d8d2c6] hover:border-[#0A0A0A] text-[#0A0A0A] rounded-[10px] transition-colors">
          Back to Home
        </Link>
        <Link href="/properties" className="flex-1 py-2.5 text-center text-xs font-semibold bg-[#D31E28] hover:bg-[#B8171F] text-white rounded-[10px] transition-colors">
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
      className="w-48 bg-white border border-[#EEE9E0] rounded-2xl overflow-hidden shrink-0 snap-start shadow-[0_1px_3px_rgba(30,25,15,0.04)] hover:shadow-[0_10px_30px_rgba(30,25,15,0.08)] hover:border-[#d8d2c6] transition-all flex flex-col justify-between group cursor-pointer"
    >
      <div className="relative h-28 bg-[#efeae1] overflow-hidden">
        <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Match score badge */}
        {matchScore && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[8px] font-bold flex items-center gap-1">
            <Star size={7} className="fill-white" />{matchScore}% Match
          </div>
        )}
        {/* RTM badge */}
        <div className="absolute top-2 left-2 bg-[#0A0A0A]/80 text-white px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider">
          {prop.possession === "Ready" ? "RTM" : "Ongoing"}
        </div>
        {/* BHK overlay on image bottom */}
        <div className="absolute bottom-2 left-2 text-white text-[9px] font-semibold">
          <span className="bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded">{prop.bhk} · {prop.type}</span>
        </div>
      </div>
      <div className="p-3 space-y-2.5 flex-grow flex flex-col justify-between">
        <div className="space-y-0.5">
          <h4 className="text-[11px] font-bold text-[#0A0A0A] group-hover:text-[#D31E28] transition-colors line-clamp-2 leading-tight">{prop.title}</h4>
          <div className="flex items-center gap-1 text-[#948d7c]">
            <MapPin size={8} />
            <p className="text-[8px] font-semibold uppercase tracking-widest truncate">{prop.location.split(",")[0]}</p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-1.5 border-t border-[#EEE9E0]">
          <span className="text-[12px] font-bold text-[#D31E28]">
            {formatPrice(prop.price)}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#0A0A0A] group-hover:text-[#D31E28] transition-colors flex items-center gap-0.5">
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
          return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
        }
        // Handle markdown-style headers
        if (part.startsWith("# ") || part.startsWith("## ")) {
          return <span key={i} className="block font-bold text-[#0A0A0A] mt-2 mb-0.5">{part.replace(/^#+\s/, "")}</span>;
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
    <div className="font-archivo h-dvh w-full flex flex-col overflow-hidden bg-[#FAF7F1] text-[#0A0A0A]">
      {/* Navbar sits in normal flow; the flex column keeps the chat below it without overflow */}
      <Navbar />

      {/* Main container beneath Navbar */}
      <main className="flex-1 min-h-0 w-full px-4 md:px-6 xl:px-[60px] py-4 overflow-hidden">
        <div className={`${CONTAINER} h-full flex flex-col md:flex-row gap-4`}>

        {/* Left Sidebar */}
        <div className="hidden md:flex w-72 lg:w-80 shrink-0 h-full flex-col bg-white border border-[#EEE9E0] rounded-2xl overflow-hidden">
          {/* Bot identity header */}
          <div className="p-5 pb-4 border-b border-[#EEE9E0] space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F1] border border-[#EEE9E0] flex items-center justify-center text-[#D31E28] shrink-0">
                <Sparkles size={18} className="animate-pulse" />
              </div>
              <div>
                <h2 className="font-semibold text-[#0A0A0A] text-[15px]">{botName}</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Active 24/7 Advisor</span>
                </div>
              </div>
            </div>
            <p className="text-[12px] text-[#57534a] leading-relaxed">
              Senior luxury real estate consultant. Personally advising buyers in Hyderabad since 2018.
            </p>
          </div>

          {/* Discovery Roadmap */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-white">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8A6D2F]">Consultation Roadmap</h3>
            <div className="space-y-2.5">
              {[
                { step: 1, label: "Budget Range" },
                { step: 2, label: "Self-Use or Investment" },
                { step: 3, label: "Office Commute" },
                { step: 4, label: "BHK Preference" },
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
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-bold border transition-all ${
                      isCompleted ? "bg-emerald-500 border-emerald-500 text-white" :
                      isActive ? "bg-[#D31E28] border-[#D31E28] text-white shadow-sm shadow-[#D31E28]/20 animate-pulse" :
                      "border-[#e0d9cb] text-[#948d7c] bg-white"
                    }`}>
                      {isCompleted ? "✓" : s.step}
                    </div>
                    <span className={`text-[11.5px] transition-all ${
                      isCompleted ? "text-[#948d7c] line-through font-medium" :
                      isActive ? "text-[#0A0A0A] font-semibold" : "text-[#948d7c] font-medium"
                    }`}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom trust badges */}
          <div className="p-4 bg-[#0A0A0A] text-white space-y-2">
            <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-wider text-white/90">
              <Award size={12} className="text-[#D31E28]" />
              <span>RERA &amp; GHMC Vetted Listings</span>
            </div>
            <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-wider text-white/90">
              <ShieldCheck size={12} className="text-[#D31E28]" />
              <span>100% Commission-Free Guidance</span>
            </div>
          </div>
        </div>

        {/* Right: Chat Container */}
        <div className="flex-grow h-full min-h-0 flex flex-col bg-white border border-[#EEE9E0] rounded-2xl overflow-hidden">
          {/* Messages */}
          <div className="flex-grow p-4 md:p-5 overflow-y-auto space-y-4 bg-white">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                {/* Message bubble */}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-[#0A0A0A] text-white rounded-br-md font-medium"
                    : "bg-[#FAF7F1] border border-[#EEE9E0] text-[#2b2823] rounded-bl-md"
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
                <div className="w-7 h-7 rounded-lg bg-[#FAF7F1] border border-[#EEE9E0] flex items-center justify-center shrink-0">
                  <Sparkles size={11} className="text-[#D31E28] animate-pulse" />
                </div>
                <div className="bg-[#FAF7F1] border border-[#EEE9E0] rounded-2xl rounded-tl-md px-4 py-3 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#948d7c] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-[#948d7c] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-[#948d7c] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-[10px] font-medium text-[#948d7c] animate-pulse">{TYPING_MESSAGES[typingMsgIdx]}</span>
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
                className="px-4 py-2.5 border-t border-[#EEE9E0] flex gap-2 flex-wrap bg-white"
              >
                {currentChips.map(chip => (
                  <button
                    key={chip}
                    onClick={() => handleChipClick(chip)}
                    className="px-3.5 py-2 bg-white border border-[#d8d2c6] hover:border-[#0A0A0A] text-[#2b2823] text-[11.5px] font-semibold rounded-full transition-colors cursor-pointer whitespace-nowrap active:scale-95 flex items-center gap-1.5"
                  >
                    {getChipIcon(chip)}
                    {chip}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input form */}
          <form onSubmit={handleSend} className="p-3.5 border-t border-[#EEE9E0] bg-white flex items-center gap-2.5 shrink-0">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your response or tap a suggestion above…"
              className="flex-1 bg-white border-[1.5px] border-[#e0d9cb] px-4 py-3 text-[13px] rounded-[10px] focus:outline-none focus:border-[#D31E28] font-medium text-[#0A0A0A] transition-colors placeholder-[#948d7c]"
              disabled={isBotTyping}
            />
            <button
              type="submit"
              disabled={isBotTyping || !chatInput.trim()}
              className="w-11 h-11 rounded-lg bg-[#D31E28] text-white flex items-center justify-center hover:bg-[#B8171F] active:scale-95 transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_4px_14px_rgba(211,30,40,0.25)]"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
        </div>
      </main>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF7F1] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#D31E28] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
