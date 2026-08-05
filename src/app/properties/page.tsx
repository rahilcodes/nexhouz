"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
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
  AlertTriangle,
  ArrowUpDown,
  Filter,
  MapPin,
  Tag,
  Sliders,
  Sparkles
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CONTAINER, SECTION_X, Eyebrow } from "@/components/ui/theme";
import { fetchAllProperties, submitLead } from "@/lib/db";
import { properties as defaultProperties, Property, topAreas } from "@/data/properties";
import { supabase } from "@/lib/supabaseClient";

// Helper for possession formatting
const possessionShort = (p: Property) =>
  p.possession === "Ready" ? "Ready" : p.possessionDate || "Under Const.";

// Parse budget labels from URL or homepage search console
const parseBudgetLabel = (label: string): { min: number; max: number } | null => {
  const amounts = Array.from(label.matchAll(/([\d.]+)\s*(Cr|L)/gi)).map(
    (m) => parseFloat(m[1]) * (m[2].toLowerCase() === "cr" ? 10000000 : 100000)
  );
  if (amounts.length === 0) return null;
  const openEnded = /\+\s*$/.test(label.trim());
  return {
    min: Math.min(...amounts),
    max: openEnded ? Infinity : Math.max(...amounts),
  };
};

function PropertiesExplorerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initial params
  const initialLocation = searchParams.get("location") || "";
  const initialType = searchParams.get("type") || "All";
  const initialBhk = searchParams.get("bhk") || "All";
  const initialPrice = searchParams.get("price") || "";
  const initialSort = searchParams.get("sort") || "featured";

  // Filter State (Multi-location enabled)
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    initialLocation ? [initialLocation] : []
  );
  const [locationSearchInput, setLocationSearchInput] = useState("");
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [selectedBHK, setSelectedBHK] = useState<string>(
    initialBhk !== "All" && initialBhk !== "Any" ? initialBhk.replace("+", "") : "All"
  );
  const [selectedPossession, setSelectedPossession] = useState<string>("All");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(300000000); // up to ₹30 Cr
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>(initialSort);

  // UI States
  const [showAmenitiesAccordion, setShowAmenitiesAccordion] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isInquirySubmitted, setIsInquirySubmitted] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [liveProperties, setLiveProperties] = useState<Property[]>([]);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [isDebugMode, setIsDebugMode] = useState(false);

  const [viewMode, setViewMode] = useState<"grid" | "list" | "compact">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const isDev = process.env.NODE_ENV === "development";
    const params = new URLSearchParams(window.location.search);
    if (isDev || params.get("debug") === "true") {
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
            setDbError(`Supabase connection failed: ${error.message}`);
          } else {
            setDbError("Properties table is empty.");
          }
        }
      } catch (e: any) {
        setIsOffline(true);
        setLiveProperties(defaultProperties);
        setDbError(`Connection error: ${e.message || String(e)}`);
      } finally {
        setIsLoading(false);
      }
    }
    loadProperties();
  }, []);

  // Sync initial search query budget if present
  useEffect(() => {
    const budget = parseBudgetLabel(initialPrice);
    if (budget) {
      setMinPrice(budget.min);
      setMaxPrice(Number.isFinite(budget.max) ? budget.max : 300000000);
    }
  }, [initialPrice]);

  // Load favorites
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

  // Sync URL parameters on filter change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedLocations.length > 0) params.set("location", selectedLocations.join(","));
    if (selectedType !== "All") params.set("type", selectedType);
    if (selectedBHK !== "All") params.set("bhk", selectedBHK);
    if (sortBy !== "featured") params.set("sort", sortBy);
    if (minPrice > 0 || maxPrice < 300000000) {
      params.set("min", minPrice.toString());
      params.set("max", maxPrice.toString());
    }
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState(null, "", newUrl);
  }, [selectedLocations, selectedType, selectedBHK, sortBy, minPrice, maxPrice]);

  // Dynamic available areas with counts
  const availableAreasWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    liveProperties.forEach((p) => {
      const area = p.location.split(",")[0].trim();
      counts[area] = (counts[area] || 0) + 1;
    });

    const sortedAreas = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    return sortedAreas.map((area) => ({
      name: area,
      count: counts[area]
    }));
  }, [liveProperties]);

  const filteredAreaList = useMemo(() => {
    if (!locationSearchInput.trim()) return availableAreasWithCounts;
    return availableAreasWithCounts.filter((item) =>
      item.name.toLowerCase().includes(locationSearchInput.toLowerCase().trim())
    );
  }, [availableAreasWithCounts, locationSearchInput]);

  const amenitiesList = [
    "Grand Clubhouse", "Gymnasium", "Swimming Pool", "24/7 Security",
    "Power Backup", "Landscaped Gardens", "Children's Play Area", "EV Charging Stations",
    "Tennis Court", "Badminton Court", "Co-working Spaces", "Mini Theatre"
  ];

  // Active filter count for badges
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedLocations.length > 0) count += selectedLocations.length;
    if (selectedType !== "All") count++;
    if (selectedBHK !== "All") count++;
    if (selectedPossession !== "All") count++;
    if (maxPrice < 300000000 || minPrice > 0) count++;
    if (selectedAmenities.length > 0) count += selectedAmenities.length;
    if (searchQuery !== "") count++;
    return count;
  }, [selectedLocations, selectedType, selectedBHK, selectedPossession, maxPrice, minPrice, selectedAmenities, searchQuery]);

  // Reset Filters
  const resetFilters = () => {
    setSelectedLocations([]);
    setSelectedType("All");
    setSelectedBHK("All");
    setSelectedPossession("All");
    setMaxPrice(300000000);
    setMinPrice(0);
    setSelectedAmenities([]);
    setSearchQuery("");
    setLocationSearchInput("");
    setSortBy("featured");
  };

  const toggleLocation = (locationName: string) => {
    if (selectedLocations.includes(locationName)) {
      setSelectedLocations(selectedLocations.filter((l) => l !== locationName));
    } else {
      setSelectedLocations([...selectedLocations, locationName]);
    }
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

  // Main Filtering Logic
  const filteredProperties = useMemo(() => {
    let result = liveProperties.filter((prop) => {
      // Multi-location match
      const propArea = prop.location.split(",")[0].trim();
      const matchLocation =
        selectedLocations.length === 0 ||
        selectedLocations.some(
          (loc) => loc.toLowerCase() === propArea.toLowerCase() || prop.location.toLowerCase().includes(loc.toLowerCase())
        );

      const matchType = selectedType === "All" || prop.type === selectedType;
      const matchBHK =
        selectedBHK === "All"
          ? true
          : selectedBHK === "5+"
          ? Number(prop.bhk) >= 5
          : Number(prop.bhk) === parseInt(selectedBHK);

      const matchPossession = selectedPossession === "All" || prop.possession === selectedPossession;
      const matchPrice = prop.price >= minPrice && prop.price <= maxPrice;
      const matchSearch =
        searchQuery === "" ||
        prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.architect.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchAmenities =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((amenity) => prop.amenities.includes(amenity));

      return matchLocation && matchType && matchBHK && matchPossession && matchPrice && matchSearch && matchAmenities;
    });

    // Sorting Logic
    if (sortBy === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [liveProperties, selectedLocations, selectedType, selectedBHK, selectedPossession, minPrice, maxPrice, searchQuery, selectedAmenities, sortBy]);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${parseFloat((price / 10000000).toFixed(2))} Cr`;
    } else {
      return `₹${parseFloat((price / 100000).toFixed(2))} Lakhs`;
    }
  };

  // Quick budget preset helper
  const applyBudgetPreset = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  return (
    <>
      {/* PAGE HEADER */}
      <section className={`${SECTION_X} pt-10 pb-8 lg:pt-14 lg:pb-10 bg-[#FAF7F1] border-b border-[#EEE9E0]`}>
        <div className={`${CONTAINER} flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-10`}>
          <div className="max-w-[680px]">
            <Eyebrow>Verified Real Estate Directory</Eyebrow>
            <h1 className="font-display font-semibold text-[32px] md:text-[44px] lg:text-[48px] leading-[1.2] text-[#0A0A0A] mt-3">
              Explore Hyderabad Luxury Estates
            </h1>
            <p className="text-[15px] lg:text-base leading-[1.65] text-[#57534a] mt-2.5 max-w-xl">
              100% RERA-verified luxury apartments, penthouses, and gated community villas across Hyderabad&apos;s prime corridors.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full lg:w-[380px] shrink-0">
            <input
              type="text"
              placeholder="Search by project name, builder, or area…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-[1.5px] border-[#e0d9cb] rounded-xl pl-11 pr-10 py-3.5 text-sm font-medium text-[#0A0A0A] placeholder-[#948d7c] focus:outline-none focus:border-[#D31E28] transition-colors shadow-sm"
            />
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#948d7c]" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#948d7c] hover:text-[#0A0A0A] transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* EXPLORER BODY */}
      <section className={`${SECTION_X} py-8 lg:py-12 bg-white`}>
        <div className={CONTAINER}>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between gap-4 p-3 bg-white border border-[#EEE9E0] rounded-2xl shadow-sm mb-6">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-2 text-xs font-bold text-[#0A0A0A] uppercase tracking-wider px-4 py-2.5 bg-[#FAF7F1] border border-[#e0d9cb] rounded-xl cursor-pointer"
            >
              <SlidersHorizontal size={14} className="text-[#D31E28]" />
              <span>Filters</span>
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
                  className="text-xs tracking-wider font-bold text-[#948d7c] hover:text-[#D31E28] uppercase transition-colors"
                >
                  Reset All
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10 items-start">

            {/* SIDEBAR FILTERS (Clean, Independent Scroll Sticky Sidebar) */}
            <aside className="hidden lg:block bg-white border border-[#EEE9E0] rounded-2xl p-5 space-y-4 sticky top-20 max-h-[calc(100vh-90px)] overflow-y-auto shrink-0 shadow-sm [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#e0d9cb] hover:[&::-webkit-scrollbar-thumb]:bg-[#D31E28] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent pr-1">

              {/* Sidebar Header */}
              <div className="flex items-center justify-between border-b border-[#EEE9E0] pb-4">
                <div className="flex items-center gap-2.5">
                  <SlidersHorizontal size={16} className="text-[#D31E28]" />
                  <span className="text-sm font-bold tracking-wider text-[#0A0A0A] uppercase">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="bg-[#D31E28] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-xs font-bold text-[#948d7c] hover:text-[#D31E28] uppercase flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RotateCcw size={12} />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* 1. Property Type Chips */}
              <div className="space-y-2.5 border-b border-[#EEE9E0] pb-5">
                <label className="text-xs font-bold tracking-wider uppercase text-[#948d7c] block">Property Type</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { value: "All", label: "All Types" },
                    { value: "Apartment", label: "Apartments" },
                    { value: "Villa", label: "Villas" },
                    { value: "Plot", label: "Plots" }
                  ].map((t) => {
                    const active = selectedType === t.value;
                    return (
                      <button
                        key={t.value}
                        onClick={() => setSelectedType(t.value)}
                        className={`px-3 py-2 text-xs font-bold rounded-xl transition-all text-center cursor-pointer border ${
                          active
                            ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                            : "bg-[#FAF7F1] text-[#57534a] border-[#e0d9cb] hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
                        }`}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. BHK Multi-Choice Chips */}
              <div className="space-y-2.5 border-b border-[#EEE9E0] pb-5">
                <label className="text-xs font-bold tracking-wider uppercase text-[#948d7c] block">Bedrooms (BHK)</label>
                <div className="flex flex-wrap gap-1.5">
                  {["All", "1", "2", "3", "4", "5+"].map((bhk) => {
                    const active = selectedBHK === bhk;
                    return (
                      <button
                        key={bhk}
                        onClick={() => setSelectedBHK(bhk)}
                        className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                          active
                            ? "bg-[#D31E28] text-white border-[#D31E28]"
                            : "bg-[#FAF7F1] text-[#57534a] border-[#e0d9cb] hover:border-[#D31E28] hover:text-[#D31E28]"
                        }`}
                      >
                        {bhk === "All" ? "Any" : `${bhk} BHK`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Location Multi-Select & Search */}
              <div className="space-y-3 border-b border-[#EEE9E0] pb-5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold tracking-wider uppercase text-[#948d7c]">Locations</label>
                  {selectedLocations.length > 0 && (
                    <button
                      onClick={() => setSelectedLocations([])}
                      className="text-[11px] font-bold text-[#D31E28] hover:underline"
                    >
                      Clear ({selectedLocations.length})
                    </button>
                  )}
                </div>

                {/* Quick Area Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search areas (e.g. Kondapur, Kokapet)…"
                    value={locationSearchInput}
                    onChange={(e) => setLocationSearchInput(e.target.value)}
                    className="w-full bg-[#FAF7F1] border border-[#e0d9cb] rounded-lg pl-8 pr-3 py-2 text-xs font-medium text-[#0A0A0A] placeholder-[#948d7c] focus:outline-none focus:border-[#D31E28]"
                  />
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#948d7c]" />
                </div>

                {/* Locations Checkbox List */}
                <div className="space-y-1 max-h-44 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#e0d9cb] [&::-webkit-scrollbar-thumb]:rounded-full">
                  {filteredAreaList.map((loc) => {
                    const isChecked = selectedLocations.includes(loc.name);
                    return (
                      <button
                        key={loc.name}
                        onClick={() => toggleLocation(loc.name)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          isChecked ? "bg-[#FAF7F1] text-[#D31E28]" : "text-[#57534a] hover:bg-[#FAF7F1] hover:text-[#0A0A0A]"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {isChecked ? (
                            <CheckSquare size={14} className="text-[#D31E28] shrink-0" />
                          ) : (
                            <Square size={14} className="text-[#c9c2b2] shrink-0" />
                          )}
                          <span className="truncate">{loc.name}</span>
                        </div>
                        <span className="text-[10px] text-[#948d7c] bg-white border border-[#EEE9E0] px-1.5 py-0.5 rounded-md shrink-0 ml-1">
                          {loc.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Budget Range & Presets */}
              <div className="space-y-3 border-b border-[#EEE9E0] pb-5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold tracking-wider uppercase text-[#948d7c]">Budget Range</label>
                  <span className="text-xs font-bold text-[#D31E28]">
                    {minPrice > 0 ? formatPrice(minPrice) : "₹0"} – {formatPrice(maxPrice)}
                  </span>
                </div>

                {/* Quick Budget Preset Chips */}
                <div className="flex flex-wrap gap-1">
                  {[
                    { label: "< ₹1 Cr", min: 0, max: 10000000 },
                    { label: "₹1–2 Cr", min: 10000000, max: 20000000 },
                    { label: "₹2–3 Cr", min: 20000000, max: 30000000 },
                    { label: "₹3–5 Cr", min: 30000000, max: 50000000 },
                    { label: "₹5 Cr+", min: 50000000, max: 300000000 }
                  ].map((preset) => {
                    const active = minPrice === preset.min && maxPrice === preset.max;
                    return (
                      <button
                        key={preset.label}
                        onClick={() => applyBudgetPreset(preset.min, preset.max)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          active
                            ? "bg-[#D31E28] text-white border-[#D31E28]"
                            : "bg-[#FAF7F1] text-[#57534a] border-[#e0d9cb] hover:border-[#D31E28] hover:text-[#D31E28]"
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                {/* Slider */}
                <div className="space-y-2 pt-1">
                  <input
                    type="range"
                    min={0}
                    max={300000000}
                    step={2500000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-[#EEE9E0] appearance-none cursor-pointer accent-[#D31E28] rounded-full"
                  />
                  <div className="flex justify-between text-[11px] font-semibold text-[#948d7c]">
                    <span>₹0</span>
                    <span>₹15 Cr</span>
                    <span>₹30 Cr</span>
                  </div>
                </div>
              </div>

              {/* 5. Move-In Status */}
              <div className="space-y-2 border-b border-[#EEE9E0] pb-5">
                <label className="text-xs font-bold tracking-wider uppercase text-[#948d7c] block">Move-In Status</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { value: "All", label: "All" },
                    { value: "Ready", label: "Ready" },
                    { value: "Under Construction", label: "Under Const." }
                  ].map((s) => {
                    const active = selectedPossession === s.value;
                    return (
                      <button
                        key={s.value}
                        onClick={() => setSelectedPossession(s.value)}
                        className={`px-2 py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer border text-center ${
                          active
                            ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                            : "bg-[#FAF7F1] text-[#57534a] border-[#e0d9cb] hover:border-[#0A0A0A]"
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Accordion Amenities */}
              <div>
                <button
                  onClick={() => setShowAmenitiesAccordion(!showAmenitiesAccordion)}
                  className="w-full flex items-center justify-between text-xs font-bold tracking-wider uppercase text-[#948d7c] hover:text-[#0A0A0A] py-1 transition-colors cursor-pointer"
                >
                  <span>Features & Amenities ({selectedAmenities.length})</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${showAmenitiesAccordion ? "rotate-180 text-[#D31E28]" : ""}`}
                  />
                </button>
                {showAmenitiesAccordion && (
                  <div className="space-y-1.5 pt-3 max-h-48 overflow-y-auto pr-1">
                    {amenitiesList.map((amenity) => {
                      const checked = selectedAmenities.includes(amenity);
                      return (
                        <button
                          key={amenity}
                          onClick={() => handleAmenityToggle(amenity)}
                          className="w-full flex items-center gap-2 text-xs font-medium text-[#57534a] hover:text-[#0A0A0A] text-left cursor-pointer py-1"
                        >
                          {checked ? (
                            <CheckSquare size={14} className="text-[#D31E28] shrink-0" />
                          ) : (
                            <Square size={14} className="text-[#c9c2b2] shrink-0" />
                          )}
                          <span className="truncate">{amenity}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </aside>

            {/* PROPERTIES GRID & RESULTS PANEL */}
            <section className="lg:col-span-3 space-y-5">

              {/* Top Controls: Active Filter Chips + Sort Dropdown + View Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EEE9E0] pb-4">
                
                {/* Result count */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold tracking-widest uppercase text-[#0A0A0A]">
                    {filteredProperties.length} Properties Available
                  </span>
                </div>

                {/* Right controls: Sort + Layout toggle */}
                <div className="flex items-center gap-3">

                  {/* Sort By Dropdown */}
                  <div className="flex items-center gap-2 bg-[#FAF7F1] border border-[#e0d9cb] rounded-xl px-3 py-2">
                    <ArrowUpDown size={13} className="text-[#D31E28]" />
                    <span className="text-xs font-bold text-[#948d7c] hidden sm:inline">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-xs font-bold text-[#0A0A0A] focus:outline-none cursor-pointer"
                    >
                      <option value="featured">Featured First</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>

                  {/* 3 View Mode Toggle */}
                  <div className="flex items-center gap-1 p-1 bg-[#FAF7F1] border border-[#e0d9cb] rounded-xl">
                    {[
                      { mode: "grid", icon: LayoutGrid, label: "Grid View" },
                      { mode: "list", icon: List, label: "List View" },
                      { mode: "compact", icon: Grid3X3, label: "Dense View" }
                    ].map((v) => {
                      const Icon = v.icon;
                      const active = viewMode === v.mode;
                      return (
                        <button
                          key={v.mode}
                          onClick={() => setViewMode(v.mode as any)}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            active ? "bg-[#0A0A0A] text-white" : "text-[#948d7c] hover:text-[#0A0A0A]"
                          }`}
                          title={v.label}
                        >
                          <Icon size={14} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Active Filter Tags Bar (Removable Chips) */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 bg-[#FAF7F1] p-3 rounded-2xl border border-[#EEE9E0]">
                  <span className="text-xs font-bold text-[#948d7c] uppercase tracking-wider mr-1">Active:</span>

                  {selectedLocations.map((loc) => (
                    <span
                      key={loc}
                      className="inline-flex items-center gap-1.5 bg-white border border-[#e0d9cb] text-[#0A0A0A] text-xs font-bold px-3 py-1 rounded-full shadow-2xs"
                    >
                      <MapPin size={11} className="text-[#D31E28]" />
                      {loc}
                      <button onClick={() => toggleLocation(loc)} className="hover:text-[#D31E28] cursor-pointer ml-0.5">
                        <X size={12} />
                      </button>
                    </span>
                  ))}

                  {selectedType !== "All" && (
                    <span className="inline-flex items-center gap-1.5 bg-white border border-[#e0d9cb] text-[#0A0A0A] text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                      {selectedType}
                      <button onClick={() => setSelectedType("All")} className="hover:text-[#D31E28] cursor-pointer ml-0.5">
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  {selectedBHK !== "All" && (
                    <span className="inline-flex items-center gap-1.5 bg-white border border-[#e0d9cb] text-[#0A0A0A] text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                      {selectedBHK} BHK
                      <button onClick={() => setSelectedBHK("All")} className="hover:text-[#D31E28] cursor-pointer ml-0.5">
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  {(minPrice > 0 || maxPrice < 300000000) && (
                    <span className="inline-flex items-center gap-1.5 bg-white border border-[#e0d9cb] text-[#0A0A0A] text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                      {minPrice > 0 ? formatPrice(minPrice) : "₹0"} – {formatPrice(maxPrice)}
                      <button onClick={() => { setMinPrice(0); setMaxPrice(300000000); }} className="hover:text-[#D31E28] cursor-pointer ml-0.5">
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  {selectedAmenities.map((a) => (
                    <span
                      key={a}
                      className="inline-flex items-center gap-1.5 bg-white border border-[#e0d9cb] text-[#0A0A0A] text-xs font-bold px-3 py-1 rounded-full shadow-2xs"
                    >
                      {a}
                      <button onClick={() => handleAmenityToggle(a)} className="hover:text-[#D31E28] cursor-pointer ml-0.5">
                        <X size={12} />
                      </button>
                    </span>
                  ))}

                  <button
                    onClick={resetFilters}
                    className="text-xs font-bold text-[#D31E28] hover:underline uppercase tracking-wider ml-auto cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Database status banner */}
              {isOffline && (
                <div className="border border-amber-200 bg-amber-50/60 rounded-2xl py-3 px-4 flex items-center gap-3">
                  <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-900 font-medium">
                    Displaying verified local inventory.
                  </p>
                </div>
              )}

              {/* Empty Results Fallback */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <div className="w-9 h-9 border-4 border-[#D31E28] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-[#948d7c] font-semibold tracking-wider uppercase">Loading Estates…</p>
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="border border-[#EEE9E0] rounded-2xl py-16 px-6 flex flex-col items-center justify-center text-center gap-5 bg-white shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-[#faf0f0] flex items-center justify-center text-[#D31E28]">
                    <Building size={24} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-2xl text-[#0A0A0A]">No Property Matches Found</h3>
                    <p className="text-sm text-[#6b6659] leading-relaxed max-w-sm mx-auto mt-2">
                      No estates match all selected filters. Try broadening your location or budget limit.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center pt-2">
                    <button
                      onClick={resetFilters}
                      className="bg-[#0A0A0A] hover:bg-[#D31E28] text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-full transition-colors cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                    {selectedLocations.length > 0 && (
                      <button
                        onClick={() => setSelectedLocations([])}
                        className="bg-[#FAF7F1] border border-[#e0d9cb] text-[#0A0A0A] text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-full hover:border-[#0A0A0A] transition-colors cursor-pointer"
                      >
                        Clear Location Selection
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Properties Cards Grid */
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

                      // LIST VIEW
                      if (viewMode === "list") {
                        return (
                          <motion.div
                            layout
                            key={property.id}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: (idx % 2) * 0.04 }}
                            className="border border-[#EEE9E0] rounded-2xl overflow-hidden bg-white w-full flex flex-col md:flex-row group shadow-sm hover:shadow-md transition-shadow"
                          >
                            <Link
                              href={`/properties/${property.slug}`}
                              className="relative block w-full md:w-[38%] aspect-[4/3] md:aspect-auto md:min-h-[260px] shrink-0 overflow-hidden bg-[#efeae1]"
                            >
                              <img
                                src={property.image}
                                alt={property.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <span className="absolute left-3 top-3 bg-emerald-500 text-white rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <ShieldCheck size={10} /> RERA Clear
                              </span>
                              <div className="absolute left-3 bottom-3 bg-[#D31E28] text-white rounded-full px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest">
                                {property.possession === "Ready" ? "READY TO MOVE" : "UNDER CONSTRUCTION"}
                              </div>
                              <button
                                onClick={(e) => toggleFavorite(property.id, e)}
                                className="absolute right-3 top-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                              >
                                <Heart size={14} className={isFavorited ? "fill-[#D31E28] text-[#D31E28]" : "text-[#57534a]"} />
                              </button>
                            </Link>

                            <div className="p-5 flex flex-col flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-[11px] font-bold uppercase tracking-widest text-[#948d7c] truncate">
                                  {property.location.split(",")[0]}
                                </span>
                                <span className="text-base font-bold text-[#D31E28] whitespace-nowrap">
                                  {formatPrice(property.price)} Onwards
                                </span>
                              </div>
                              <Link
                                href={`/properties/${property.slug}`}
                                className="text-base lg:text-lg font-bold leading-snug text-[#0A0A0A] hover:text-[#D31E28] transition-colors mt-1.5 line-clamp-2"
                              >
                                {property.title}
                              </Link>
                              <p className="text-xs text-[#6b6659] leading-relaxed line-clamp-2 mt-2">
                                {property.description}
                              </p>

                              <div className="mt-auto pt-4 border-t border-[#EEE9E0] flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-[#948d7c]">
                                  <span>{property.bhk} BHK</span>
                                  <span>•</span>
                                  <span>{property.area}</span>
                                  <span>•</span>
                                  <span>{possessionShort(property)}</span>
                                </div>
                                <button
                                  onClick={() => setSelectedProperty(property)}
                                  className="inline-flex items-center gap-1.5 bg-[#0A0A0A] hover:bg-[#D31E28] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full cursor-pointer transition-colors"
                                >
                                  Inquire <ArrowRight size={11} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      }

                      // GRID VIEW (DEFAULT)
                      return (
                        <motion.div
                          layout
                          key={property.id}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.35, delay: (idx % 2) * 0.05 }}
                          className="border border-[#EEE9E0] rounded-2xl overflow-hidden bg-white h-full flex flex-col group shadow-sm hover:shadow-md transition-shadow"
                        >
                          <Link
                            href={`/properties/${property.slug}`}
                            className="relative block aspect-[4/3] overflow-hidden bg-[#efeae1]"
                          >
                            <img
                              src={property.image}
                              alt={property.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <span className="absolute left-3 top-3 bg-emerald-500 text-white rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                              <ShieldCheck size={10} /> RERA Clear
                            </span>
                            <div className="absolute left-3 bottom-3 bg-[#D31E28] text-white rounded-full px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest">
                              {property.possession === "Ready" ? "READY TO MOVE" : "UNDER CONSTRUCTION"}
                            </div>
                            <div className="absolute right-3 bottom-3 bg-[#0A0A0A]/95 text-white rounded-full px-3 py-1 text-[10px] font-bold">
                              {property.type}
                            </div>
                            <button
                              onClick={(e) => toggleFavorite(property.id, e)}
                              className="absolute right-3 top-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                            >
                              <Heart size={14} className={isFavorited ? "fill-[#D31E28] text-[#D31E28]" : "text-[#57534a]"} />
                            </button>
                          </Link>

                          <div className="p-5 flex flex-col flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-bold uppercase tracking-widest text-[#948d7c]">
                                {property.location.split(",")[0]}
                              </span>
                              <span className="text-base font-bold text-[#D31E28]">
                                {formatPrice(property.price)} Onwards
                              </span>
                            </div>
                            <Link
                              href={`/properties/${property.slug}`}
                              className="text-base lg:text-lg font-bold leading-snug text-[#0A0A0A] hover:text-[#D31E28] transition-colors mt-2 line-clamp-2"
                            >
                              {property.title}
                            </Link>
                            <p className="text-xs text-[#6b6659] leading-relaxed line-clamp-2 mt-2">
                              {property.description}
                            </p>

                            <div className="mt-auto pt-4 border-t border-[#EEE9E0] flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#948d7c]">
                                <span>{property.bhk} BHK</span>
                                <span>•</span>
                                <span>{property.area}</span>
                              </div>
                              <button
                                onClick={() => setSelectedProperty(property)}
                                className="bg-[#0A0A0A] hover:bg-[#D31E28] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full cursor-pointer transition-colors"
                              >
                                Inquire
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

      {/* MOBILE FILTER DRAWER / SLIDE-OVER */}
      <AnimatePresence>
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 flex justify-end font-archivo lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="absolute inset-0 bg-black cursor-pointer"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="relative w-full max-w-xs bg-white h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto z-10"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-[#EEE9E0] pb-4">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-[#D31E28]" />
                    <span className="text-sm font-bold text-[#0A0A0A]">Filter Properties</span>
                  </div>
                  <button onClick={() => setShowMobileFilters(false)} className="p-1 text-[#57534a]">
                    <X size={18} />
                  </button>
                </div>

                {/* Mobile Types */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#948d7c] uppercase">Property Type</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {["All", "Apartment", "Villa", "Plot"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedType(t)}
                        className={`px-3 py-2 text-xs font-bold rounded-xl border text-center ${
                          selectedType === t ? "bg-[#0A0A0A] text-white border-[#0A0A0A]" : "bg-[#FAF7F1] text-[#57534a] border-[#e0d9cb]"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile BHK */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#948d7c] uppercase">Bedrooms</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["All", "1", "2", "3", "4", "5+"].map((bhk) => (
                      <button
                        key={bhk}
                        onClick={() => setSelectedBHK(bhk)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl border ${
                          selectedBHK === bhk ? "bg-[#D31E28] text-white border-[#D31E28]" : "bg-[#FAF7F1] text-[#57534a] border-[#e0d9cb]"
                        }`}
                      >
                        {bhk === "All" ? "Any" : `${bhk} BHK`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Locations */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#948d7c] uppercase">Locations ({selectedLocations.length})</label>
                  <div className="space-y-1 max-h-40 overflow-y-auto border border-[#EEE9E0] p-2 rounded-xl">
                    {availableAreasWithCounts.map((loc) => (
                      <button
                        key={loc.name}
                        onClick={() => toggleLocation(loc.name)}
                        className={`w-full flex items-center justify-between px-2 py-1 rounded text-xs font-medium ${
                          selectedLocations.includes(loc.name) ? "text-[#D31E28] font-bold" : "text-[#57534a]"
                        }`}
                      >
                        <span>{loc.name}</span>
                        <span className="text-[10px] text-[#948d7c]">{loc.count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Sticky Bottom CTA */}
              <div className="pt-4 border-t border-[#EEE9E0] space-y-2">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-[#D31E28] text-white text-xs font-bold py-3.5 rounded-xl uppercase tracking-wider shadow-md"
                >
                  Apply Filters ({filteredProperties.length} Matches)
                </button>
                <button
                  onClick={resetFilters}
                  className="w-full bg-white border border-[#e0d9cb] text-[#57534a] text-xs font-bold py-2.5 rounded-xl uppercase"
                >
                  Reset All
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INQUIRY MODAL */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-50 flex justify-end font-archivo">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProperty(null)}
              className="absolute inset-0 bg-black cursor-pointer"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl p-6 md:p-8 flex flex-col justify-between overflow-y-auto z-10"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#EEE9E0] pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8A6D2F]">Inquiry Protocol</span>
                    <h3 className="text-lg font-bold text-[#0A0A0A] line-clamp-1 mt-0.5">{selectedProperty.title}</h3>
                  </div>
                  <button onClick={() => setSelectedProperty(null)} className="p-2 text-[#57534a]">
                    <X size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#FAF7F1] rounded-xl border border-[#EEE9E0]">
                  <img src={selectedProperty.image} alt={selectedProperty.title} className="w-14 h-14 object-cover rounded-lg shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#0A0A0A] line-clamp-1">{selectedProperty.title}</p>
                    <p className="text-xs text-[#6b6659]">{selectedProperty.location.split(",")[0]}</p>
                    <p className="text-sm font-bold text-[#D31E28] mt-0.5">{formatPrice(selectedProperty.price)}</p>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {!isInquirySubmitted ? (
                    <form onSubmit={handleInquirySubmit} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-[#948d7c] uppercase">Full Name*</label>
                        <input
                          type="text"
                          required
                          value={inquiryForm.name}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                          className="w-full bg-white border border-[#e0d9cb] rounded-xl px-4 py-3 text-sm text-[#0A0A0A]"
                          placeholder="e.g. Rahul Sharma"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#948d7c] uppercase">Email*</label>
                        <input
                          type="email"
                          required
                          value={inquiryForm.email}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                          className="w-full bg-white border border-[#e0d9cb] rounded-xl px-4 py-3 text-sm text-[#0A0A0A]"
                          placeholder="e.g. rahul@gmail.com"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#948d7c] uppercase">Phone*</label>
                        <input
                          type="tel"
                          required
                          value={inquiryForm.phone}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                          className="w-full bg-white border border-[#e0d9cb] rounded-xl px-4 py-3 text-sm text-[#0A0A0A]"
                          placeholder="e.g. +91 98765 43210"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#D31E28] text-white text-sm font-bold py-4 rounded-xl uppercase tracking-wider shadow-md"
                      >
                        Submit Safe Inquiry
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 rounded-full bg-[#D31E28] flex items-center justify-center mx-auto text-white font-bold">
                        ✓
                      </div>
                      <p className="text-base font-bold text-[#0A0A0A] mt-3">Inquiry Submitted</p>
                      <p className="text-xs text-[#57534a] mt-1">An advisor will get back to you shortly.</p>
                    </div>
                  )}
                </AnimatePresence>
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
              <p className="text-xs text-[#948d7c] font-bold tracking-widest uppercase">Loading Properties Directory…</p>
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
