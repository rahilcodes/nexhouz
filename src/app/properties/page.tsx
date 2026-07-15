"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  RotateCcw,
  Building,
  Heart,
  Check,
  CheckSquare,
  Square,
  X,
  Search,
  ArrowRight,
  Info,
  ShieldCheck,
  LayoutGrid,
  List,
  Grid3X3,
  ChevronDown,
  AlertTriangle
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CONTAINER, SECTION_X, Eyebrow } from "@/components/ui/theme";
import { fetchAllProperties, submitLead } from "@/lib/db";
import { properties as defaultProperties, Property } from "@/data/properties";
import { supabase } from "@/lib/supabaseClient";

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens (NexHouz Web Style Guide)
//   Primary Red #D31E28 (hover #B8171F) · Near-Black #0A0A0A · Warm White #FAF7F1
//   Champagne #F6F1E7 · Gold #8A6D2F · Border #EEE9E0
//   Display: Cormorant Garamond 600 (.font-display) · UI/body: Archivo (.font-archivo)
// ─────────────────────────────────────────────────────────────────────────────

const possessionShort = (p: Property) =>
  p.possession === "Ready" ? "Ready" : p.possessionDate || "Under Const.";

function PropertiesExplorerContent() {
  const searchParams = useSearchParams();
  const initialLocation = searchParams.get("location") || "All";
  const initialType = searchParams.get("type") || "All";

  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedBHK, setSelectedBHK] = useState<string>("All");
  const [selectedPossession, setSelectedPossession] = useState<string>("All");
  const [selectedInvestment, setSelectedInvestment] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(300000000); // up to ₹30 Cr
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isInquirySubmitted, setIsInquirySubmitted] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [liveProperties, setLiveProperties] = useState<Property[]>([]);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [isDebugMode, setIsDebugMode] = useState(false);

  useEffect(() => {
    const isDev = process.env.NODE_ENV === "development";
    const params = new URLSearchParams(window.location.search);
    const hasDebug = params.get("debug") === "true";
    if (isDev || hasDebug) {
      setIsDebugMode(true);
    }
  }, []);

  useEffect(() => {
    async function loadProperties() {
      setIsLoading(true);
      setIsOffline(false);
      setDbError(null);
      try {
        const data = await fetchAllProperties();
        if (data && data.length > 0) {
          setLiveProperties(data);
        } else {
          setIsOffline(true);
          setLiveProperties(defaultProperties);
          const { error } = await supabase.from("properties").select("id").limit(1);
          if (error) {
            setDbError(`Supabase connection failed: ${error.message} (Code: ${error.code})`);
          } else {
            setDbError("Supabase reached successfully, but the 'properties' table has 0 listings.");
          }
        }
      } catch (e: any) {
        setIsOffline(true);
        setLiveProperties(defaultProperties);
        setDbError(`Network/Connection failure: ${e.message || String(e)}`);
      } finally {
        setIsLoading(false);
      }
    }
    loadProperties();
  }, []);

  // Listing view mode: grid (spacious 2-col), list (horizontal), compact (dense 3-col)
  const [viewMode, setViewMode] = useState<"grid" | "list" | "compact">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Active filter count for mobile badge
  const activeFilterCount = (() => {
    let count = 0;
    if (selectedLocation !== "All") count++;
    if (selectedType !== "All") count++;
    if (selectedBHK !== "All") count++;
    if (selectedPossession !== "All") count++;
    if (selectedInvestment !== "All") count++;
    if (maxPrice < 300000000) count++;
    if (selectedAmenities.length > 0) count += selectedAmenities.length;
    if (searchQuery !== "") count++;
    return count;
  })();

  const amenitiesList = [
    "Grand Clubhouse",
    "Multipurpose Hall",
    "Gymnasium",
    "Swimming Pool",
    "24/7 Security",
    "Power Backup",
    "Landscaped Gardens",
    "Children's Play Area",
    "Jogging Track",
    "EV Charging Stations",
    "Indoor Games Room",
    "Tennis Court",
    "Badminton Court",
    "Cricket Practice Net",
    "CCTV Surveillance",
    "Gated Community Access Control",
    "Central Park",
    "Co-working Spaces",
    "Guest Rooms",
    "Spa & Sauna",
    "Pet Park",
    "Mini Theatre",
    "Banquet Hall",
    "Yoga & Meditation Deck",
    "Cycling Track",
    "Visitor Parking",
    "Café & Lounge Areas",
    "Toddler Zone"
  ];

  // Load favorites from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("nexhouz_favorites");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Sync with search queries from landing page
  useEffect(() => {
    if (initialLocation !== "All") setSelectedLocation(initialLocation);
    if (initialType !== "All") setSelectedType(initialType);
  }, [initialLocation, initialType]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (openDropdown && !target.closest(".relative")) {
        setOpenDropdown(null);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [openDropdown]);

  // Reset Filters
  const resetFilters = () => {
    setSelectedLocation("All");
    setSelectedType("All");
    setSelectedBHK("All");
    setSelectedPossession("All");
    setSelectedInvestment("All");
    setMaxPrice(300000000);
    setSelectedAmenities([]);
    setSearchQuery("");
  };

  const handleAmenityToggle = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem("nexhouz_favorites", JSON.stringify(next));
      return next;
    });
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitLead({
      propertyId: selectedProperty?.id,
      name: inquiryForm.name,
      email: inquiryForm.email,
      phone: inquiryForm.phone,
      notes: inquiryForm.notes,
      leadType: "property_inquiry"
    });
    if (success) {
      setIsInquirySubmitted(true);
      setTimeout(() => {
        setSelectedProperty(null);
        setIsInquirySubmitted(false);
        setInquiryForm({ name: "", email: "", phone: "", notes: "" });
      }, 2500);
    }
  };

  // Filtering Logic
  const filteredProperties = liveProperties.filter((prop) => {
    const matchLocation = selectedLocation === "All" || prop.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchType = selectedType === "All" || prop.type === selectedType;
    const matchBHK = selectedBHK === "All" || prop.bhk === parseInt(selectedBHK);
    const matchPossession = selectedPossession === "All" || prop.possession === selectedPossession;
    const matchInvestment = selectedInvestment === "All" || prop.investmentType === selectedInvestment;
    const matchPrice = prop.price <= maxPrice;
    const matchSearch = searchQuery === "" ||
      prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.architect.toLowerCase().includes(searchQuery.toLowerCase());

    const matchAmenities = selectedAmenities.length === 0 ||
      selectedAmenities.every((amenity) => prop.amenities.includes(amenity));

    return matchLocation && matchType && matchBHK && matchPossession && matchInvestment && matchPrice && matchSearch && matchAmenities;
  });

  const formatPrice = (price: number) => {
    return `₹${(price / 10000000).toFixed(1)} Cr`;
  };

  // Shared filter dropdown option data
  const filterConfigs: {
    key: string;
    label: string;
    selected: string;
    setSelected: (v: string) => void;
    display: string;
    options: { value: string; label: string }[];
  }[] = [
    {
      key: "location",
      label: "Location",
      selected: selectedLocation,
      setSelected: setSelectedLocation,
      display: selectedLocation === "All" ? "All Locations" : selectedLocation,
      options: [
        { value: "All", label: "All Locations" },
        { value: "Kokapet", label: "Kokapet" },
        { value: "Jubilee Hills", label: "Jubilee Hills" },
        { value: "Financial District", label: "Financial District" },
        { value: "Narsingi", label: "Narsingi" },
        { value: "Tellapur", label: "Tellapur" },
        { value: "Gandipet", label: "Gandipet" },
        { value: "Madhapur", label: "Madhapur" },
        { value: "Gachibowli", label: "Gachibowli" }
      ]
    },
    {
      key: "type",
      label: "Property Type",
      selected: selectedType,
      setSelected: setSelectedType,
      display:
        selectedType === "All"
          ? "All Types"
          : selectedType === "Plot"
          ? "Plots"
          : selectedType === "Villa"
          ? "Villas"
          : selectedType === "Apartment"
          ? "Apartments"
          : selectedType,
      options: [
        { value: "All", label: "All Types" },
        { value: "Apartment", label: "Apartments" },
        { value: "Villa", label: "Villas" },
        { value: "Plot", label: "Plots" },
        { value: "Commercial", label: "Commercial" }
      ]
    },
    {
      key: "bhk",
      label: "Bedrooms (BHK)",
      selected: selectedBHK,
      setSelected: setSelectedBHK,
      display: selectedBHK === "All" ? "All configurations" : `${selectedBHK} BHK`,
      options: [
        { value: "All", label: "All configurations" },
        { value: "3", label: "3 BHK" },
        { value: "4", label: "4 BHK" },
        { value: "5", label: "5 BHK" },
        { value: "6", label: "6 BHK" }
      ]
    },
    {
      key: "possession",
      label: "Move-In Status",
      selected: selectedPossession,
      setSelected: setSelectedPossession,
      display:
        selectedPossession === "All"
          ? "All statuses"
          : selectedPossession === "Ready"
          ? "Ready to Move"
          : selectedPossession,
      options: [
        { value: "All", label: "All statuses" },
        { value: "Ready", label: "Ready to Move" },
        { value: "Under Construction", label: "Under Construction" }
      ]
    },
    {
      key: "investment",
      label: "Investment Goal",
      selected: selectedInvestment,
      setSelected: setSelectedInvestment,
      display: selectedInvestment === "All" ? "All profiles" : selectedInvestment,
      options: [
        { value: "All", label: "All profiles" },
        { value: "Capital Appreciation", label: "Capital Appreciation" },
        { value: "High-Yield Rental", label: "High-Yield Rental" },
        { value: "Generational Estate", label: "Generational Estate" }
      ]
    }
  ];

  return (
    <>
      {/* ========================================== */}
      {/* PAGE HEADER BAND                           */}
      {/* ========================================== */}
      <section className={`${SECTION_X} pt-10 pb-8 lg:pt-16 lg:pb-12 bg-[#FAF7F1] border-b border-[#EEE9E0]`}>
        <div className={`${CONTAINER} flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-10`}>
          <div className="max-w-[680px]">
            <Eyebrow>Discovery Index</Eyebrow>
            <h1 className="font-display font-semibold text-[32px] md:text-[44px] lg:text-[48px] leading-[1.2] lg:leading-[1.15] text-[#0A0A0A] mt-3 lg:mt-4 text-balance">
              Find Your Dream Home in Hyderabad
            </h1>
            <p className="text-[15px] lg:text-base leading-[1.65] text-[#57534a] mt-3 max-w-xl">
              Browse our highly audited, RERA-clear curation of Hyderabad&apos;s most premium villas, penthouses, and estates.
            </p>
          </div>

          {/* Dynamic Search Box */}
          <div className="relative w-full lg:w-[340px] shrink-0">
            <input
              type="text"
              placeholder="Search architects, locations…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-[1.5px] border-[#e0d9cb] rounded-[10px] pl-11 pr-10 py-4 text-base font-medium text-[#0A0A0A] placeholder-[#948d7c] focus:outline-none focus:border-[#D31E28] transition-colors"
            />
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#948d7c]" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#948d7c] hover:text-[#0A0A0A] transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* EXPLORER BODY                              */}
      {/* ========================================== */}
      <section className={`${SECTION_X} py-8 lg:py-12 bg-white`}>
        <div className={CONTAINER}>

          {/* On Mobile/Tablet: Collapsible Filter Trigger Bar */}
          <div className="lg:hidden flex items-center justify-between gap-4 p-3 bg-white border border-[#EEE9E0] rounded-2xl shadow-[0_1px_3px_rgba(30,25,15,0.04)] mb-6">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 text-xs font-bold text-[#0A0A0A] uppercase tracking-wider px-4 py-2.5 border-[1.5px] border-[#e0d9cb] rounded-[10px] hover:border-[#0A0A0A] transition-colors cursor-pointer"
            >
              <SlidersHorizontal size={12} className="text-[#D31E28]" />
              <span>{showMobileFilters ? "Hide Filters" : "Show Filters"}</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#D31E28] text-white flex items-center justify-center text-[11px] font-bold ml-1">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-3">
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs tracking-wider font-bold text-[#948d7c] hover:text-[#D31E28] uppercase transition-colors cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10 items-start">

            {/* ========================================== */}
            {/* SIDEBAR FILTERS                            */}
            {/* ========================================== */}
            <aside className={`${showMobileFilters ? "block" : "hidden"} lg:block bg-white border border-[#EEE9E0] rounded-2xl p-5 lg:p-6 space-y-5 lg:sticky lg:top-6 shrink-0 lg:max-h-[calc(100vh-48px)] lg:overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#e0d9cb] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [-ms-overflow-style:none] [scrollbar-width:thin]`}>

              <div className="flex items-center justify-between border-b border-[#EEE9E0] pb-4">
                <div className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.1em] text-[#0A0A0A] uppercase">
                  <SlidersHorizontal size={14} className="text-[#D31E28]" />
                  <span>Filters</span>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-xs tracking-wider font-bold text-[#948d7c] hover:text-[#D31E28] uppercase flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw size={11} />
                  <span>Reset</span>
                </button>
              </div>

              {/* Dropdown Filter Groups */}
              {filterConfigs.map((f) => (
                <div key={f.key} className="relative space-y-2 border-b border-[#f0ebe1] pb-5">
                  <label className="text-[13px] font-semibold tracking-[0.1em] uppercase text-[#948d7c]">{f.label}</label>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === f.key ? null : f.key);
                    }}
                    className="w-full flex items-center justify-between bg-white border-[1.5px] border-[#e0d9cb] hover:border-[#0A0A0A] px-4 py-3 rounded-[10px] text-[15px] font-medium text-[#0A0A0A] transition-colors cursor-pointer relative z-10"
                  >
                    <span className="truncate">{f.display}</span>
                    <ChevronDown
                      size={14}
                      className={`text-[#948d7c] shrink-0 transition-transform duration-200 ${openDropdown === f.key ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {openDropdown === f.key && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#EEE9E0] rounded-2xl shadow-[0_18px_50px_rgba(30,25,15,0.14)] p-2 z-30 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#e0d9cb] [&::-webkit-scrollbar-thumb]:rounded-full"
                      >
                        {f.options.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              f.setSelected(opt.value);
                              setOpenDropdown(null);
                            }}
                            className={`w-full text-left px-3 py-2.5 text-[15px] font-medium rounded-xl transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                              f.selected === opt.value
                                ? "bg-[#0A0A0A] text-white"
                                : "text-[#0A0A0A] hover:bg-[#FAF7F1]"
                            }`}
                          >
                            <span>{opt.label}</span>
                            {f.selected === opt.value && <Check size={12} className="shrink-0" strokeWidth={3} />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Dynamic Price Range Selector */}
              <div className="space-y-3 border-b border-[#f0ebe1] pb-5">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-semibold tracking-[0.1em] uppercase text-[#948d7c]">Maximum Price</span>
                  <span className="text-[15px] font-bold text-[#D31E28]">₹{(maxPrice / 10000000).toFixed(1)} Cr</span>
                </div>
                <input
                  type="range"
                  min={30000000}
                  max={300000000}
                  step={5000000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full h-1 bg-[#EEE9E0] appearance-none cursor-pointer accent-[#D31E28] rounded-full"
                />
                <div className="flex justify-between text-xs font-semibold text-[#948d7c]">
                  <span>₹3 Cr</span>
                  <span>₹30 Cr</span>
                </div>
              </div>

              {/* Amenities Multi-Checkboxes */}
              <div className="space-y-3">
                <label className="text-[13px] font-semibold tracking-[0.1em] uppercase text-[#948d7c] block">Features &amp; Amenities</label>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#e0d9cb] [&::-webkit-scrollbar-thumb]:rounded-full">
                  {amenitiesList.map((amenity) => {
                    const checked = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        onClick={() => handleAmenityToggle(amenity)}
                        className="w-full flex items-center gap-2.5 text-sm font-medium text-[#57534a] hover:text-[#0A0A0A] text-left focus:outline-none cursor-pointer py-1 transition-colors"
                      >
                        {checked ? (
                          <CheckSquare size={15} className="text-[#D31E28] shrink-0" />
                        ) : (
                          <Square size={15} className="text-[#c9c2b2] shrink-0" />
                        )}
                        <span className="line-clamp-1">{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </aside>

            {/* ========================================== */}
            {/* PROPERTIES GRID SECTION                    */}
            {/* ========================================== */}
            <section className="lg:col-span-3 space-y-6">

              {/* Header Row: Result counter + Three View Options Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EEE9E0] pb-4">
                <span className="text-[11.5px] lg:text-xs tracking-widest uppercase text-[#948d7c] font-bold">
                  Query Results: {filteredProperties.length} Estates Found
                </span>

                {/* 3-View Modes Selector */}
                <div className="flex items-center gap-1.5 p-1 bg-white border border-[#EEE9E0] rounded-full w-fit shadow-[0_1px_3px_rgba(30,25,15,0.04)] relative shrink-0">
                  {[
                    { mode: "grid", icon: LayoutGrid, label: "Grid View" },
                    { mode: "list", icon: List, label: "List View" },
                    { mode: "compact", icon: Grid3X3, label: "Dense View" }
                  ].map((viewOpt) => {
                    const Icon = viewOpt.icon;
                    const active = viewMode === viewOpt.mode;
                    return (
                      <button
                        key={viewOpt.mode}
                        onClick={() => setViewMode(viewOpt.mode as any)}
                        className={`p-2 rounded-full transition-colors cursor-pointer flex items-center justify-center relative ${
                          active ? "bg-[#0A0A0A] text-white" : "text-[#948d7c] hover:text-[#0A0A0A]"
                        }`}
                        title={viewOpt.label}
                        aria-label={viewOpt.label}
                      >
                        <Icon size={14} className="stroke-[2]" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {isOffline && (
                <div className="border border-amber-200 bg-amber-50/60 rounded-2xl py-3.5 px-5 flex items-center gap-3">
                  <AlertTriangle size={17} className="text-amber-600 shrink-0" />
                  <p className="text-[13.5px] text-amber-900 font-medium">
                    We are currently experiencing connection latency with our database server. Displaying verified local properties.
                  </p>
                  {isDebugMode && dbError && (
                    <span className="text-[11px] text-red-700 font-mono bg-red-50 border border-red-100 px-2 py-1 rounded-lg max-w-xs truncate">
                      {dbError}
                    </span>
                  )}
                </div>
              )}

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <div className="w-9 h-9 border-4 border-[#D31E28] border-t-transparent rounded-full animate-spin" />
                  <p className="text-[13px] text-[#948d7c] font-semibold tracking-[0.18em] uppercase">Loading Estates…</p>
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="border border-[#EEE9E0] rounded-2xl py-16 lg:py-20 px-6 flex flex-col items-center justify-center text-center gap-5 bg-white">
                  <div className="w-14 h-14 rounded-full bg-[#faf0f0] flex items-center justify-center text-[#D31E28]">
                    <Building size={24} className="stroke-[1.8]" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-2xl lg:text-[28px] text-[#0A0A0A]">No Architectural Matches</h3>
                    <p className="text-sm lg:text-[15px] text-[#6b6659] leading-relaxed max-w-sm mx-auto mt-2">
                      No matching estates were found in the registry using the selected metrics. Broaden your search criteria or reset filters.
                    </p>
                  </div>
                  <button
                    onClick={resetFilters}
                    className="bg-[#0A0A0A] hover:bg-[#D31E28] text-white text-xs font-bold uppercase tracking-wider px-8 py-4 rounded-full transition-colors cursor-pointer"
                  >
                    Reset Search Filters
                  </button>
                </div>
              ) : (
                <motion.div
                  layout
                  className={
                    viewMode === "list"
                      ? "space-y-4 lg:space-y-6"
                      : viewMode === "compact"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
                      : "grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6"
                  }
                >
                  <AnimatePresence mode="popLayout">
                    {filteredProperties.map((property, idx) => {
                      const isFavorited = favorites.includes(property.id);

                      // ==========================================================
                      // 1. HORIZONTAL LIST VIEW LAYOUT
                      // ==========================================================
                      if (viewMode === "list") {
                        return (
                          <motion.div
                            layout
                            key={property.id}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35, delay: (idx % 2) * 0.05 }}
                            className="border border-[#EEE9E0] rounded-2xl overflow-hidden bg-white w-full flex flex-col md:flex-row group shadow-[0_1px_3px_rgba(30,25,15,0.04)] hover:shadow-[0_10px_30px_rgba(30,25,15,0.08)] transition-shadow"
                          >
                            {/* Image Frame */}
                            <Link
                              href={`/properties/${property.slug}`}
                              className="relative block w-full md:w-[38%] aspect-[4/3] md:aspect-auto md:min-h-[280px] shrink-0 overflow-hidden bg-[#efeae1]"
                            >
                              <img
                                src={property.image}
                                alt={property.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <span className="absolute left-3.5 top-3.5 bg-emerald-500 text-white rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                                <ShieldCheck size={11} /> 100% Legal Clear
                              </span>
                              <button
                                onClick={(e) => toggleFavorite(property.id, e)}
                                aria-label="Save property"
                                className="absolute right-3.5 top-3.5 w-9 h-9 rounded-full bg-white/95 shadow-sm flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                              >
                                <Heart
                                  size={15}
                                  className={isFavorited ? "fill-[#D31E28] text-[#D31E28]" : "text-[#57534a]"}
                                />
                              </button>
                            </Link>

                            {/* Content metrics */}
                            <div className="p-5 lg:p-7 flex flex-col flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#948d7c] truncate">
                                  {property.location}
                                </span>
                                <span className="text-[17px] lg:text-lg font-bold text-[#D31E28] whitespace-nowrap">
                                  {formatPrice(property.price)}
                                </span>
                              </div>
                              <Link
                                href={`/properties/${property.slug}`}
                                className="text-[17px] lg:text-[19px] font-bold leading-snug text-[#D31E28] hover:text-[#B8171F] transition-colors mt-2.5 line-clamp-2"
                              >
                                {property.title}
                              </Link>
                              <p className="text-[13.5px] lg:text-sm text-[#6b6659] leading-relaxed line-clamp-2 mt-2">
                                {property.description}
                              </p>

                              <div className="mt-auto pt-4">
                                <div className="border-t border-[#EEE9E0] pt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div className="flex items-center gap-3 lg:gap-4 text-[11.5px] lg:text-xs font-bold uppercase tracking-widest text-[#948d7c]">
                                    <span>{property.bhk} BHK</span>
                                    <span className="text-[#e0d9cb]">|</span>
                                    <span>{property.area}</span>
                                    <span className="text-[#e0d9cb]">|</span>
                                    <span>{possessionShort(property)}</span>
                                  </div>
                                  <button
                                    onClick={() => setSelectedProperty(property)}
                                    className="inline-flex items-center justify-center gap-1.5 bg-[#0A0A0A] hover:bg-[#D31E28] text-white text-xs font-bold uppercase tracking-wider px-7 py-3.5 rounded-full cursor-pointer transition-colors shrink-0"
                                  >
                                    Initiate Safe Inquiry <ArrowRight size={11} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      }

                      // ==========================================================
                      // 2. DENSE / COMPACT GRID VIEW LAYOUT
                      // ==========================================================
                      if (viewMode === "compact") {
                        return (
                          <motion.div
                            layout
                            key={property.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35, delay: (idx % 3) * 0.05 }}
                            className="border border-[#EEE9E0] rounded-2xl overflow-hidden bg-white h-full flex flex-col group shadow-[0_1px_3px_rgba(30,25,15,0.04)] hover:shadow-[0_10px_30px_rgba(30,25,15,0.08)] transition-shadow"
                          >
                            {/* Image Frame */}
                            <Link
                              href={`/properties/${property.slug}`}
                              className="relative block aspect-[4/3] overflow-hidden bg-[#efeae1]"
                            >
                              <img
                                src={property.image}
                                alt={property.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <span className="absolute left-3.5 top-3.5 bg-emerald-500 text-white rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                                <ShieldCheck size={11} /> 100% Legal Clear
                              </span>
                              <button
                                onClick={(e) => toggleFavorite(property.id, e)}
                                aria-label="Save property"
                                className="absolute right-3.5 top-3.5 w-9 h-9 rounded-full bg-white/95 shadow-sm flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                              >
                                <Heart
                                  size={15}
                                  className={isFavorited ? "fill-[#D31E28] text-[#D31E28]" : "text-[#57534a]"}
                                />
                              </button>
                            </Link>

                            {/* Content metrics */}
                            <div className="p-4 lg:p-5 flex flex-col flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#948d7c] truncate">
                                  {property.location.split(",")[0]}
                                </span>
                                <span className="text-[15px] font-bold text-[#D31E28] whitespace-nowrap">
                                  {formatPrice(property.price)}
                                </span>
                              </div>
                              <Link
                                href={`/properties/${property.slug}`}
                                className="text-[15px] lg:text-base font-bold leading-snug text-[#D31E28] hover:text-[#B8171F] transition-colors mt-2 line-clamp-1"
                              >
                                {property.title}
                              </Link>

                              <div className="mt-auto pt-3.5">
                                <div className="border-t border-[#EEE9E0] pt-3 flex items-center justify-between text-[10.5px] lg:text-[11px] font-bold uppercase tracking-widest text-[#948d7c]">
                                  <span>{property.bhk} BHK</span>
                                  <span className="text-[#e0d9cb]">|</span>
                                  <span>{property.area.split(" ")[0]} Sq Ft</span>
                                  <span className="text-[#e0d9cb]">|</span>
                                  <span>{possessionShort(property)}</span>
                                </div>
                                <button
                                  onClick={() => setSelectedProperty(property)}
                                  className="w-full bg-[#0A0A0A] hover:bg-[#D31E28] text-white text-[11px] font-bold uppercase tracking-wider py-3 rounded-full cursor-pointer transition-colors mt-3.5"
                                >
                                  Initiate Safe Inquiry
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      }

                      // ==========================================================
                      // 3. SPACIOUS STANDARD GRID VIEW LAYOUT (DEFAULT)
                      // ==========================================================
                      return (
                        <motion.div
                          layout
                          key={property.id}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: (idx % 2) * 0.08 }}
                          className="border border-[#EEE9E0] rounded-2xl overflow-hidden bg-white h-full flex flex-col group shadow-[0_1px_3px_rgba(30,25,15,0.04)] hover:shadow-[0_10px_30px_rgba(30,25,15,0.08)] transition-shadow"
                        >
                          {/* Image frame */}
                          <Link
                            href={`/properties/${property.slug}`}
                            className="relative block aspect-[4/3] overflow-hidden bg-[#efeae1]"
                          >
                            <img
                              src={property.image}
                              alt={property.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <span className="absolute left-3.5 top-3.5 bg-emerald-500 text-white rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                              <ShieldCheck size={11} /> 100% Legal Clear
                            </span>
                            <button
                              onClick={(e) => toggleFavorite(property.id, e)}
                              aria-label="Save property"
                              className="absolute right-3.5 top-3.5 w-9 h-9 rounded-full bg-white/95 shadow-sm flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                            >
                              <Heart
                                size={15}
                                className={isFavorited ? "fill-[#D31E28] text-[#D31E28]" : "text-[#57534a]"}
                              />
                            </button>
                          </Link>

                          {/* Metrics detail */}
                          <div className="p-5 lg:p-6 flex flex-col flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#948d7c]">
                                {property.location.split(",")[0]}
                              </span>
                              <span className="text-[17px] lg:text-lg font-bold text-[#D31E28] whitespace-nowrap">
                                {formatPrice(property.price)}
                              </span>
                            </div>
                            <Link
                              href={`/properties/${property.slug}`}
                              className="text-[17px] lg:text-[19px] font-bold leading-snug text-[#D31E28] hover:text-[#B8171F] transition-colors mt-2.5 line-clamp-2"
                            >
                              {property.title}
                            </Link>
                            <p className="text-[13.5px] lg:text-sm text-[#6b6659] leading-relaxed line-clamp-2 mt-2">
                              {property.description}
                            </p>
                            <div className="mt-auto pt-4">
                              <div className="border-t border-[#EEE9E0] pt-3.5 flex items-center justify-between text-[11.5px] lg:text-xs font-bold uppercase tracking-widest text-[#948d7c]">
                                <span>{property.bhk} BHK</span>
                                <span className="text-[#e0d9cb]">|</span>
                                <span>{property.area}</span>
                                <span className="text-[#e0d9cb]">|</span>
                                <span>{possessionShort(property)}</span>
                              </div>
                              <button
                                onClick={() => setSelectedProperty(property)}
                                className="w-full bg-[#0A0A0A] hover:bg-[#D31E28] text-white text-xs font-bold uppercase tracking-wider py-4 rounded-full cursor-pointer transition-colors mt-4"
                              >
                                Initiate Safe Inquiry
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              )}

            </section>

          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* INQUIRY MODAL (SLIDE-IN PANEL)             */}
      {/* ========================================== */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-50 flex justify-end font-archivo">

            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProperty(null)}
              className="absolute inset-0 bg-black cursor-pointer"
            />

            {/* Content Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              className="relative w-full max-w-md bg-white h-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-6 md:p-8 flex flex-col justify-between overflow-y-auto z-10"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-3 border-b border-[#EEE9E0] pb-5">
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8A6D2F]">
                      Inquiry Protocol
                    </span>
                    <h3 className="text-[20px] lg:text-[22px] font-semibold text-[#0A0A0A] line-clamp-1 mt-1">
                      {selectedProperty.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedProperty(null)}
                    aria-label="Close"
                    className="p-2 hover:bg-[#FAF7F1] text-[#57534a] hover:text-[#0A0A0A] rounded-full transition-colors cursor-pointer shrink-0"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Property Detail Card */}
                <div className="flex items-center gap-3 p-3 bg-[#FAF7F1] rounded-xl border border-[#EEE9E0]">
                  <img
                    src={selectedProperty.image}
                    alt={selectedProperty.title}
                    className="w-14 h-14 object-cover rounded-lg shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-[#0A0A0A] line-clamp-1">{selectedProperty.title}</p>
                    <p className="text-[13px] text-[#6b6659] line-clamp-1">{selectedProperty.location.split(",")[0]}</p>
                    <p className="text-[15px] font-bold text-[#D31E28] mt-0.5">
                      {formatPrice(selectedProperty.price)}
                    </p>
                  </div>
                </div>

                {/* Inquiry Form */}
                <AnimatePresence mode="wait">
                  {!isInquirySubmitted ? (
                    <motion.form
                      key="form"
                      onSubmit={handleInquirySubmit}
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold tracking-[0.1em] uppercase text-[#948d7c]">Full Name*</label>
                        <input
                          type="text"
                          required
                          value={inquiryForm.name}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                          className="w-full bg-white border-[1.5px] border-[#e0d9cb] rounded-[10px] px-[18px] py-4 text-base text-[#0A0A0A] placeholder-[#948d7c] focus:outline-none focus:border-[#D31E28] transition-colors"
                          placeholder="e.g. Rahul Sharma"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold tracking-[0.1em] uppercase text-[#948d7c]">Email*</label>
                        <input
                          type="email"
                          required
                          value={inquiryForm.email}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                          className="w-full bg-white border-[1.5px] border-[#e0d9cb] rounded-[10px] px-[18px] py-4 text-base text-[#0A0A0A] placeholder-[#948d7c] focus:outline-none focus:border-[#D31E28] transition-colors"
                          placeholder="e.g. rahul.sharma@gmail.com"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold tracking-[0.1em] uppercase text-[#948d7c]">Mobile Number*</label>
                        <input
                          type="tel"
                          required
                          value={inquiryForm.phone}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                          className="w-full bg-white border-[1.5px] border-[#e0d9cb] rounded-[10px] px-[18px] py-4 text-base text-[#0A0A0A] placeholder-[#948d7c] focus:outline-none focus:border-[#D31E28] transition-colors"
                          placeholder="e.g. +91 98765 43210"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold tracking-[0.1em] uppercase text-[#948d7c]">Notes</label>
                        <textarea
                          rows={4}
                          value={inquiryForm.notes}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, notes: e.target.value })}
                          className="w-full bg-white border-[1.5px] border-[#e0d9cb] rounded-[10px] px-[18px] py-4 text-base text-[#0A0A0A] placeholder-[#948d7c] focus:outline-none focus:border-[#D31E28] transition-colors resize-none"
                          placeholder="e.g. State your specific queries or requirements here."
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#D31E28] hover:bg-[#B8171F] text-white text-[17px] font-semibold py-[18px] rounded-[10px] cursor-pointer shadow-[0_6px_18px_rgba(211,30,40,0.3)] transition-colors"
                      >
                        Submit
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      className="text-center py-8"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="w-14 h-14 rounded-full bg-[#D31E28] flex items-center justify-center mx-auto">
                        <Check size={22} className="text-white" strokeWidth={3} />
                      </div>
                      <div className="text-[22px] font-semibold text-[#0A0A0A] mt-4">Inquiry Authenticated</div>
                      <p className="text-[15px] leading-relaxed text-[#57534a] mt-2 max-w-xs mx-auto">
                        Acquisition briefing verified. A dedicated partner broker will reach out within 4 hours with off-market spatial documentation.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-start gap-2 text-[13px] text-[#948d7c] pt-6 border-t border-[#EEE9E0] mt-6">
                <Info size={13} className="shrink-0 mt-0.5 text-[#D31E28]" />
                <span>
                  All listings are subject to strict KYC procedures and structural verification checks to ensure RERA and title deed authenticity.
                </span>
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </>
  );
}

export default function PropertiesPage() {
  return (
    <div className="font-archivo bg-white">
      <Navbar />
      <main className="min-h-screen">
        <Suspense
          fallback={
            <div className={`${SECTION_X} py-24 text-center`}>
              <p className="text-[13px] text-[#948d7c] font-semibold tracking-[0.18em] uppercase">
                Loading Discovery Index…
              </p>
            </div>
          }
        >
          <PropertiesExplorerContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
