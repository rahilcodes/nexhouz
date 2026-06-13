"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, X, Send, Maximize2, MessageSquare,
  MapPin, Star, User, Phone, Calendar,
  ArrowRight, ShieldCheck, Award, Home,
  Building2, TrendingUp, Layers, RotateCcw, Search
} from "lucide-react";
import { getAdvisorReply, AdvisorState } from "@/lib/chatService";
import { fetchAllProperties } from "@/lib/db";
import { Property } from "@/data/properties";

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
  properties?: Property[];
  type?: "normal" | "lead_capture" | "site_visit" | "summary";
}

// Typing status messages for premium experience
const TYPING_MESSAGES = [
  "Analyzing requirements…",
  "Matching locations…",
  "Checking RERA details…",
  "Calculating yield scores…",
  "Drafting custom recommendation…",
];

// Helper to format currency in INR
function formatINR(price: number): string {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)} Cr`;
  }
  return `₹${(price / 100000).toFixed(0)} L`;
}

export default function FloatingChat() {
  const router = useRouter();
  const pathname = usePathname();

  // Hide the floating widget on chat page and admin panel
  const isHidden = pathname === "/chat" || pathname.startsWith("/admin");

  const [isOpen, setIsOpen] = useState(false);
  const [liveProperties, setLiveProperties] = useState<Property[]>([]);
  const [chatState, setChatState] = useState<AdvisorState>({ step: 1, profile: {} });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [typingMsgIdx, setTypingMsgIdx] = useState(0);
  const [leadCaptureSubmitted, setLeadCaptureSubmitted] = useState(false);
  const [siteVisitSelected, setSiteVisitSelected] = useState(false);
  const [isLeadSubmitting, setIsLeadSubmitting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load properties client-side
  useEffect(() => {
    if (isHidden) return;
    async function load() {
      const props = await fetchAllProperties();
      setLiveProperties(props);
    }
    load();
  }, [isHidden]);

  // Load chat history & state from localStorage
  useEffect(() => {
    if (isHidden) return;
    const storedHistory = localStorage.getItem("nexhouz_chat_history");
    const storedState = localStorage.getItem("nexhouz_chat_state");
    const storedLeadCaptured = localStorage.getItem("nexhouz_lead_captured") === "true";
    const storedSiteVisit = localStorage.getItem("nexhouz_site_visit_selected") === "true";

    if (storedHistory && storedState) {
      try {
        setChatMessages(JSON.parse(storedHistory));
        setChatState(JSON.parse(storedState));
        setLeadCaptureSubmitted(storedLeadCaptured);
        setSiteVisitSelected(storedSiteVisit);
      } catch (e) {
        console.error("Error loading chat history:", e);
      }
    }
  }, [isHidden, isOpen]); // Reload when it opens to sync cross-page updates

  // Sync state back to localStorage
  const saveStateToStorage = (messages: ChatMessage[], state: AdvisorState, leadCap: boolean, visitSel: boolean) => {
    localStorage.setItem("nexhouz_chat_history", JSON.stringify(messages));
    localStorage.setItem("nexhouz_chat_state", JSON.stringify(state));
    localStorage.setItem("nexhouz_lead_captured", leadCap ? "true" : "false");
    localStorage.setItem("nexhouz_site_visit_selected", visitSel ? "true" : "false");
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isBotTyping]);

  // Rotate typing messages
  useEffect(() => {
    if (!isBotTyping) return;
    const interval = setInterval(() => {
      setTypingMsgIdx(i => (i + 1) % TYPING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isBotTyping]);

  if (isHidden) return null;

  // Initialize chat if empty
  const initializeChat = async () => {
    if (chatMessages.length > 0) return;
    setIsBotTyping(true);
    const initialState: AdvisorState = { step: 1, profile: {} };
    try {
      const reply = await getAdvisorReply("", [], liveProperties.length > 0 ? liveProperties : [], initialState);
      const newMsgs: ChatMessage[] = [{ sender: "bot", text: reply.responseText, properties: reply.properties }];
      setChatMessages(newMsgs);
      setChatState(reply.nextState);
      saveStateToStorage(newMsgs, reply.nextState, false, false);
    } catch {
      const newMsgs: ChatMessage[] = [{ sender: "bot", text: "Welcome to **NexHouz Elite Property Advisory**. I am your digital luxury real estate consultant.\n\nTo help shortlist the absolute best property fits for you in Hyderabad, may I know roughly what **budget range** you are considering?" }];
      setChatMessages(newMsgs);
      setChatState({ step: 1, profile: {} });
      saveStateToStorage(newMsgs, { step: 1, profile: {} }, false, false);
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      initializeChat();
    }
  };

  const handleSend = async (e?: React.FormEvent, directText?: string) => {
    if (e) e.preventDefault();
    const userMsg = (directText || chatInput).trim();
    if (!userMsg || isBotTyping) return;

    const historyBefore = chatMessages.map(m => ({ sender: m.sender, text: m.text }));
    const newMsgs = [...chatMessages, { sender: "user" as const, text: userMsg }];
    setChatMessages(newMsgs);
    setChatInput("");
    setIsBotTyping(true);

    try {
      const reply = await getAdvisorReply(userMsg, historyBefore, liveProperties, chatState);

      const nextStep = reply.nextState.step;
      const lowerResponse = reply.responseText.toLowerCase();
      const hasRecommendations = (reply.properties && reply.properties.length > 0) || chatMessages.some(m => m.properties && m.properties.length > 0);

      // Detect special message types
      const isLeadCapture = !leadCaptureSubmitted && hasRecommendations && (
        nextStep === 9 || lowerResponse.includes("whatsapp number") || lowerResponse.includes("send them to")
      );

      const isSiteVisit = !siteVisitSelected && leadCaptureSubmitted && (
        nextStep === 11 || (lowerResponse.includes("site visit") && lowerResponse.includes("weekend"))
      );

      const isConversationEnd = !isSiteVisit && nextStep >= 12;

      const updatedMsgs = [...newMsgs, {
        sender: "bot" as const,
        text: reply.responseText,
        properties: reply.properties,
        type: isLeadCapture ? ("lead_capture" as const) : isSiteVisit ? ("site_visit" as const) : isConversationEnd ? ("summary" as const) : ("normal" as const)
      }];

      setChatMessages(updatedMsgs);
      setChatState(reply.nextState);
      saveStateToStorage(updatedMsgs, reply.nextState, leadCaptureSubmitted, siteVisitSelected);
    } catch {
      setChatMessages(prev => [...prev, { sender: "bot", text: "I apologize — please repeat that. I want to make sure I fully understand your requirements." }]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleChipClick = (chip: string) => {
    const cleaned = chip.replace(/[\u{1F300}-\u{1F9FF}]/gu, "").replace(/[🏠📈🏢🏗️📦⭐📅🗓️🙅🔧]/g, "").trim();
    handleSend(undefined, cleaned);
  };

  const handleLeadSubmit = async (name: string, phone: string) => {
    setIsLeadSubmitting(true);
    setLeadCaptureSubmitted(true);
    localStorage.setItem("nexhouz_lead_captured", "true");
    const combinedMsg = `My name is ${name} and my WhatsApp number is ${phone}`;
    await handleSend(undefined, combinedMsg);
    setIsLeadSubmitting(false);
  };

  const handleSiteVisitSelect = (option: string) => {
    setSiteVisitSelected(true);
    localStorage.setItem("nexhouz_site_visit_selected", "true");
    handleSend(undefined, option);
  };

  const handleFullscreen = () => {
    router.push("/chat");
    setIsOpen(false);
  };

  // Active steps roadmap chips fallback
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
  const getChipIcon = (text: string) => {
    const clean = text.toLowerCase().trim();
    if (clean.includes("self use")) return <Home size={10} className="text-gray-400" />;
    if (clean.includes("investment")) return <TrendingUp size={10} className="text-gray-400" />;
    if (clean.includes("apartment")) return <Building2 size={10} className="text-gray-400" />;
    if (clean.includes("villa")) return <Home size={10} className="text-gray-400" />;
    if (clean.includes("penthouse")) return <Layers size={10} className="text-gray-400" />;
    if (clean.includes("start over")) return <RotateCcw size={10} className="text-gray-400" />;
    if (clean.includes("browse")) return <Search size={10} className="text-gray-400" />;
    if (clean.includes("call")) return <Phone size={10} className="text-gray-400" />;
    return null;
  };

  const currentChips = STEP_CHIPS[chatState.step] || [];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* ─── CHAT CONSOLE PANEL ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-[360px] md:w-[380px] h-[520px] bg-white border border-gray-150 rounded-3xl shadow-luxury-hover overflow-hidden flex flex-col mb-4"
            style={{ boxShadow: "0 24px 60px -15px rgba(0, 0, 0, 0.12)" }}
          >
            {/* Header */}
            <div className="bg-brand-black text-white px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-red flex items-center justify-center text-white relative">
                  <Sparkles size={14} className="animate-pulse" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-brand-black" />
                </div>
                <div>
                  <h3 className="text-xs font-black tracking-tight leading-none text-white">NexHouz AI Advisor</h3>
                  <span className="text-[8px] font-bold tracking-widest uppercase text-emerald-400 mt-1 block">Active Consultation</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleFullscreen}
                  title="Expand to Fullscreen"
                  className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <Maximize2 size={13} />
                </button>
                <button
                  onClick={handleToggle}
                  title="Minimize Advisor"
                  className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gray-50/50">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line shadow-sm ${
                    msg.sender === "user"
                      ? "bg-brand-red text-white rounded-tr-sm font-semibold"
                      : "bg-white border border-gray-100 text-brand-black rounded-tl-sm font-medium"
                  }`}>
                    {/* Render message with basic bold markdown support */}
                    {msg.text.split(/(\*\*[^*]+\*\*)/g).map((part, pi) => {
                      if (part.startsWith("**") && part.endsWith("**")) {
                        return <strong key={pi} className="font-extrabold">{part.slice(2, -2)}</strong>;
                      }
                      return <span key={pi}>{part}</span>;
                    })}
                  </div>

                  {/* Render special child components */}
                  {msg.sender === "bot" && (
                    <>
                      {/* Property Matched Slider */}
                      {msg.properties && msg.properties.length > 0 && (
                        <div className="mt-2.5 w-full flex gap-2.5 overflow-x-auto pb-1.5 snap-x no-scrollbar" style={{ scrollbarWidth: "none" }}>
                          {msg.properties.map((prop, pi) => (
                            <a
                              key={prop.id}
                              href={`/properties/${prop.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-40 bg-white border rounded-xl overflow-hidden shrink-0 snap-start shadow-sm hover:border-brand-red/35 transition-all group flex flex-col justify-between"
                            >
                              <div className="h-20 overflow-hidden relative">
                                <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
                                <div className="absolute top-1 right-1 bg-emerald-500 text-white px-1.5 py-0.5 rounded-full text-[7px] font-black">
                                  {95 - pi * 5}% Match
                                </div>
                              </div>
                              <div className="p-2 space-y-1">
                                <h4 className="text-[10px] font-black text-brand-black line-clamp-1 group-hover:text-brand-red leading-tight">{prop.title}</h4>
                                <div className="flex items-center justify-between text-[9px] font-bold text-gray-400">
                                  <span>{prop.bhk} BHK</span>
                                  <span className="text-brand-red font-black">{formatINR(prop.price)}</span>
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Lead Form */}
                      {msg.type === "lead_capture" && !leadCaptureSubmitted && i === chatMessages.length - 1 && (
                        <div className="w-full bg-white border border-brand-red/10 rounded-2xl p-3.5 shadow-md mt-2 space-y-2.5">
                          <p className="text-[10px] font-black uppercase text-brand-black tracking-wide flex items-center gap-1.5">
                            <Sparkles size={11} className="text-brand-red" /> Unlock Premium Details
                          </p>
                          <LeadMiniForm onSubmit={handleLeadSubmit} isSubmitting={isLeadSubmitting} />
                        </div>
                      )}

                      {/* Site Visit Picker */}
                      {msg.type === "site_visit" && !siteVisitSelected && i === chatMessages.length - 1 && (
                        <div className="w-full bg-white border rounded-2xl p-3.5 shadow-md mt-2 space-y-2">
                          <p className="text-[10px] font-black uppercase text-brand-black tracking-wide">Schedule Free Site Tour</p>
                          <div className="grid grid-cols-2 gap-2">
                            {["This Weekend", "Next Weekend", "Custom Date", "Skip"].map(o => (
                              <button
                                key={o}
                                onClick={() => handleSiteVisitSelect(o)}
                                className="p-2 bg-gray-50 border hover:border-brand-red hover:bg-brand-red/5 rounded-xl text-[10px] font-extrabold text-brand-black text-center cursor-pointer transition-colors"
                              >
                                {o}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isBotTyping && (
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-lg bg-brand-red/5 border flex items-center justify-center shrink-0">
                    <Sparkles size={10} className="text-brand-red animate-pulse" />
                  </div>
                  <div className="bg-white border rounded-xl rounded-tl-sm px-3 py-2 flex flex-col gap-1 shadow-sm">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-[8px] font-semibold text-gray-400 animate-pulse">{TYPING_MESSAGES[typingMsgIdx]}</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chips footer */}
            {currentChips.length > 0 && !isBotTyping && (
              <div className="px-4 py-2 border-t border-gray-50 bg-gray-50/50 flex gap-1.5 overflow-x-auto shrink-0 no-scrollbar" style={{ scrollbarWidth: "none" }}>
                {currentChips.map(c => (
                  <button
                    key={c}
                    onClick={() => handleChipClick(c)}
                    className="px-2.5 py-1 bg-white border border-gray-200 text-gray-600 text-[9px] font-black uppercase rounded-full hover:border-brand-red hover:text-brand-red cursor-pointer transition-all shrink-0 hover:shadow-sm flex items-center gap-1"
                  >
                    {getChipIcon(c)}
                    {c}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 border-t border-gray-150 bg-white flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Reply here..."
                disabled={isBotTyping}
                className="flex-1 bg-gray-50 border border-gray-200 px-3.5 py-2.5 text-xs rounded-full focus:outline-none focus:border-brand-red font-semibold transition-all"
              />
              <button
                type="submit"
                disabled={isBotTyping || !chatInput.trim()}
                className="w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center hover:bg-brand-red/90 disabled:opacity-40 transition-colors cursor-pointer shrink-0"
              >
                <Send size={12} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── FLOATING ACTION TRIGGER BUTTON ─── */}
      <button
        onClick={handleToggle}
        className="w-14 h-14 rounded-full bg-brand-red hover:bg-brand-red-hover text-white flex items-center justify-center shadow-lg relative group transition-all duration-300 transform active:scale-95 cursor-pointer"
        style={{
          boxShadow: "0 8px 30px rgba(211, 30, 40, 0.4)",
          backgroundImage: "linear-gradient(135deg, #D31E28 0%, #A8121A 100%)"
        }}
      >
        <div className="absolute inset-0 rounded-full bg-brand-red/20 opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-500" />
        {isOpen ? (
          <X size={20} className="transform rotate-0 scale-100 transition-all duration-300" />
        ) : (
          <MessageSquare size={20} className="transform rotate-0 scale-100 transition-all duration-300 animate-pulse" />
        )}
      </button>

    </div>
  );
}

// Mini lead collection form inside floating bubble
function LeadMiniForm({ onSubmit, isSubmitting }: {
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
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="relative">
        <User size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full pl-7 pr-3 py-1.5 text-[11px] border border-gray-200 rounded-lg outline-none focus:border-brand-red font-semibold bg-gray-50"
        />
      </div>
      <div className="relative">
        <Phone size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="tel"
          placeholder="WhatsApp Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          className="w-full pl-7 pr-3 py-1.5 text-[11px] border border-gray-200 rounded-lg outline-none focus:border-brand-red font-semibold bg-gray-50"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !name.trim() || phone.trim().length < 10}
        className="w-full py-2 bg-brand-black text-white text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-gray-800 disabled:opacity-40 transition-colors cursor-pointer"
      >
        {isSubmitting ? "Sending..." : "Unlock Brocures & Pricing"}
      </button>
    </form>
  );
}
