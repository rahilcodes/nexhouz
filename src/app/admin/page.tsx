"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { fetchAllProperties, saveProperty, deleteProperty, fetchLeads, updateLeadStatus, fetchAiCrmLeads, saveSiteVisit } from "@/lib/db";
import { Property, FloorPlan } from "@/data/properties";
import {
  LayoutDashboard, List, Plus, LogOut, Eye, EyeOff,
  Pencil, Trash2, Star, Search, X, Check,
  Building, Home, MapPin, ChevronDown, AlertTriangle,
  Package, Save, ArrowLeft, ArrowRight, Building2, Moon, Sun,
  Layers, Ruler, Calendar, ShieldCheck, Mail, Phone, ExternalLink, Clock,
  ChevronUp, Grid3X3, Image as ImageIcon, Sparkles, SlidersHorizontal,
  Database, RefreshCw, BrainCircuit
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { formatINR, DEFAULT_SYSTEM_PROMPT } from "@/lib/chatService";

// Predefined icons list matching amenities categories
const CATEGORIZED_AMENITIES = {
  "Lifestyle & Clubhouse Amenities": [
    "Grand Clubhouse",
    "Multipurpose Hall",
    "Banquet Hall",
    "Mini Theatre",
    "Indoor Games Room",
    "Library & Reading Lounge",
    "Co-working Spaces",
    "Café & Lounge Areas",
    "Amphitheatre",
    "Party Lawn & BBQ Deck"
  ],
  "Sports Amenities": [
    "Cricket Practice Net",
    "Tennis Court",
    "Badminton Court",
    "Basketball Court",
    "Volleyball Court",
    "Squash Court",
    "Table Tennis",
    "Billiards",
    "Skating Rink",
    "Mini Football Turf"
  ],
  "Wellness & Fitness": [
    "Gymnasium",
    "Yoga & Meditation Deck",
    "Jogging Track",
    "Cycling Track",
    "Outdoor Fitness Zone",
    "Swimming Pool",
    "Kids Pool",
    "Lap Pool",
    "Spa & Sauna",
    "Reflexology Pathway"
  ],
  "Children's Amenities": [
    "Children's Play Area",
    "Toddler Zone",
    "Indoor Activity Room",
    "Learning & Hobby Spaces",
    "Sand Pit",
    "Adventure Play Area"
  ],
  "Green & Open Spaces": [
    "Landscaped Gardens",
    "Central Park",
    "Walking Trails",
    "Pet Park",
    "Water Features",
    "Forest Theme Zones",
    "Open-Air Seating Areas"
  ],
  "Convenience Amenities": [
    "Convenience Store",
    "Pharmacy",
    "ATM",
    "Guest Rooms",
    "Business Centre",
    "EV Charging Stations",
    "Visitor Parking",
    "Car Wash Area"
  ],
  "Safety & Security": [
    "24/7 Security",
    "CCTV Surveillance",
    "Video Door Phone",
    "Biometric Access",
    "Fire Safety Systems",
    "Power Backup",
    "Gated Community Access Control"
  ]
};

const DEFAULT_NEARBY = { hospitals: 12, malls: 6, schools: 10, restaurants: 15, metroStations: 2, railwayStations: 1, itParks: 4 };
const DEFAULT_AQI = { score: 64, dominantPollutant: "PM2.5", pm25: 16.5, pm10: 22.1, o3: 65, no2: 28.5, so2: 4.8, co: 512 };

const EMPTY_FORM = {
  id: "" as string | undefined,
  title: "", slug: "", location: "Kokapet, Hyderabad", price: 15000000,
  projectName: "",
  type: "Apartment" as const, bhk: 3, area: "2,000 sq ft", possession: "Ready" as const,
  investmentType: "Capital Appreciation" as const, description: "",
  architect: "", amenities: [] as string[], image: "/images/hero_modernist_villa.png",
  images: ["/images/hero_modernist_villa.png"] as string[],
  scores: { architecturalIntegrity: 90, investmentYield: 8.0, spatialEfficiency: 90, automationTier: "Tier 2 (Pro)" as const },
  featured: false,
  reraNumber: "",
  possessionDate: "",
  udsPerAcre: 100,
  brochureUrl: "",
  nearby: { ...DEFAULT_NEARBY },
  aqi: { ...DEFAULT_AQI },
  floorPlans: [] as FloorPlan[],
  recommendationReport: {
    investmentPotential: 8,
    familyFriendliness: 8,
    commuteConvenience: 9,
    schoolAccess: 8,
    hospitalAccess: 7,
    futureAppreciation: 9,
    builderTrustRating: 9,
    whyRecommended: ""
  }
};

type View = "dashboard" | "listings" | "add" | "edit" | "leads" | "ai_crm" | "ai_brain";
interface Toast { message: string; type: "success" | "error"; }

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [dark, setDark] = useState(false);
  const [view, setView] = useState<View>("dashboard");
  const [listings, setListings] = useState<Property[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [editingProperty, setEditingProperty] = useState<any | null>(null);

  // AI CRM States
  const [aiLeads, setAiLeads] = useState<any[]>([]);
  const [selectedAiLead, setSelectedAiLead] = useState<any | null>(null);
  const [isAiCrmLoading, setIsAiCrmLoading] = useState(false);
  const [aiCrmError, setAiCrmError] = useState<string | null>(null);
  const [isMigrationRequired, setIsMigrationRequired] = useState(false);
  
  // Login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Toast notifications
  const [toast, setToast] = useState<Toast | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // Filtering listings
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterPossession, setFilterPossession] = useState("All");

  // Shopify-Style Wizard Steps State
  const [wizardStep, setWizardStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageInput, setImageInput] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [amenityInput, setAmenityInput] = useState("");

  const [dbError, setDbError] = useState<string | null>(null);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [dbStatus, setDbStatus] = useState<"connecting" | "success" | "error">("connecting");
  const [showDiagModal, setShowDiagModal] = useState(false);
  const [diagInfo, setDiagInfo] = useState<any>(null);

  const [dbPropertiesCount, setDbPropertiesCount] = useState<number | null>(null);
  const [dbBuildersCount, setDbBuildersCount] = useState<number | null>(null);
  const [dbProjectsCount, setDbProjectsCount] = useState<number | null>(null);
  const [dbLeadsCount, setDbLeadsCount] = useState<number | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>("Never");
  const [isSyncing, setIsSyncing] = useState(false);

  // AI Brain state — pre-filled with the default prompt
  const [advisorPrompt, setAdvisorPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [businessMemory, setBusinessMemory] = useState("");
  const [promptSaved, setPromptSaved] = useState(false);
  const [memorySaved, setMemorySaved] = useState(false);

  // Load saved AI Brain config from localStorage when opening the view
  useEffect(() => {
    if (view === "ai_brain" && typeof window !== "undefined") {
      const savedPrompt = localStorage.getItem("nexhouz_advisor_prompt");
      const savedMemory = localStorage.getItem("nexhouz_business_memory");
      // Use saved prompt if exists, otherwise keep the default already in state
      if (savedPrompt && savedPrompt.trim().length > 100) setAdvisorPrompt(savedPrompt);
      if (savedMemory) setBusinessMemory(savedMemory);
    }
  }, [view]);

  async function fetchHealthMetrics() {
    setIsSyncing(true);
    try {
      const [propRes, builderRes, projRes, leadRes] = await Promise.all([
        supabase.from("properties").select("*", { count: "exact", head: true }),
        supabase.from("builders").select("*", { count: "exact", head: true }),
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("leads").select("*", { count: "exact", head: true })
      ]);
      
      setDbPropertiesCount(propRes.count ?? 0);
      setDbBuildersCount(builderRes.count ?? 0);
      setDbProjectsCount(projRes.count ?? 0);
      setDbLeadsCount(leadRes.count ?? 0);
      setLastSyncTime(new Date().toLocaleTimeString());
    } catch (e) {
      console.error("Exception fetching health metrics:", e);
    } finally {
      setIsSyncing(false);
    }
  }

  const showToast = (message: string, type: "success" | "error") => setToast({ message, type });

  useEffect(() => {
    const isDev = process.env.NODE_ENV === "development";
    const params = new URLSearchParams(window.location.search);
    const hasDebug = params.get("debug") === "true";
    
    if (isDev || hasDebug) {
      setIsDebugMode(true);
    }
  }, []);

  async function checkDbConnection() {
    setDbStatus("connecting");
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const host = url ? new URL(url).hostname : "None";
      const keyDefined = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      const info = {
        urlHost: host,
        urlDefined: !!url,
        keyDefined,
        queryStatus: "Pending",
        error: ""
      };

      const { data, error } = await supabase.from("properties").select("id").limit(1);
      if (error) {
        info.queryStatus = error.code;
        info.error = error.message;
        setDbStatus("error");
        setDbError(`Supabase connection failed: ${error.message} (Code: ${error.code})`);
      } else {
        info.queryStatus = "200 OK";
        setDbStatus("success");
        setDbError(null);
      }
      setDiagInfo(info);
    } catch (e: any) {
      setDbStatus("error");
      setDbError(`Connection failed: ${e.message || String(e)}`);
      setDiagInfo({
        urlHost: "Unknown",
        urlDefined: false,
        keyDefined: false,
        queryStatus: "Failed",
        error: e.message || String(e)
      });
    }
  }

  // Check Supabase session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoggedIn(!!session);
      setIsCheckingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoggedIn(!!session);
    });

    checkDbConnection();

    return () => subscription.unsubscribe();
  }, []);

  // Fetch properties and leads when logged in
  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  async function loadData() {
    setDbError(null);
    setDbStatus("connecting");
    try {
      const props = await fetchAllProperties();
      setListings(props);
      const leadsData = await fetchLeads();
      setLeads(leadsData);

      // Load AI CRM Leads
      try {
        setAiCrmError(null);
        setIsMigrationRequired(false);
        const aiLeadsData = await fetchAiCrmLeads();
        if (aiLeadsData === null) {
          setIsMigrationRequired(true);
          setAiLeads([]);
        } else {
          setAiLeads(aiLeadsData);
        }
      } catch (e: any) {
        console.warn("AI CRM table missing or error:", e);
        setAiCrmError(e.message || String(e));
        setIsMigrationRequired(true);
        setAiLeads([]);
      }
      
      fetchHealthMetrics();
      
      const { error } = await supabase.from("properties").select("id").limit(1);
      if (error) {
        setDbStatus("error");
        setDbError(`Supabase connection failed: ${error.message} (Code: ${error.code})`);
        if (diagInfo) {
          setDiagInfo({
            ...diagInfo,
            queryStatus: error.code,
            error: error.message
          });
        }
      } else {
        setDbStatus("success");
        setDbError(null);
        if (diagInfo) {
          setDiagInfo({
            ...diagInfo,
            queryStatus: "200 OK",
            error: ""
          });
        }
      }
    } catch (e: any) {
      setDbStatus("error");
      setDbError(`Connection failure: ${e.message || String(e)}`);
      if (diagInfo) {
        setDiagInfo({
          ...diagInfo,
          queryStatus: "Failed",
          error: e.message || String(e)
        });
      }
    }
  }

  // Upload image file to Supabase Storage and return public URL
  async function uploadImageToSupabase(file: File): Promise<string | null> {
    setIsUploadingImage(true);
    setUploadError(null);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `property-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage
        .from("nexhouz-images")
        .upload(fileName, file, { contentType: file.type, upsert: false });

      if (error) {
        setUploadError(`Upload failed: ${error.message}`);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from("nexhouz-images")
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (e: any) {
      setUploadError(`Upload error: ${e.message}`);
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function handleImageFileSelect(files: FileList | null) {
    if (!files || files.length === 0) return;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const url = await uploadImageToSupabase(file);
      if (url) {
        setForm(f => {
          const newImages = [...f.images, url];
          return { ...f, images: newImages, image: f.images.length === 0 ? url : f.image };
        });
      }
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoginError(error.message);
    } else {
      showToast("Logged in successfully!", "success");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setView("dashboard");
  };

  const handleSaveListing = async () => {
    if (!form.title.trim()) {
      showToast("Title is required (Step 2)", "error");
      setWizardStep(2);
      return;
    }
    if (!form.description.trim()) {
      showToast("Description is required (Step 2)", "error");
      setWizardStep(2);
      return;
    }

    const result = await saveProperty(form);
    if (result.success) {
      showToast(form.id ? "Property updated successfully!" : "New property published!", "success");
      loadData();
      setView("listings");
      setForm(EMPTY_FORM);
    } else {
      showToast(`Database synchronization failed: ${result.error || "Unknown Error"}`, "error");
    }
  };

  const handleDeleteListing = async (id: string) => {
    const success = await deleteProperty(id);
    if (success) {
      showToast("Property removed from catalog.", "success");
      loadData();
      setDeleteConfirmId(null);
    } else {
      showToast("Error deleting property.", "error");
    }
  };

  const handleToggleFeatured = async (prop: Property) => {
    const result = await saveProperty({ ...prop, featured: !prop.featured });
    if (result.success) {
      showToast("Featured status toggled.", "success");
      loadData();
    } else {
      showToast(`Error updating featured status: ${result.error || "Unknown Error"}`, "error");
    }
  };

  const handleLeadStatusChange = async (leadId: string, status: string) => {
    const success = await updateLeadStatus(leadId, status);
    if (success) {
      showToast(`Lead marked as ${status}.`, "success");
      loadData();
    }
  };

  // Form handlers
  const setField = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const setReport = (k: string, v: any) => setForm(f => ({ ...f, recommendationReport: { ...f.recommendationReport, [k]: v } }));
  const setNearby = (k: string, v: any) => setForm(f => ({ ...f, nearby: { ...f.nearby, [k]: v } }));
  const setAqi = (k: string, v: any) => setForm(f => ({ ...f, aqi: { ...f.aqi, [k]: v } }));

  const startEdit = (p: any) => {
    setForm({
      ...EMPTY_FORM,
      ...p,
      recommendationReport: p.recommendationReport || { ...EMPTY_FORM.recommendationReport }
    });
    setEditingProperty(p);
    setWizardStep(1);
    setView("edit");
  };

  const startAdd = () => {
    setForm(EMPTY_FORM);
    setEditingProperty(null);
    setWizardStep(1);
    setView("add");
  };

  // Filter listings
  const filteredListings = listings.filter(l => {
    const q = searchQuery.toLowerCase();
    return (l.title.toLowerCase().includes(q) || l.location.toLowerCase().includes(q))
      && (filterType === "All" || l.type === filterType)
      && (filterPossession === "All" || l.possession === filterPossession);
  });

  // Theme configuration
  const theme = {
    page: dark ? "#0a0a0f" : "#f3f4f6",
    sidebar: dark ? "#0d0d14" : "#ffffff",
    card: dark ? "#13131a" : "#ffffff",
    text: dark ? "#ffffff" : "#111827",
    textSub: dark ? "rgba(255,255,255,0.6)" : "#4b5563",
    border: dark ? "rgba(255,255,255,0.07)" : "#e5e7eb",
    input: dark ? "#0a0a0f" : "#f9fafb",
    rowHover: dark ? "rgba(255,255,255,0.02)" : "#f9fafb"
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-red-50 border border-brand-red/10 rounded-2xl flex items-center justify-center mx-auto">
              <Building2 size={24} className="text-brand-red" />
            </div>
            <h1 className="text-2xl font-extrabold text-brand-black tracking-tight">NexHouz Admin</h1>
            <p className="text-xs text-gray-400 font-medium">Verify credentials to manage properties and leads</p>
          </div>

          {dbError && (
            <div className="bg-red-50 border border-red-200 text-red-650 text-xs font-semibold p-4 rounded-xl flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="shrink-0 text-red-600" />
                <span className="font-bold text-red-950">Supabase Connection Error</span>
              </div>
              <p className="text-[11px] text-red-700 leading-relaxed font-medium">
                {dbError}
              </p>
              {isDebugMode && (
                <button
                  type="button"
                  onClick={() => setShowDiagModal(true)}
                  className="mt-1 w-full py-1.5 bg-red-100 hover:bg-red-200 text-red-900 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  View Diagnostics
                </button>
              )}
            </div>
          )}

          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold p-4 rounded-xl flex items-center gap-2">
              <AlertTriangle size={14} className="shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
              <input
                type="email" required autoFocus
                className="w-full bg-gray-50 border border-gray-200 focus:border-brand-red rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition-colors"
                placeholder="admin@nexhouz.com" value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} required
                  className="w-full bg-gray-50 border border-gray-200 focus:border-brand-red rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition-colors"
                  placeholder="••••••••••••" value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-brand-red hover:bg-brand-red/90 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-brand-red/10 cursor-pointer">
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-sans" style={{ background: theme.page, color: theme.text }}>
      
      {toast && <ToastBanner toast={toast} onClose={() => setToast(null)} />}

      {/* ─── SIDEBAR ─── */}
      <aside className="w-64 border-r flex flex-col shrink-0" style={{ background: theme.sidebar, borderColor: theme.border }}>
        <div className="p-6 border-b" style={{ borderColor: theme.border }}>
          <div className="flex items-center gap-2.5">
            <Building2 size={20} className="text-brand-red" />
            <span className="text-base font-black tracking-tight">NexHouz Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "listings", label: "All Properties", icon: List },
            { id: "leads", label: "Inquiries & Leads", icon: Mail, badge: leads.filter(l => l.status === "new").length },
            { id: "ai_crm", label: "AI Advisor CRM", icon: BrainCircuit },
            { id: "ai_brain", label: "AI Brain Config", icon: Sparkles }
          ].map(item => {
            const Icon = item.icon;
            const active = view === item.id || (item.id === "listings" && (view === "add" || view === "edit"));
            return (
              <button
                key={item.id} onClick={() => setView(item.id as View)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wide cursor-pointer transition-all ${
                  active ? "bg-brand-red text-white" : "text-gray-500 hover:bg-gray-150"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 && (
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${active ? "bg-white text-brand-red" : "bg-brand-red text-white"}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: theme.border }}>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-red-500 hover:bg-red-50 rounded-xl cursor-pointer transition-colors">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* TOP BAR */}
        <header className="h-16 border-b flex items-center justify-between px-8" style={{ background: theme.sidebar, borderColor: theme.border }}>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">
            {view === "dashboard" && "Dashboard Overview"}
            {view === "listings" && "Property Catalog"}
            {view === "add" && "Publish New Estate"}
            {view === "edit" && `Modify: ${form.title}`}
            {view === "leads" && "Acquisition Inquiries"}
            {view === "ai_crm" && "AI Advisor CRM"}
            {view === "ai_brain" && "AI Brain Configuration"}
          </h2>
          <div className="flex items-center gap-4">
            {isDebugMode && (
              <button
                onClick={() => setShowDiagModal(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gray-50 border border-gray-150 text-[10px] font-extrabold uppercase tracking-wider transition-all hover:bg-gray-100 cursor-pointer shadow-sm relative group"
              >
                <span className={`w-2 h-2 rounded-full relative flex`}>
                  {dbStatus === "connecting" && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  )}
                  {dbStatus === "success" && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500"></span>
                  )}
                  {dbStatus === "error" && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    dbStatus === "connecting" ? "bg-amber-500" :
                    dbStatus === "success" ? "bg-emerald-500" : "bg-red-500"
                  }`}></span>
                </span>
                <span className="text-gray-600">DB Status</span>
              </button>
            )}
            <div className="text-right">
              <p className="text-xs font-bold text-gray-900">{session?.user?.email}</p>
              <p className="text-xs text-gray-400 font-semibold uppercase mt-0.5">Administrator</p>
            </div>
          </div>
        </header>

        {/* PAGE VIEWS */}
        <div className="flex-1 overflow-y-auto p-8">
          {dbError && (
            <div className="mb-8 border border-red-200 bg-red-50/50 rounded-3xl py-6 px-8 flex items-center gap-4 shadow-sm w-full">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0 shadow-inner">
                <AlertTriangle size={20} className="stroke-[2]" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-extrabold text-red-950">Supabase Connection Failure</h3>
                <p className="text-xs text-red-750 font-medium mt-0.5 leading-relaxed">
                  {dbError}
                </p>
              </div>
              {isDebugMode && (
                <button
                  onClick={() => setShowDiagModal(true)}
                  className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-900 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Diagnostics
                </button>
              )}
            </div>
          )}
          
          {/* VIEW: DASHBOARD */}
          {view === "dashboard" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <StatCard icon={Building} label="Total Listings" value={listings.length} color="#3b82f6" dark={dark} />
                <StatCard icon={Star} label="Featured Est." value={listings.filter(l => l.featured).length} color="#eab308" dark={dark} />
                <StatCard icon={Check} label="Ready to Move" value={listings.filter(l => l.possession === "Ready").length} color="#10b981" dark={dark} />
                <StatCard icon={Clock} label="Under Construction" value={listings.filter(l => l.possession === "Under Construction").length} color="#ef4444" dark={dark} />
              </div>

              {/* Lead & Database Health Widgets Side-by-Side */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Columns: Recent Inquiries */}
                <div className="lg:col-span-2 bg-white rounded-3xl border p-6 space-y-4" style={{ borderColor: theme.border }}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-brand-black">Recent submitted inquiries</h3>
                    <button onClick={() => setView("leads")} className="text-xs font-bold text-brand-red hover:underline">View All Leads</button>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {leads.slice(0, 4).map(lead => (
                      <div key={lead.id} className="py-3.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-extrabold text-gray-900">{lead.name}</p>
                          <p className="text-gray-400 font-medium mt-0.5">{lead.phone} · {lead.email}</p>
                        </div>
                        <span className={`text-xs font-black uppercase px-2 py-0.5 rounded-full ${
                          lead.status === "new" ? "bg-red-50 text-brand-red border border-red-100" : "bg-gray-100 text-gray-500"
                        }`}>
                          {lead.status}
                        </span>
                      </div>
                    ))}
                    {leads.length === 0 && (
                      <p className="text-xs text-gray-400 py-4 text-center">No leads captured yet.</p>
                    )}
                  </div>
                </div>

                {/* Right Column: Database Health Widget */}
                <div className="bg-white rounded-3xl border p-6 space-y-5 flex flex-col justify-between" style={{ borderColor: theme.border }}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Database className="text-brand-red" size={16} />
                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-black">Database Health</h3>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        dbStatus === "success" 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                          : "bg-red-50 text-red-600 border-red-100"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dbStatus === "success" ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}></span>
                        {dbStatus === "success" ? "Connected" : "Disconnected"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                      <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl">
                        <p className="text-gray-400 uppercase tracking-widest text-[9px] font-bold">Listings</p>
                        <p className="text-lg font-black text-gray-900 mt-1">{dbPropertiesCount !== null ? dbPropertiesCount : "—"}</p>
                      </div>
                      <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl">
                        <p className="text-gray-400 uppercase tracking-widest text-[9px] font-bold">Builders</p>
                        <p className="text-lg font-black text-gray-900 mt-1">{dbBuildersCount !== null ? dbBuildersCount : "—"}</p>
                      </div>
                      <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl">
                        <p className="text-gray-400 uppercase tracking-widest text-[9px] font-bold">Projects</p>
                        <p className="text-lg font-black text-gray-900 mt-1">{dbProjectsCount !== null ? dbProjectsCount : "—"}</p>
                      </div>
                      <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl">
                        <p className="text-gray-400 uppercase tracking-widest text-[9px] font-bold">Leads</p>
                        <p className="text-lg font-black text-gray-900 mt-1">{dbLeadsCount !== null ? dbLeadsCount : "—"}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 space-y-2.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      <div className="flex justify-between">
                        <span>Environment</span>
                        <span className="text-gray-700 font-extrabold uppercase">{process.env.NODE_ENV}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Build Time</span>
                        <span className="text-gray-750 font-mono font-extrabold tracking-normal normal-case truncate max-w-[150px]" title={process.env.NEXT_PUBLIC_BUILD_TIMESTAMP || "N/A"}>
                          {process.env.NEXT_PUBLIC_BUILD_TIMESTAMP ? (process.env.NEXT_PUBLIC_BUILD_TIMESTAMP).substring(0, 19).replace("T", " ") : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Sync Time</span>
                        <span className="text-gray-700 font-extrabold">{lastSyncTime}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={fetchHealthMetrics}
                    disabled={isSyncing}
                    className="w-full mt-2 py-2 border border-gray-200 hover:border-brand-red/20 hover:bg-brand-red/3 text-brand-black hover:text-brand-red text-[10px] font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw size={10} className={isSyncing ? "animate-spin" : ""} />
                    <span>{isSyncing ? "Syncing..." : "Sync Diagnostics"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: LISTINGS */}
          {view === "listings" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 max-w-md">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                      type="text" placeholder="Search catalog..."
                      className="w-full bg-white border rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold outline-none focus:border-brand-red"
                      value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={startAdd} className="px-5 py-2.5 bg-brand-red hover:bg-brand-red/90 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-md shadow-brand-red/10 cursor-pointer">
                    <Plus size={15} /> Publish Estate
                  </button>
                </div>
              </div>

              {/* TABLE */}
              <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-150 text-xs font-extrabold uppercase tracking-wider text-gray-400">
                      <th className="px-6 py-4">Estate</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Config</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Featured</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {filteredListings.map(listing => (
                      <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={listing.image} className="w-10 h-10 object-cover rounded-lg shrink-0 border" />
                            <div>
                              <p className="font-extrabold text-gray-900 leading-tight">{listing.title}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{listing.type} · {listing.area}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-600">{listing.location}</td>
                        <td className="px-6 py-4 font-extrabold text-gray-700">{listing.bhk} BHK</td>
                        <td className="px-6 py-4 font-black text-brand-red">₹{(listing.price / 10000000).toFixed(2)} Cr</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold tracking-wider uppercase ${
                            listing.possession === "Ready" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
                          }`}>
                            {listing.possession}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => handleToggleFeatured(listing)} className="cursor-pointer hover:scale-110 transition-transform">
                            <Star size={16} className={listing.featured ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right space-x-1">
                          <button onClick={() => startEdit(listing)} className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-150 inline-flex items-center justify-center cursor-pointer text-gray-600">
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => setDeleteConfirmId(listing.id)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 border border-red-150 inline-flex items-center justify-center cursor-pointer text-red-600">
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredListings.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-gray-400 font-semibold">No listings matches.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: ADD / EDIT WIZARD */}
          {(view === "add" || view === "edit") && (
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Wizard Steps Header */}
              <div className="bg-white border rounded-2xl p-4 flex items-center justify-between gap-1 overflow-x-auto shadow-sm">
                {[
                  { nr: 1, label: "Developer" },
                  { nr: 2, label: "Specs & Report" },
                  { nr: 3, label: "Amenities" },
                  { nr: 4, label: "Images" },
                  { nr: 5, label: "Floor Plans" },
                  { nr: 6, label: "SEO details" },
                  { nr: 7, label: "Publish" }
                ].map(s => (
                  <button
                    key={s.nr} onClick={() => setWizardStep(s.nr)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider cursor-pointer shrink-0 transition-colors"
                    style={{
                      color: wizardStep === s.nr ? "#C9171E" : wizardStep > s.nr ? "#10b981" : "#9ca3af",
                      background: wizardStep === s.nr ? "rgba(201,23,30,0.05)" : "transparent"
                    }}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      wizardStep === s.nr ? "bg-brand-red text-white" : wizardStep > s.nr ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"
                    }`}>
                      {s.nr}
                    </span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Wizard Body Card */}
              <div className="bg-white border rounded-3xl p-8 shadow-sm space-y-6 min-h-[380px]">
                
                {/* STEP 1: DEVELOPERS & LOCATION */}
                {wizardStep === 1 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-base font-extrabold text-brand-black">Step 1: Developer & Location</h3>
                      <p className="text-sm text-gray-400 mt-1">Select developer company, project name, and neighborhood micro-market.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Builder/Architect Name</label>
                        <input
                          type="text" className="w-full bg-gray-50 border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-brand-red"
                          placeholder="e.g. Prestige Estates Projects Ltd" value={form.architect}
                          onChange={e => setField("architect", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Location (Neighborhood, City)</label>
                        <input
                          type="text" className="w-full bg-gray-50 border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-brand-red"
                          placeholder="e.g. Kokapet, Hyderabad" value={form.location}
                          onChange={e => setField("location", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Project / Development Name</label>
                      <input
                        type="text" className="w-full bg-gray-50 border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-brand-red"
                        placeholder="e.g. Prestige Somerville" value={form.projectName || ""}
                        onChange={e => setField("projectName", e.target.value)}
                      />
                    </div>

                    {/* Connectivity Stats */}
                    <div className="border-t pt-5 space-y-4">
                      <div>
                        <h4 className="text-xs font-extrabold text-brand-red uppercase tracking-wider">Neighborhood Connectivity Stats (Within 5km)</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Specify proximity count for nearby facilities.</p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                          { key: "hospitals", label: "Hospitals" },
                          { key: "malls", label: "Shopping Malls" },
                          { key: "schools", label: "Schools" },
                          { key: "restaurants", label: "Restaurants" },
                          { key: "metroStations", label: "Metro Stations" },
                          { key: "railwayStations", label: "Railway Stations" },
                          { key: "itParks", label: "IT Parks" },
                        ].map(n => (
                          <div key={n.key} className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">{n.label}</label>
                            <input
                              type="number" min={0}
                              className="w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-brand-red"
                              value={(form.nearby as any)[n.key] ?? 0}
                              onChange={e => setNearby(n.key, parseInt(e.target.value) || 0)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AQI Metrics */}
                    <div className="border-t pt-5 space-y-4">
                      <div>
                        <h4 className="text-xs font-extrabold text-brand-red uppercase tracking-wider">Air Quality Index</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Environmental data for the neighborhood micro-market.</p>
                      </div>
                      <div className="max-w-xs space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">AQI Score</label>
                        <input
                          type="number" min={0}
                          className="w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-brand-red"
                          value={form.aqi?.score ?? 0}
                          onChange={e => setAqi("score", parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: SPECS & RECOMMENDATION REPORT */}
                {wizardStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-extrabold text-brand-black">Step 2: Property Specs & Recommendation Report</h3>
                      <p className="text-sm text-gray-400 mt-1">Specify core structural parameters and configure the Recommendation ratings.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Property Title</label>
                        <input
                          type="text" className="w-full bg-gray-50 border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-brand-red"
                          placeholder="e.g. The Kokapet Summit Villa" value={form.title}
                          onChange={e => {
                            setField("title", e.target.value);
                            setField("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Price (INR)</label>
                        <input
                          type="number" className="w-full bg-gray-50 border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-brand-red"
                          value={form.price} onChange={e => setField("price", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">BHK Configuration</label>
                        <input
                          type="number" min={1} className="w-full bg-gray-50 border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-brand-red"
                          value={form.bhk} onChange={e => setField("bhk", parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Super Built-up Area (Sq Ft)</label>
                        <input
                          type="text" className="w-full bg-gray-50 border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-brand-red"
                          placeholder="e.g. 5,400 sq ft" value={form.area}
                          onChange={e => setField("area", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Property Type</label>
                        <select
                          className="w-full bg-gray-50 border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-brand-red"
                          value={form.type} onChange={e => setField("type", e.target.value)}
                        >
                          <option value="Apartment">Apartment</option>
                          <option value="Villa">Villa</option>
                          <option value="Plot">Plot</option>
                          <option value="Commercial">Commercial</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Possession Status</label>
                        <select
                          className="w-full bg-gray-50 border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-brand-red"
                          value={form.possession} onChange={e => setField("possession", e.target.value)}
                        >
                          <option value="Ready">Ready</option>
                          <option value="Under Construction">Under Construction</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">RERA Number</label>
                        <input
                          type="text" className="w-full bg-gray-50 border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-brand-red"
                          placeholder="e.g. TS/01/Building/01/2024" value={form.reraNumber || ""}
                          onChange={e => setField("reraNumber", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Possession Target Date</label>
                        <input
                          type="text" className="w-full bg-gray-50 border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-brand-red"
                          placeholder="e.g. Dec 2027 or Ready" value={form.possessionDate || ""}
                          onChange={e => setField("possessionDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Investment Strategy</label>
                        <select
                          className="w-full bg-gray-50 border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-brand-red"
                          value={form.investmentType} onChange={e => setField("investmentType", e.target.value)}
                        >
                          <option value="Capital Appreciation">Capital Appreciation</option>
                          <option value="High-Yield Rental">High-Yield Rental</option>
                          <option value="Generational Estate">Generational Estate</option>
                        </select>
                      </div>
                    </div>

                    {form.type === "Apartment" && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-widest text-gray-400">UDS Per Acre (Sq Yds)</label>
                          <input
                            type="number" className="w-full bg-gray-50 border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-brand-red"
                            placeholder="e.g. 100" value={form.udsPerAcre !== undefined ? form.udsPerAcre : 100}
                            onChange={e => setField("udsPerAcre", parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                      <div className="md:col-span-3 space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Google Drive Brochure Link</label>
                        <input
                          type="text" className="w-full bg-gray-50 border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-brand-red"
                          placeholder="e.g. https://drive.google.com/file/d/.../view?usp=sharing" value={form.brochureUrl || ""}
                          onChange={e => setField("brochureUrl", e.target.value)}
                        />
                      </div>
                    </div>

                     <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Property Description</label>
                      <textarea
                        rows={3} className="w-full bg-gray-50 border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-brand-red resize-none"
                        placeholder="Detailed copy about the design, framing, and views..." value={form.description}
                        onChange={e => setField("description", e.target.value)}
                      />
                    </div>

                    <div className="border-t pt-5 space-y-4">
                      <div>
                        <h4 className="text-xs font-extrabold text-brand-red uppercase tracking-wider">NexHouz Recommendation Scores (1-10)</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Adjust sliders for dynamic scorecard on property details page.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {[
                          { key: "investmentPotential", label: "Investment Potential" },
                          { key: "familyFriendliness", label: "Family Friendliness" },
                          { key: "commuteConvenience", label: "Commute Convenience" },
                          { key: "schoolAccess", label: "School Access" },
                          { key: "hospitalAccess", label: "Hospital Access" },
                          { key: "futureAppreciation", label: "Future Appreciation" },
                          { key: "builderTrustRating", label: "Builder Trust Rating" },
                        ].map(s => (
                          <div key={s.key} className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                              <span>{s.label}</span>
                              <span className="text-brand-black font-extrabold">{(form.recommendationReport as any)[s.key]} / 10</span>
                            </div>
                            <input
                              type="range" min={1} max={10} step={1}
                              className="w-full h-1 bg-gray-200 accent-brand-red rounded-lg appearance-none cursor-pointer"
                              value={(form.recommendationReport as any)[s.key]}
                              onChange={e => setReport(s.key, parseInt(e.target.value))}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-1 pt-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Why NexHouz Recommends This (Summary Block)</label>
                        <textarea
                          rows={2} className="w-full bg-gray-50 border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-brand-red resize-none"
                          placeholder="Summarize the core values that make this property an exceptional pick..."
                          value={form.recommendationReport.whyRecommended}
                          onChange={e => setReport("whyRecommended", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: AMENITIES */}
                {wizardStep === 3 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-base font-extrabold text-brand-black">Step 3: Amenities Checkboxes</h3>
                      <p className="text-sm text-gray-400 mt-1">Select from standard luxury tags or add custom amenity tags.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(CATEGORIZED_AMENITIES).map(([category, items]) => (
                        <div key={category} className="space-y-2">
                          <h4 className="text-xs font-black uppercase tracking-widest text-brand-red">{category}</h4>
                          <div className="grid grid-cols-1 gap-1.5">
                            {items.map(item => {
                              const checked = form.amenities.includes(item);
                              return (
                                <label key={item} className="flex items-center gap-2.5 text-xs font-semibold text-gray-700 cursor-pointer">
                                  <input
                                    type="checkbox" checked={checked}
                                    className="accent-brand-red w-3.5 h-3.5"
                                    onChange={() => {
                                      if (checked) {
                                        setField("amenities", form.amenities.filter(a => a !== item));
                                      } else {
                                        setField("amenities", [...form.amenities, item]);
                                      }
                                    }}
                                  />
                                  <span>{item}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1.5 pt-4 border-t">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Add Custom Amenity Tag</label>
                      <div className="flex gap-2">
                        <input
                          type="text" className="bg-gray-50 border rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-brand-red flex-1"
                          placeholder="e.g. Smart Climate Control" value={amenityInput}
                          onChange={e => setAmenityInput(e.target.value)}
                        />
                        <button
                          type="button" onClick={() => {
                            const val = amenityInput.trim();
                            if (val && !form.amenities.includes(val)) {
                              setField("amenities", [...form.amenities, val]);
                              setAmenityInput("");
                            }
                          }}
                          className="px-4 py-2.5 bg-brand-black text-white text-xs font-extrabold uppercase rounded-xl cursor-pointer"
                        >
                          Add tag
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: IMAGES */}
                {wizardStep === 4 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-base font-extrabold text-brand-black">Step 4: Image Management</h3>
                      <p className="text-sm text-gray-400 mt-1">Define property gallery URLs. Click arrows to arrange display sequence.</p>
                    </div>

                    <div className="space-y-3">
                      {form.images.map((img, idx) => {
                        const isPrimary = form.image === img;
                        return (
                          <div key={idx} className="flex items-center justify-between gap-4 p-3 bg-gray-50 border rounded-xl">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <img src={img} className="w-12 h-12 object-cover rounded-lg border shrink-0 bg-white" />
                              <span className="text-xs font-semibold text-gray-800 truncate">{img}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button" onClick={() => setField("image", img)}
                                className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                  isPrimary ? "bg-brand-red text-white" : "bg-white border text-gray-400 hover:text-gray-700"
                                }`}
                              >
                                {isPrimary ? "Cover" : "Set Cover"}
                              </button>
                              
                              {/* Reorder up */}
                              <button
                                type="button" disabled={idx === 0}
                                onClick={() => {
                                  const list = [...form.images];
                                  const temp = list[idx];
                                  list[idx] = list[idx - 1];
                                  list[idx - 1] = temp;
                                  setField("images", list);
                                }}
                                className="w-7 h-7 rounded-lg bg-white border flex items-center justify-center cursor-pointer disabled:opacity-30"
                              >
                                <ChevronUp size={13} />
                              </button>
                              
                              {/* Remove */}
                              <button
                                type="button" onClick={() => {
                                  const list = form.images.filter((_, i) => i !== idx);
                                  setField("images", list);
                                  if (isPrimary && list.length > 0) setField("image", list[0]);
                                }}
                                className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 border border-red-150 flex items-center justify-center cursor-pointer text-red-600"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {form.images.length === 0 && (
                        <p className="text-xs text-gray-400 text-center py-6">No images loaded yet.</p>
                      )}
                    </div>

                    {/* Upload zone + URL fallback */}
                    <div className="space-y-3 pt-4 border-t">
                      {/* Drag-and-drop upload area */}
                      <label
                        className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl py-8 px-6 cursor-pointer transition-all ${
                          dragActive ? "border-brand-red bg-brand-red/5" : "border-gray-200 bg-gray-50 hover:border-brand-red/50 hover:bg-gray-100"
                        }`}
                        onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={e => {
                          e.preventDefault();
                          setDragActive(false);
                          handleImageFileSelect(e.dataTransfer.files);
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={e => handleImageFileSelect(e.target.files)}
                        />
                        {isUploadingImage ? (
                          <>
                            <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs font-extrabold text-brand-red">Uploading…</p>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                              <ImageIcon size={20} className="text-brand-red" />
                            </div>
                            <div className="text-center space-y-1">
                              <p className="text-sm font-extrabold text-brand-black">
                                {dragActive ? "Drop images here" : "Click to upload or drag & drop"}
                              </p>
                              <p className="text-xs text-gray-400 font-medium">PNG, JPG, WEBP up to 10MB · Multiple files supported</p>
                            </div>
                          </>
                        )}
                      </label>

                      {uploadError && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                          <AlertTriangle size={13} className="text-red-500 shrink-0" />
                          <p className="text-xs text-red-700 font-semibold">{uploadError}</p>
                          <button onClick={() => setUploadError(null)} className="ml-auto text-red-400 hover:text-red-600 cursor-pointer"><X size={13} /></button>
                        </div>
                      )}

                      {/* URL fallback */}
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Or add by URL</p>
                        <div className="flex gap-2">
                          <input
                            type="text" className="bg-gray-50 border rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-brand-red flex-1"
                            placeholder="https://… or /images/…" value={imageInput}
                            onChange={e => setImageInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const val = imageInput.trim();
                                if (val && !form.images.includes(val)) {
                                  setField("images", [...form.images, val]);
                                  if (form.images.length === 0) setField("image", val);
                                  setImageInput("");
                                }
                              }
                            }}
                          />
                          <button
                            type="button" onClick={() => {
                              const val = imageInput.trim();
                              if (val && !form.images.includes(val)) {
                                setField("images", [...form.images, val]);
                                if (form.images.length === 0) setField("image", val);
                                setImageInput("");
                              }
                            }}
                            className="px-4 py-2.5 bg-brand-black text-white text-xs font-extrabold uppercase rounded-xl cursor-pointer whitespace-nowrap"
                          >
                            Add URL
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: FLOOR PLANS */}
                {wizardStep === 5 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-base font-extrabold text-brand-black">Step 5: Layout Configuration</h3>
                      <p className="text-sm text-gray-400 mt-1">Specify BHK types, super built-up sizes, facing orientations, and pricing columns.</p>
                    </div>

                    <div className="space-y-3">
                      {form.floorPlans.map((fp, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 border rounded-xl bg-gray-50">
                          <input
                            type="text" className="bg-white border rounded-lg px-3 py-1.5 text-xs font-bold w-28 outline-none"
                            placeholder="e.g. 3 BHK" value={fp.type}
                            onChange={e => {
                              const list = [...form.floorPlans];
                              list[idx] = { ...fp, type: e.target.value };
                              setField("floorPlans", list);
                            }}
                          />
                          <input
                            type="number" className="bg-white border rounded-lg px-3 py-1.5 text-xs font-semibold w-28 outline-none"
                            placeholder="Size (sqft)" value={fp.size}
                            onChange={e => {
                              const list = [...form.floorPlans];
                              list[idx] = { ...fp, size: parseInt(e.target.value) || 0 };
                              setField("floorPlans", list);
                            }}
                          />
                          <select
                            className="bg-white border rounded-lg px-3 py-1.5 text-xs font-semibold w-28 outline-none"
                            value={fp.facing}
                            onChange={e => {
                              const list = [...form.floorPlans];
                              list[idx] = { ...fp, facing: e.target.value };
                              setField("floorPlans", list);
                            }}
                          >
                            <option value="East">East</option>
                            <option value="West">West</option>
                            <option value="North">North</option>
                            <option value="South">South</option>
                            <option value="Multiple">Multiple</option>
                            <option value="N/A">N/A</option>
                          </select>
                          <input
                            type="number" className="bg-white border rounded-lg px-3 py-1.5 text-xs font-bold flex-1 outline-none text-brand-red"
                            placeholder="Price (INR)" value={fp.price}
                            onChange={e => {
                              const list = [...form.floorPlans];
                              list[idx] = { ...fp, price: parseInt(e.target.value) || 0 };
                              setField("floorPlans", list);
                            }}
                          />
                          <button
                            type="button" onClick={() => {
                              const list = form.floorPlans.filter((_, i) => i !== idx);
                              setField("floorPlans", list);
                            }}
                            className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 border border-red-150 flex items-center justify-center cursor-pointer text-red-600 shrink-0"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button" onClick={() => {
                          setField("floorPlans", [...form.floorPlans, { type: "3 BHK", size: 2000, facing: "East", price: 15000000 }]);
                        }}
                        className="w-full py-2.5 border-2 border-dashed border-gray-200 hover:border-brand-red rounded-xl text-xs font-extrabold uppercase text-gray-500 hover:text-brand-red cursor-pointer transition-colors"
                      >
                        + Add Layout Row
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 6: SEARCH & SEO */}
                {wizardStep === 6 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-base font-extrabold text-brand-black">Step 6: Search & SEO</h3>
                      <p className="text-sm text-gray-400 mt-1">Configure user-friendly url slug and search engine descriptive snippets.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">URL Slug (e.g. /properties/[slug])</label>
                        <input
                          type="text" className="w-full bg-gray-50 border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-brand-red"
                          placeholder="kokapet-summit-villa" value={form.slug}
                          onChange={e => setField("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">SEO Page Title</label>
                        <input
                          type="text" className="w-full bg-gray-50 border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-brand-red"
                          placeholder="e.g. Ultra-Luxury Villa for Sale in Kokapet | NexHouz"
                          value={`${form.title || "Luxury Property"} | NexHouz`}
                          disabled
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">SEO Meta Description</label>
                        <textarea
                          rows={2} className="w-full bg-gray-50 border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-brand-red resize-none"
                          placeholder="Premium property overview and builder credentials in Gachibowli..."
                          value={form.description ? form.description.slice(0, 150) : ""}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 7: REVIEW & PUBLISH */}
                {wizardStep === 7 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-extrabold text-brand-black">Step 7: Review & Publish</h3>
                      <p className="text-sm text-gray-400 mt-1">Toggle live display availability and sync property metadata to database.</p>
                    </div>

                    <div className="p-5 bg-gray-50 border rounded-2xl space-y-4">
                      <div className="flex items-center gap-4">
                        <img src={form.image} className="w-16 h-16 object-cover rounded-xl border" />
                        <div>
                          <p className="text-sm font-extrabold text-gray-900 leading-tight">{form.title || "Untitled Property"}</p>
                          <p className="text-xs text-gray-500 font-semibold mt-1">{form.bhk} BHK · {form.area} · {form.location}</p>
                          <p className="text-sm font-black text-brand-red mt-1">₹{(form.price / 10000000).toFixed(2)} Cr</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs font-bold text-gray-500 border-t pt-4">
                        <div>Amenities linked: <span className="text-brand-black font-extrabold">{form.amenities.length} tags</span></div>
                        <div>Floor layouts: <span className="text-brand-black font-extrabold">{form.floorPlans.length} configurations</span></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t pt-5">
                      <div className="flex items-center gap-3">
                        <button
                          type="button" onClick={() => setField("featured", !form.featured)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wide cursor-pointer transition-all flex items-center gap-2 border ${
                            form.featured ? "bg-yellow-50 border-yellow-200 text-yellow-600" : "bg-white border-gray-250 text-gray-500"
                          }`}
                        >
                          <Star size={13} fill={form.featured ? "currentColor" : "none"} />
                          {form.featured ? "Featured on Homepage" : "Pin to Featured"}
                        </button>
                      </div>

                      <button
                        type="button" onClick={handleSaveListing}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
                      >
                        <Check size={14} /> {view === "edit" ? "Save Modifications" : "Publish to Supabase"}
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Wizard Nav buttons */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button" disabled={wizardStep === 1}
                  onClick={() => setWizardStep(prev => prev - 1)}
                  className="px-5 py-2.5 border rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-pointer bg-white text-gray-500 disabled:opacity-30 flex items-center gap-2"
                >
                  <ArrowLeft size={13} /> Back
                </button>
                {wizardStep < 7 ? (
                  <button
                    type="button" onClick={() => setWizardStep(prev => prev + 1)}
                    className="px-5 py-2.5 bg-brand-black text-white text-xs font-extrabold uppercase tracking-wider cursor-pointer rounded-xl flex items-center gap-2"
                  >
                    Next Step <ArrowRight size={13} />
                  </button>
                ) : (
                  <button
                    type="button" onClick={() => setView("listings")}
                    className="px-5 py-2.5 border border-gray-200 rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-pointer bg-white text-gray-500 flex items-center gap-2"
                  >
                    Cancel
                  </button>
                )}
              </div>

            </div>
          )}

          {/* VIEW: LEADS */}
          {view === "leads" && (
            <div className="space-y-6">
              <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-150 text-xs font-extrabold uppercase tracking-wider text-gray-400">
                      <th className="px-6 py-4">Inquirer</th>
                      <th className="px-6 py-4">Contact Detail</th>
                      <th className="px-6 py-4">Associated Property</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Message Notes</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {leads.map(lead => (
                      <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-extrabold text-gray-900">{lead.name}</td>
                        <td className="px-6 py-4 space-y-1">
                          <p className="font-semibold text-gray-700 flex items-center gap-1.5"><Phone size={12} className="text-gray-400" /> {lead.phone}</p>
                          <p className="text-gray-400 flex items-center gap-1.5"><Mail size={12} className="text-gray-400" /> {lead.email}</p>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-800">{lead.properties?.title || "General Query"}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                            lead.lead_type === "callback" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                          }`}>
                            {lead.lead_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-500 max-w-xs truncate" title={lead.notes}>{lead.notes || "N/A"}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                            lead.status === "new" ? "bg-red-50 text-brand-red border border-red-100" :
                            lead.status === "contacted" ? "bg-yellow-50 text-yellow-600 border border-yellow-100" :
                            "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-1 shrink-0">
                          {lead.status === "new" && (
                            <button
                              onClick={() => handleLeadStatusChange(lead.id, "contacted")}
                              className="px-2.5 py-1 bg-yellow-50 hover:bg-yellow-100 border border-yellow-250 text-yellow-600 font-extrabold rounded-lg cursor-pointer"
                            >
                              Contacted
                            </button>
                          )}
                          {lead.status !== "closed" && (
                            <button
                              onClick={() => handleLeadStatusChange(lead.id, "closed")}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-250 text-emerald-600 font-extrabold rounded-lg cursor-pointer"
                            >
                              Close Lead
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {leads.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-gray-400 font-semibold">No inquiries captured yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: AI BRAIN */}
          {view === "ai_brain" && (
            <div className="space-y-8 max-w-4xl">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-red/5 border border-brand-red/10 flex items-center justify-center">
                  <Sparkles size={22} className="text-brand-red" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-brand-black">AI Brain Configuration</h2>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">Customize how the NexHouz AI Advisor thinks, speaks, and qualifies buyers.</p>
                </div>
              </div>

              {/* System Prompt Editor */}
              <div className="bg-white border border-gray-100 rounded-3xl p-8 space-y-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-brand-black">System Prompt</h3>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">This is the master instruction that defines the AI advisor's persona, tone, and rules. It is injected before every conversation.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAdvisorPrompt(DEFAULT_SYSTEM_PROMPT)}
                      className="px-3 py-1.5 text-xs font-extrabold text-gray-500 border border-gray-200 rounded-xl hover:border-brand-red hover:text-brand-red transition-all cursor-pointer"
                    >
                      ↺ Restore Default
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows={18}
                    value={advisorPrompt}
                    onChange={e => { setAdvisorPrompt(e.target.value); setPromptSaved(false); }}
                    placeholder="Enter the AI system prompt here. This controls how the advisor identifies itself, asks questions, and recommends properties..."
                    className="w-full bg-gray-50 border border-gray-200 focus:border-brand-red rounded-2xl px-5 py-4 text-xs font-mono leading-relaxed outline-none resize-none transition-colors"
                    style={{ fontFamily: "'Courier New', monospace" }}
                  />
                  <div className="absolute bottom-3 right-4 text-[10px] text-gray-400 font-semibold">
                    {advisorPrompt.length.toLocaleString()} chars · ~{Math.ceil(advisorPrompt.length / 4).toLocaleString()} tokens
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (typeof window !== "undefined" && advisorPrompt.trim().length > 100) {
                        localStorage.setItem("nexhouz_advisor_prompt", advisorPrompt);
                        setPromptSaved(true);
                        setTimeout(() => setPromptSaved(false), 3000);
                      }
                    }}
                    className="px-6 py-2.5 bg-brand-red hover:bg-brand-red/90 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-brand-red/10"
                  >
                    <Save size={13} />
                    {promptSaved ? "✓ Saved to Browser" : "Save Prompt"}
                  </button>
                  <p className="text-[10px] text-gray-400 font-medium">Saved to browser localStorage. Resets if browser storage is cleared.</p>
                </div>
              </div>

              {/* Business Memory */}
              <div className="bg-white border border-gray-100 rounded-3xl p-8 space-y-5 shadow-sm">
                <div>
                  <h3 className="text-base font-extrabold text-brand-black">Business Memory</h3>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">Injected as a second system message before every conversation. Use this to define brand USPs, focus areas, and forbidden topics.</p>
                </div>

                {/* Template helpers */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Template Guide</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-gray-600">
                    {[
                      { label: "Company Name", example: "Company: NexHouz" },
                      { label: "Focus Localities", example: "Focus Areas: Kokapet, Narsingi, Gachibowli, Hitec City" },
                      { label: "USPs", example: "USPs: 100% RERA compliant, No commission charged to buyers, End-to-end advisory" },
                      { label: "Forbidden Topics", example: "Do NOT mention: competitors, unregistered projects, offshore investments" },
                      { label: "Deal Focus", example: "Promote: Self-use luxury apartments above 3 Cr in West Hyderabad corridor" },
                      { label: "Tone Override", example: "Tone: Sophisticated, concise, consultative. Never use slang." },
                    ].map(item => (
                      <div key={item.label} className="space-y-0.5">
                        <p className="font-extrabold text-gray-500">{item.label}:</p>
                        <code className="text-[10px] bg-white border border-gray-150 px-2 py-1 rounded-lg block font-mono text-gray-700">{item.example}</code>
                      </div>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={12}
                  value={businessMemory}
                  onChange={e => { setBusinessMemory(e.target.value); setMemorySaved(false); }}
                  placeholder={`Company: NexHouz\nTagline: India\'s most trusted real estate advisory\nFocus Areas: Kokapet, Narsingi, Gachibowli, Hitec City, Financial District\nUSPs:\n- 100% RERA compliant listings only\n- No commission charged to buyers\n- End-to-end advisory from shortlisting to registration\nForbidden Topics: Do not mention competitor brands. Do not discuss unlicensed projects.\nDeal Preferences: Focus on self-use luxury apartments 3 Cr and above.\nTone: Warm, sophisticated, and consultant-like. Avoid sounding like a chatbot.`}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-brand-red rounded-2xl px-5 py-4 text-xs font-mono leading-relaxed outline-none resize-none transition-colors"
                  style={{ fontFamily: "'Courier New', monospace" }}
                />

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        localStorage.setItem("nexhouz_business_memory", businessMemory);
                        setMemorySaved(true);
                        setTimeout(() => setMemorySaved(false), 3000);
                      }
                    }}
                    className="px-6 py-2.5 bg-brand-black hover:bg-gray-800 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Save size={13} />
                    {memorySaved ? "✓ Business Memory Saved" : "Save Business Memory"}
                  </button>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-brand-red/3 border border-brand-red/10 rounded-3xl p-6 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-brand-red">💡 Tips for Best Results</h4>
                <ul className="text-xs text-gray-600 font-medium space-y-1.5 leading-relaxed list-disc list-inside">
                  <li>Keep the system prompt under 3,000 tokens (≈12,000 chars) to stay within GPT-4o-mini context limits</li>
                  <li>Always include the inventory format instruction and bracket recommendation format <code>[Property Name]</code></li>
                  <li>Business memory is injected as a separate system message — changes take effect immediately on next chat</li>
                  <li>To reset to default: clear browser localStorage or click "Restore Default" above</li>
                </ul>
              </div>
            </div>
          )}

          {/* VIEW: AI CRM */}
          {view === "ai_crm" && (
            <div className="space-y-6">
              {isMigrationRequired ? (
                <div className="border border-amber-250 bg-amber-50/50 rounded-3xl py-6 px-8 space-y-4 shadow-sm w-full">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-inner">
                      <AlertTriangle size={20} className="stroke-[2]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-extrabold text-amber-950">AI CRM Schema Migration Required</h3>
                      <p className="text-xs text-amber-750 font-medium mt-0.5 leading-relaxed">
                        The AI CRM features require new database tables (`lead_profiles`, `ai_conversations`, `lead_recommendations`, `site_visits`) to store buyer qualification profiles, transcripts, and site visit logs.
                      </p>
                    </div>
                  </div>
                  <div className="pl-14 space-y-3">
                    <p className="text-xs text-gray-600 font-medium">
                      Please copy the SQL commands below and run them in your **Supabase SQL Editor** to create the tables and set up ROW LEVEL SECURITY policies:
                    </p>
                    <textarea
                      readOnly
                      rows={10}
                      onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                      value={`-- Copy and run in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS lead_profiles (
  lead_id UUID PRIMARY KEY REFERENCES leads(id) ON DELETE CASCADE,
  budget NUMERIC,
  purpose VARCHAR(50),
  office_location VARCHAR(255),
  family_size INT,
  property_type VARCHAR(100),
  priority VARCHAR(255),
  lead_score INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  conversation JSONB,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS lead_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  match_score INT,
  reasoning TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS site_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'Scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE lead_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts on lead_profiles" ON lead_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on lead_profiles" ON lead_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public update on lead_profiles" ON lead_profiles FOR UPDATE USING (true);

CREATE POLICY "Allow public inserts on ai_conversations" ON ai_conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on ai_conversations" ON ai_conversations FOR SELECT USING (true);

CREATE POLICY "Allow public inserts on lead_recommendations" ON lead_recommendations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on lead_recommendations" ON lead_recommendations FOR SELECT USING (true);

CREATE POLICY "Allow public inserts on site_visits" ON site_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on site_visits" ON site_visits FOR SELECT USING (true);
CREATE POLICY "Allow public update on site_visits" ON site_visits FOR UPDATE USING (true);`}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 font-mono text-[9px] text-emerald-400 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                    />
                    <div className="flex gap-4">
                      <button
                        onClick={loadData}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-lg text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Check Again / Refresh
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-3" style={{ borderColor: theme.border }}>
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Total AI Qualified Leads</span>
                      <p className="text-3xl font-black text-gray-950">{aiLeads.length}</p>
                    </div>
                    <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-3" style={{ borderColor: theme.border }}>
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Average Lead Score</span>
                      <p className="text-3xl font-black text-emerald-650">
                        {aiLeads.length > 0 
                          ? Math.round(aiLeads.reduce((acc, lead) => acc + (lead.lead_profiles?.lead_score || 0), 0) / aiLeads.length)
                          : "0"
                        }
                      </p>
                    </div>
                    <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-3" style={{ borderColor: theme.border }}>
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Scheduled Tours</span>
                      <p className="text-3xl font-black text-indigo-600">
                        {aiLeads.reduce((acc, lead) => acc + (lead.site_visits?.length || 0), 0)}
                      </p>
                    </div>
                  </div>

                  {/* Leads Data Table */}
                  <div className="bg-white border rounded-2xl overflow-hidden shadow-sm" style={{ borderColor: theme.border }}>
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-150 text-xs font-extrabold uppercase tracking-wider text-gray-400">
                          <th className="px-6 py-4">Buyer Details</th>
                          <th className="px-6 py-4">Preferences</th>
                          <th className="px-6 py-4">Priority / Office</th>
                          <th className="px-6 py-4 text-center">Score</th>
                          <th className="px-6 py-4">Status / Visits</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-xs">
                        {aiLeads.map(lead => {
                          const profile = lead.lead_profiles || {};
                          const visits = lead.site_visits || [];
                          const score = profile.lead_score || 0;
                          
                          let scoreColor = "bg-gray-150 text-gray-650 border-gray-200";
                          if (score >= 90) scoreColor = "bg-red-50 text-brand-red border border-red-100";
                          else if (score >= 70) scoreColor = "bg-amber-50 text-amber-700 border border-amber-100";
                          else scoreColor = "bg-gray-50 text-gray-500 border border-gray-150";

                          return (
                            <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 space-y-0.5">
                                <p className="font-extrabold text-gray-905">{lead.name}</p>
                                <p className="font-semibold text-gray-500">{lead.phone}</p>
                              </td>
                              <td className="px-6 py-4 space-y-1">
                                <p className="font-bold text-gray-800">
                                  {profile.budget ? formatINR(profile.budget) : "N/A"}
                                </p>
                                <p className="text-[10px] text-gray-405 font-bold uppercase tracking-wider">
                                  {profile.property_type || "Any"} · {profile.purpose || "Flexible"}
                                </p>
                              </td>
                              <td className="px-6 py-4 space-y-1">
                                <p className="font-semibold text-gray-700 flex items-center gap-1.5"><MapPin size={12} className="text-gray-400" /> {profile.office_location || "None"}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Priority: {profile.priority || "Flexible"}</p>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${scoreColor}`}>
                                  {score} {score >= 90 ? "Hot" : score >= 70 ? "Warm" : "Cold"}
                                </span>
                              </td>
                              <td className="px-6 py-4 space-y-1">
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                  lead.status === "new" ? "bg-red-50 text-brand-red border border-red-100" :
                                  lead.status === "contacted" ? "bg-yellow-50 text-yellow-600 border border-yellow-100" :
                                  "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                }`}>
                                  {lead.status}
                                </span>
                                {visits.length > 0 && (
                                  <p className="text-[9px] text-indigo-600 font-black uppercase tracking-wider flex items-center gap-1">
                                    <Calendar size={10} /> Visit: {visits[0].date.split("T")[0]}
                                  </p>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => setSelectedAiLead(lead)}
                                  className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white font-extrabold rounded-lg text-xs uppercase tracking-wide cursor-pointer transition-colors"
                                >
                                  Open Profile
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {aiLeads.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-6 py-10 text-center text-gray-400 font-semibold">No AI Qualified Leads captured yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI LEAD DETAILS PANEL */}
          {selectedAiLead && (
            <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
              <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between border-l">
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between bg-gray-50">
                  <div>
                    <h3 className="text-lg font-black text-gray-950 uppercase tracking-tight">{selectedAiLead.name}</h3>
                    <div className="flex gap-4 mt-1 text-xs text-gray-500 font-semibold">
                      <p className="flex items-center gap-1"><Phone size={12} /> {selectedAiLead.phone}</p>
                      <p className="flex items-center gap-1"><Mail size={12} /> {selectedAiLead.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedAiLead(null)}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Summary */}
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-5 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-850 flex items-center gap-1">
                      <BrainCircuit size={12} /> AI Conversation Summary
                    </span>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                      {selectedAiLead.ai_conversations?.[0]?.summary || "No summary available."}
                    </p>
                  </div>

                  {/* Discovery Profile */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Buyer Profile Details</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-150">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Budget</span>
                        <p className="font-extrabold text-gray-800 mt-0.5">
                          {selectedAiLead.lead_profiles?.budget ? formatINR(selectedAiLead.lead_profiles.budget) : "N/A"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-150">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Purpose</span>
                        <p className="font-extrabold text-gray-800 mt-0.5">{selectedAiLead.lead_profiles?.purpose || "N/A"}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-150">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Office Location</span>
                        <p className="font-extrabold text-gray-800 mt-0.5 truncate" title={selectedAiLead.lead_profiles?.office_location}>{selectedAiLead.lead_profiles?.office_location || "N/A"}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-150">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Lead Score</span>
                        <p className="font-extrabold text-gray-800 mt-0.5">{selectedAiLead.lead_profiles?.lead_score || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Properties */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">AI Recommendations</h4>
                    <div className="space-y-3">
                      {selectedAiLead.lead_recommendations?.map((rec: any) => (
                        <div key={rec.id} className="border border-gray-150 rounded-2xl p-4 bg-white shadow-sm flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <p className="font-extrabold text-xs text-gray-900">{rec.properties?.title || "Property ID: " + rec.property_id}</p>
                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{rec.reasoning}</p>
                          </div>
                          <span className="shrink-0 inline-block px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-650 text-[10px] font-black rounded-full uppercase tracking-wider">
                            {rec.match_score}% Match
                          </span>
                        </div>
                      ))}
                      {(!selectedAiLead.lead_recommendations || selectedAiLead.lead_recommendations.length === 0) && (
                        <p className="text-xs text-gray-450 font-semibold italic">No recommendations logged.</p>
                      )}
                    </div>
                  </div>

                  {/* Visits Scheduling */}
                  <div className="space-y-3 border-t pt-5">
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Site Tour Status</h4>
                    <div className="bg-gray-50 border rounded-2xl p-4 space-y-4">
                      {selectedAiLead.site_visits && selectedAiLead.site_visits.length > 0 ? (
                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <p className="font-black text-indigo-600 flex items-center gap-1"><Calendar size={13} /> Scheduled Visit Date: {selectedAiLead.site_visits[0].date.split("T")[0]}</p>
                            <p className="text-gray-505 font-medium mt-1">Status: <strong className="font-extrabold uppercase text-indigo-700">{selectedAiLead.site_visits[0].status}</strong></p>
                            <p className="text-gray-450 font-medium mt-0.5">Notes: {selectedAiLead.site_visits[0].notes || "None"}</p>
                          </div>
                          <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-[9px] font-black rounded-full uppercase tracking-wider">Tours Logged</span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-xs text-gray-500 font-medium">No site visits scheduled yet. You can manually register a visit request below:</p>
                          <div className="flex items-center gap-3">
                            <input 
                              type="date" 
                              id="manualVisitDate"
                              className="bg-white border px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-red font-medium" 
                            />
                            <button
                              onClick={async () => {
                                const dateVal = (document.getElementById("manualVisitDate") as HTMLInputElement)?.value;
                                if (!dateVal) return;
                                const propId = selectedAiLead.lead_recommendations?.[0]?.property_id || listings[0]?.id;
                                if (propId) {
                                  const success = await saveSiteVisit(selectedAiLead.id, propId, dateVal, "Scheduled", "Registered manually from AI CRM dashboard.");
                                  if (success) {
                                    showToast("Site visit scheduled successfully.", "success");
                                    loadData();
                                    setSelectedAiLead(null);
                                  } else {
                                    showToast("Error scheduling site visit.", "error");
                                  }
                                }
                              }}
                              className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                            >
                              Book Visit
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Full Chat Transcript */}
                  <div className="space-y-3 border-t pt-5">
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Full Advisor Transcript</h4>
                    <div className="bg-gray-50 border rounded-2xl p-4 space-y-3 max-h-60 overflow-y-auto">
                      {selectedAiLead.ai_conversations?.[0]?.conversation?.map((chat: any, idx: number) => (
                        <div key={idx} className={`flex flex-col ${chat.role === "user" ? "items-end" : "items-start"}`}>
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{chat.role === "user" ? "Buyer" : "AI Advisor"}</span>
                          <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${chat.role === "user" ? "bg-brand-red text-white rounded-tr-sm" : "bg-white border border-gray-150 text-brand-black rounded-tl-sm shadow-sm"}`}>
                            {chat.content}
                          </div>
                        </div>
                      ))}
                      {(!selectedAiLead.ai_conversations || selectedAiLead.ai_conversations.length === 0) && (
                        <p className="text-xs text-gray-450 font-semibold italic">No transcript logs recorded.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50 flex justify-end">
                  <button 
                    onClick={() => setSelectedAiLead(null)}
                    className="px-5 py-2.5 bg-brand-black text-white text-xs font-extrabold uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    Close Profile Panel
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border shadow-2xl space-y-4">
            <h4 className="text-base font-extrabold text-gray-900 leading-tight">Remove Property Listing?</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">This will permanently delete the property from the database and remove all associated floor plans and gallery images. This cannot be undone.</p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => handleDeleteListing(deleteConfirmId)} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase rounded-xl cursor-pointer transition-colors">
                Yes, Delete
              </button>
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 border hover:bg-gray-50 text-gray-500 text-xs font-bold uppercase rounded-xl cursor-pointer transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diagnostics modal overlay */}
      {showDiagModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
          <div className="bg-white border border-gray-150 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 text-left relative text-brand-black">
            <button
              onClick={() => setShowDiagModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 cursor-pointer"
            >
              <X size={15} />
            </button>
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Building2 className="text-brand-red" size={18} />
              <h3 className="text-sm font-extrabold uppercase tracking-wider">Supabase Connection Diagnostics</h3>
            </div>
            
            <div className="font-mono text-[10px] space-y-3 text-gray-700 bg-gray-50 border border-gray-150 rounded-2xl p-4 overflow-x-auto">
              <div>
                <strong className="text-gray-950">Supabase Endpoint URL Host:</strong>{" "}
                {diagInfo?.urlHost || "Not resolved"}
              </div>
              <div>
                <strong className="text-gray-950">Url Configured:</strong>{" "}
                {diagInfo?.urlDefined ? "YES" : "NO"}
              </div>
              <div>
                <strong className="text-gray-950">Anon Key Configured:</strong>{" "}
                {diagInfo?.keyDefined ? "YES" : "NO"}
              </div>
              <div>
                <strong className="text-gray-950">Last Network Fetch Status:</strong>{" "}
                <span className={dbStatus === "success" ? "text-emerald-600 font-bold" : "text-red-600 font-bold"}>
                  {diagInfo?.queryStatus || "Pending"}
                </span>
              </div>
              {diagInfo?.error && (
                <div className="mt-2 text-red-600 bg-red-50 border border-red-100 p-2 rounded-xl text-[9px] whitespace-pre-wrap leading-relaxed">
                  <strong className="text-red-950 font-bold block mb-0.5">Error Details:</strong>
                  {diagInfo.error}
                </div>
              )}
            </div>
            
            <div className="text-[10px] text-gray-500 font-medium leading-relaxed bg-gray-50/50 p-3 rounded-xl border border-gray-100">
              This diagnostics mode is only visible because <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800">NODE_ENV=development</code> or the <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800">?debug=true</code> query flag is active. It will not be exposed to production users.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ─── Toast Banner ───
function ToastBanner({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  const isSuccess = toast.type === "success";
  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl bg-white border"
      style={{ borderColor: isSuccess ? "#bbf7d0" : "#fecaca" }}>
      {isSuccess ? <Check size={15} className="text-green-600 shrink-0" /> : <AlertTriangle size={15} className="text-red-500 shrink-0" />}
      <p className="text-xs font-extrabold uppercase tracking-wide" style={{ color: isSuccess ? "#16a34a" : "#dc2626" }}>{toast.message}</p>
      <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"><X size={13} /></button>
    </div>
  );
}

// ─── Stats Card ───
function StatCard({ icon: Icon, label, value, color, dark }: { icon: any; label: string; value: number | string; color: string; dark: boolean }) {
  return (
    <div className="rounded-2xl p-5 flex items-center gap-4 bg-white border shadow-sm">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}12` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-extrabold leading-none text-gray-900">{value}</p>
        <p className="text-xs font-black uppercase tracking-wider text-gray-400 mt-1.5">{label}</p>
      </div>
    </div>
  );
}
