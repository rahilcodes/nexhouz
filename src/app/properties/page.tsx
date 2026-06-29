"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  RotateCcw,
  Building,
  Star,
  Heart,
  Phone,
  Mail,
  Check,
  Send,
  CheckSquare,
  Square,
  X,
  Search,
  MapPin,
  Clock,
  ArrowRight,
  Info,
  ShieldCheck,
  Calendar,
  TrendingUp,
  LayoutGrid,
  List,
  Grid3X3,
  ChevronDown,
  AlertTriangle
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchAllProperties, submitLead } from "@/lib/db";
import { properties as defaultProperties, Property } from "@/data/properties";
import { supabase } from "@/lib/supabaseClient";

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

  return (
    <div className="max-w-7xl mx-auto px-6 pt-36 pb-32">
      
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-8 mb-12 space-y-6 md:space-y-0">
        <div className="space-y-3">
          <span className="text-xs tracking-[0.3em] font-extrabold text-brand-red uppercase">Discovery Index</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-brand-black leading-tight">
            Find Your Dream Home in Hyderabad
          </h1>
          <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-xl">
            Browse our highly audited, RERA-clear curation of Hyderabad's most premium villas, penthouses, and estates.
          </p>
        </div>
        
        {/* Dynamic Search Box */}
        <div className="relative w-full md:w-80 shrink-0">
          <input
            type="text"
            placeholder="Search architects, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 px-4 py-3 pl-10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-brand-red text-brand-black transition-all shadow-sm"
          />
          <Search size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-3.5 p-0.5 text-gray-400 hover:text-brand-black cursor-pointer">
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* On Mobile/Tablet: Collapsible Filter Trigger Bar */}
      <div className="lg:hidden flex items-center justify-between gap-4 p-3.5 bg-white border border-gray-200/80 rounded-2xl shadow-sm mb-6">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center space-x-2 text-xs font-extrabold text-brand-black uppercase tracking-wider px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-98 transition-all cursor-pointer"
        >
          <SlidersHorizontal size={12} className="text-brand-red" />
          <span>{showMobileFilters ? "Hide Filters" : "Show Filters"}</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-brand-red text-white flex items-center justify-center text-xs font-bold ml-1 animate-pulse">
              {activeFilterCount}
            </span>
          )}
        </button>
        
        <div className="flex items-center space-x-3">
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs tracking-wider font-extrabold text-gray-400 hover:text-brand-red uppercase transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        
        {/* ========================================== */}
        {/* REDESIGNED FLAT SIDEBAR FILTERS            */}
        {/* ========================================== */}
        <aside className={`${showMobileFilters ? "block" : "hidden"} lg:block lg:sticky lg:top-28 space-y-6 lg:pr-4 py-1 bg-transparent shrink-0 lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200/80 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent [-ms-overflow-style:none] [scrollbar-width:thin] mb-8 lg:mb-0`}>
          
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex items-center space-x-2 text-xs font-extrabold tracking-widest text-brand-black uppercase">
              <SlidersHorizontal size={13} className="text-brand-red" />
              <span>Filters</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs tracking-wider font-extrabold text-gray-400 hover:text-brand-red uppercase flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <RotateCcw size={10} />
              <span>Reset</span>
            </button>
          </div>

          {/* Location Selector */}
          <div className="relative space-y-1.5 border-b border-gray-200/40 pb-4">
            <label className="text-xs tracking-widest uppercase font-extrabold text-gray-400">Location</label>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdown(openDropdown === "location" ? null : "location");
              }}
              className="w-full flex items-center justify-between bg-white border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs font-bold text-brand-black hover:border-gray-300 transition-all cursor-pointer shadow-sm relative z-10"
            >
              <span className="truncate">
                {selectedLocation === "All" ? "All Locations" : selectedLocation}
              </span>
              <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${openDropdown === "location" ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {openDropdown === "location" && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-150 rounded-2xl shadow-xl p-2 z-30 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full"
                >
                  {[
                    { value: "All", label: "All Locations" },
                    { value: "Kokapet", label: "Kokapet" },
                    { value: "Jubilee Hills", label: "Jubilee Hills" },
                    { value: "Financial District", label: "Financial District" },
                    { value: "Narsingi", label: "Narsingi" },
                    { value: "Tellapur", label: "Tellapur" },
                    { value: "Gandipet", label: "Gandipet" },
                    { value: "Madhapur", label: "Madhapur" },
                    { value: "Gachibowli", label: "Gachibowli" }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSelectedLocation(opt.value);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                        selectedLocation === opt.value
                          ? "bg-brand-red/5 text-brand-red font-extrabold"
                          : "text-brand-black hover:bg-gray-50"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {selectedLocation === opt.value && <Check size={10} className="text-brand-red stroke-[3]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Property Type Selector */}
          <div className="relative space-y-1.5 border-b border-gray-200/40 pb-4">
            <label className="text-xs tracking-widest uppercase font-extrabold text-gray-400">Property Type</label>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdown(openDropdown === "type" ? null : "type");
              }}
              className="w-full flex items-center justify-between bg-white border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs font-bold text-brand-black hover:border-gray-300 transition-all cursor-pointer shadow-sm relative z-10"
            >
              <span className="truncate">
                {selectedType === "All" ? "All Types" : selectedType === "Plot" ? "Plots" : selectedType === "Villa" ? "Villas" : selectedType === "Apartment" ? "Apartments" : selectedType}
              </span>
              <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${openDropdown === "type" ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {openDropdown === "type" && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-150 rounded-2xl shadow-xl p-2 z-30 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full"
                >
                  {[
                    { value: "All", label: "All Types" },
                    { value: "Apartment", label: "Apartments" },
                    { value: "Villa", label: "Villas" },
                    { value: "Plot", label: "Plots" },
                    { value: "Commercial", label: "Commercial" }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSelectedType(opt.value);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                        selectedType === opt.value
                          ? "bg-brand-red/5 text-brand-red font-extrabold"
                          : "text-brand-black hover:bg-gray-50"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {selectedType === opt.value && <Check size={10} className="text-brand-red stroke-[3]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* BHK Selector */}
          <div className="relative space-y-1.5 border-b border-gray-200/40 pb-4">
            <label className="text-xs tracking-widest uppercase font-extrabold text-gray-400">Bedrooms (BHK)</label>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdown(openDropdown === "bhk" ? null : "bhk");
              }}
              className="w-full flex items-center justify-between bg-white border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs font-bold text-brand-black hover:border-gray-300 transition-all cursor-pointer shadow-sm relative z-10"
            >
              <span className="truncate">
                {selectedBHK === "All" ? "All configurations" : `${selectedBHK} BHK`}
              </span>
              <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${openDropdown === "bhk" ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {openDropdown === "bhk" && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-150 rounded-2xl shadow-xl p-2 z-30 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full"
                >
                  {[
                    { value: "All", label: "All configurations" },
                    { value: "3", label: "3 BHK" },
                    { value: "4", label: "4 BHK" },
                    { value: "5", label: "5 BHK" },
                    { value: "6", label: "6 BHK" }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSelectedBHK(opt.value);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                        selectedBHK === opt.value
                          ? "bg-brand-red/5 text-brand-red font-extrabold"
                          : "text-brand-black hover:bg-gray-50"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {selectedBHK === opt.value && <Check size={10} className="text-brand-red stroke-[3]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Possession Selector */}
          <div className="relative space-y-1.5 border-b border-gray-200/40 pb-4">
            <label className="text-xs tracking-widest uppercase font-extrabold text-gray-400">Move-In Status</label>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdown(openDropdown === "possession" ? null : "possession");
              }}
              className="w-full flex items-center justify-between bg-white border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs font-bold text-brand-black hover:border-gray-300 transition-all cursor-pointer shadow-sm relative z-10"
            >
              <span className="truncate">
                {selectedPossession === "All" ? "All statuses" : selectedPossession === "Ready" ? "Ready to Move" : selectedPossession}
              </span>
              <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${openDropdown === "possession" ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {openDropdown === "possession" && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-150 rounded-2xl shadow-xl p-2 z-30 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full"
                >
                  {[
                    { value: "All", label: "All statuses" },
                    { value: "Ready", label: "Ready to Move" },
                    { value: "Under Construction", label: "Under Construction" }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSelectedPossession(opt.value);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                        selectedPossession === opt.value
                          ? "bg-brand-red/5 text-brand-red font-extrabold"
                          : "text-brand-black hover:bg-gray-50"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {selectedPossession === opt.value && <Check size={10} className="text-brand-red stroke-[3]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Yield Profile Selector */}
          <div className="relative space-y-1.5 border-b border-gray-200/40 pb-4">
            <label className="text-xs tracking-widest uppercase font-extrabold text-gray-400">Investment Goal</label>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdown(openDropdown === "investment" ? null : "investment");
              }}
              className="w-full flex items-center justify-between bg-white border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs font-bold text-brand-black hover:border-gray-300 transition-all cursor-pointer shadow-sm relative z-10"
            >
              <span className="truncate">
                {selectedInvestment === "All" ? "All profiles" : selectedInvestment}
              </span>
              <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${openDropdown === "investment" ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {openDropdown === "investment" && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-150 rounded-2xl shadow-xl p-2 z-30 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full"
                >
                  {[
                    { value: "All", label: "All profiles" },
                    { value: "Capital Appreciation", label: "Capital Appreciation" },
                    { value: "High-Yield Rental", label: "High-Yield Rental" },
                    { value: "Generational Estate", label: "Generational Estate" }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSelectedInvestment(opt.value);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                        selectedInvestment === opt.value
                          ? "bg-brand-red/5 text-brand-red font-extrabold"
                          : "text-brand-black hover:bg-gray-50"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {selectedInvestment === opt.value && <Check size={10} className="text-brand-red stroke-[3]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dynamic Price Range Selector */}
          <div className="space-y-2.5 border-b border-gray-200/40 pb-4">
            <div className="flex justify-between items-center text-xs tracking-widest uppercase font-extrabold text-gray-400">
              <span>Maximum Price</span>
              <span className="text-brand-red font-extrabold">₹{(maxPrice / 10000000).toFixed(1)} Cr</span>
            </div>
            <input
              type="range"
              min={30000000}
              max={300000000}
              step={5000000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full h-1 bg-gray-200 appearance-none cursor-pointer accent-brand-red rounded-full"
            />
            <div className="flex justify-between text-xs text-gray-400 font-extrabold">
              <span>₹3 Cr</span>
              <span>₹30 Cr</span>
            </div>
          </div>

          {/* Amenities Multi-Checkboxes */}
          <div className="space-y-3">
            <label className="text-xs tracking-widest uppercase font-extrabold text-gray-400 block">Features & Amenities</label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
              {amenitiesList.map((amenity) => {
                const checked = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    onClick={() => handleAmenityToggle(amenity)}
                    className="w-full flex items-center space-x-2.5 text-xs font-medium text-gray-500 hover:text-brand-black text-left focus:outline-none cursor-pointer py-0.5"
                  >
                    {checked ? (
                      <CheckSquare size={13} className="text-brand-red shrink-0" />
                    ) : (
                      <Square size={13} className="text-gray-300 shrink-0" />
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 pb-4">
            <span className="text-xs tracking-widest uppercase text-gray-400 font-extrabold">
              Query Results: {filteredProperties.length} Estates Found
            </span>

            {/* Premium 3-View Modes Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded-full w-fit shadow-sm relative shrink-0">
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
                    className={`p-2 rounded-full transition-all cursor-pointer flex items-center justify-center relative ${
                      active ? "bg-brand-black text-white shadow-sm" : "text-gray-400 hover:text-gray-700"
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
            <div className="border border-amber-200 bg-amber-50/50 rounded-3xl py-4 px-6 flex items-center justify-between gap-4 shadow-sm w-full mb-8 text-left animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-inner">
                  <AlertTriangle size={18} className="stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-amber-950">Database Offline Preview</h3>
                  <p className="text-xs text-amber-805 font-medium mt-0.5 leading-relaxed">
                    We are currently experiencing connection latency with our database server. Displaying verified local properties.
                  </p>
                </div>
              </div>
              {isDebugMode && dbError && (
                <div className="text-[10px] text-red-650 font-mono bg-red-50 border border-red-100 p-2 rounded-xl max-w-sm overflow-x-auto truncate">
                  {dbError}
                </div>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">Loading Estates...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="border border-gray-200/60 rounded-3xl py-20 px-6 flex flex-col items-center justify-center text-center space-y-5 bg-white shadow-luxury animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-brand-red/5 flex items-center justify-center text-brand-red">
                <Building size={22} className="stroke-[1.8]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-extrabold text-brand-black">No Architectural Matches</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
                  No matching estates were found in the registry using the selected metrics. Broaden your search criteria or reset filters.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="px-5 py-3 bg-brand-black hover:bg-brand-red text-white text-xs tracking-widest font-extrabold uppercase rounded-xl transition-all cursor-pointer hover:scale-103 shadow-md"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className={
                viewMode === "list"
                  ? "space-y-6"
                  : viewMode === "compact"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "grid grid-cols-1 md:grid-cols-2 gap-8"
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
                        className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-luxury hover:shadow-luxury-hover hover:border-brand-red/15 transition-all group flex flex-col md:flex-row w-full md:h-72"
                      >
                        {/* Image Frame */}
                        <div className="relative w-full md:w-[38%] aspect-[16/10] md:aspect-auto shrink-0 bg-gray-100 overflow-hidden">
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-102"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80" />
                          
                          {/* Elite Score Badge */}
                          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-2.5 py-1 flex items-center space-x-1 border border-black/5 rounded-full z-10 shadow-sm">
                            <Star size={9} className="text-brand-red fill-brand-red" />
                            <span className="text-xs tracking-widest font-extrabold text-brand-black uppercase">
                              {property.scores.architecturalIntegrity} AQ
                            </span>
                          </div>

                          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
                            <span className="text-xs font-extrabold uppercase tracking-widest text-white bg-brand-red px-2.5 py-0.5 rounded-full shadow-sm">
                              {property.possession}
                            </span>
                          </div>
                        </div>

                        {/* Content metrics */}
                        <div className="p-6 md:p-8 flex-grow flex flex-col justify-between space-y-4 min-w-0">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 min-w-0 truncate">
                                <MapPin size={9} className="shrink-0" />
                                {property.location}
                              </span>
                              <span className="text-xs font-extrabold text-brand-red bg-brand-red/5 px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                <TrendingUp size={9} />
                                {property.scores.investmentYield}% Yield
                              </span>
                            </div>
                            
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="text-xl font-extrabold text-brand-black tracking-tight leading-tight line-clamp-1 group-hover:text-brand-red transition-colors duration-300">
                                <Link href={`/properties/${property.slug}`}>{property.title}</Link>
                              </h3>
                              {/* Favorite Heart inside content for lists */}
                              <button
                                onClick={(e) => toggleFavorite(property.id, e)}
                                className="p-1.5 bg-gray-50 hover:bg-brand-red/5 text-gray-400 hover:text-brand-red rounded-full transition-all cursor-pointer shrink-0 border border-gray-200/60"
                              >
                                <Heart size={13} className={isFavorited ? "fill-brand-red text-brand-red" : ""} />
                              </button>
                            </div>
                            
                            <p className="text-xs font-medium text-gray-500 leading-relaxed font-sans line-clamp-2">
                              {property.description}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100 flex-grow-0">
                            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                              <span>{property.bhk} BHK Suites</span>
                              <span className="text-gray-200">|</span>
                              <span>{property.area}</span>
                              <span className="text-gray-200">|</span>
                              <span className="text-brand-black/60">
                                {property.type === "Apartment"
                                  ? `${property.udsPerAcre ?? 100} Flats/Acre`
                                  : `${property.scores.automationTier.split(" ")[1]} Automation`}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-start">
                              <div>
                                <p className="text-lg font-extrabold text-brand-black leading-none">{formatPrice(property.price)}</p>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Capital price</p>
                              </div>
                              <button
                                onClick={() => setSelectedProperty(property)}
                                className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-brand-black hover:bg-brand-red text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all hover:scale-103 cursor-pointer shadow-md"
                              >
                                Inquiry <ArrowRight size={10} />
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
                        className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-luxury hover:shadow-luxury-hover hover:border-brand-red/15 transition-all group flex flex-col h-full"
                      >
                        {/* Image Frame */}
                        <Link href={`/properties/${property.slug}`} className="relative aspect-[16/10] overflow-hidden bg-gray-100 block shrink-0">
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80" />
                          
                          {/* Favorite button floating */}
                          <button
                            onClick={(e) => toggleFavorite(property.id, e)}
                            className="absolute top-3 right-3 p-1.5 bg-white/95 backdrop-blur-md rounded-full text-gray-500 hover:text-brand-red hover:scale-110 transition-all z-10 border border-black/5 shadow-sm cursor-pointer"
                          >
                            <Heart size={11} className={isFavorited ? "fill-brand-red text-brand-red" : ""} />
                          </button>

                          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-white bg-brand-red px-2 py-0.5 rounded-full shadow-sm">
                              {property.possession}
                            </span>
                            <span className="text-xs font-extrabold text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                              {property.type}
                            </span>
                          </div>
                        </Link>

                        {/* Content metrics */}
                        <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider line-clamp-1 truncate">
                                {property.location.split(",")[0]}
                              </span>
                              <span className="text-xs font-extrabold text-brand-red shrink-0">
                                {property.scores.investmentYield}% Yield
                              </span>
                            </div>
                            <h3 className="text-sm font-extrabold text-brand-black tracking-tight leading-tight line-clamp-1 group-hover:text-brand-red transition-colors duration-300">
                              <Link href={`/properties/${property.slug}`}>{property.title}</Link>
                            </h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                              {property.bhk} BHK • {property.area.split(" ")[0]} SQ FT
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-100 shrink-0">
                            <span className="text-sm font-extrabold text-brand-black">{formatPrice(property.price)}</span>
                            <button
                              onClick={() => setSelectedProperty(property)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-black hover:bg-brand-red text-white text-xs font-extrabold uppercase tracking-widest rounded-lg transition-all cursor-pointer"
                            >
                              Inquire
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
                      className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-luxury hover:shadow-luxury-hover hover:border-brand-red/15 transition-all group flex flex-col h-full animate-fadeIn"
                    >
                      {/* Image frame */}
                      <Link href={`/properties/${property.slug}`} className="relative aspect-[4/3] overflow-hidden bg-gray-100 block shrink-0">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80" />

                        {/* Elite Score Badge */}
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-2.5 py-1 flex items-center space-x-1 border border-black/5 rounded-full z-10 shadow-sm">
                          <Star size={9} className="text-brand-red fill-brand-red" />
                          <span className="text-xs tracking-widest font-extrabold text-brand-black uppercase">
                            {property.scores.architecturalIntegrity} AQ
                          </span>
                        </div>

                        {/* Favorite Button */}
                        <button
                          onClick={(e) => toggleFavorite(property.id, e)}
                          className="absolute top-4 right-4 p-2 bg-white/95 backdrop-blur-md rounded-full text-gray-500 hover:text-brand-red hover:scale-110 transition-all duration-300 z-10 border border-black/5 focus:outline-none cursor-pointer shadow-sm"
                        >
                          <Heart
                            size={13}
                            className={isFavorited ? "fill-brand-red text-brand-red" : ""}
                          />
                        </button>

                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
                          <span className="text-xs font-extrabold uppercase tracking-widest text-white bg-brand-red px-2.5 py-0.5 rounded-full shadow-sm">
                            {property.possession}
                          </span>
                          <span className="text-xs font-extrabold text-white bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                            {property.type}
                          </span>
                        </div>
                      </Link>

                      {/* Metrics detail */}
                      <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                              <MapPin size={9} className="shrink-0" />
                              {property.location.split(",")[0]}
                            </span>
                            <span className="text-xs font-extrabold text-brand-red bg-brand-red/5 px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                              <TrendingUp size={9} />
                              {property.scores.investmentYield}% Yield
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-extrabold text-brand-black tracking-tight leading-tight line-clamp-1 group-hover:text-brand-red transition-colors duration-300">
                            <Link href={`/properties/${property.slug}`}>
                              {property.title}
                            </Link>
                          </h3>
                          
                          <p className="text-xs font-medium text-gray-500 leading-relaxed font-sans line-clamp-2">
                            {property.description}
                          </p>
                        </div>

                        {/* Specs Row & CTA */}
                        <div className="space-y-4 pt-4 border-t border-gray-100 flex-grow-0">
                          {/* Specs grid */}
                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="p-2 bg-gray-50 border border-gray-100 rounded-xl">
                              <p className="font-extrabold text-brand-black">{property.bhk} BHK</p>
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Layout</p>
                            </div>
                            <div className="p-2 bg-gray-50 border border-gray-100 rounded-xl">
                              <p className="font-extrabold text-brand-black">{property.area.split(" ")[0]}</p>
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Sq Ft</p>
                            </div>
                            <div className="p-2 bg-gray-50 border border-gray-100 rounded-xl">
                              {property.type === "Apartment" ? (
                                <>
                                  <p className="font-extrabold text-brand-black">{property.udsPerAcre ?? 100}</p>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-tight">Flats Per Acre</p>
                                </>
                              ) : (
                                <>
                                  <p className="font-extrabold text-brand-black">{property.scores.automationTier.split(" ")[1]}</p>
                                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Auto Tier</p>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <div>
                              <p className="text-lg font-extrabold text-brand-black leading-none">{formatPrice(property.price)}</p>
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Onwards</p>
                            </div>
                            
                            <button
                              onClick={() => setSelectedProperty(property)}
                              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-brand-black hover:bg-brand-red text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all hover:scale-103 cursor-pointer shadow-md"
                            >
                              Initiate Inquiry <ArrowRight size={10} />
                            </button>
                          </div>
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

      {/* ========================================== */}
      {/* INQUIRY MODAL (REUSED / REPLICATED PANEL)   */}
      {/* ========================================== */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-50 flex justify-end">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProperty(null)}
              className="absolute inset-0 bg-brand-black cursor-pointer"
            />

            {/* Content Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              className="relative w-full max-w-md bg-white h-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-8 md:p-10 flex flex-col justify-between overflow-y-auto z-10"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs tracking-[0.25em] text-gray-400 font-extrabold uppercase">
                      Inquiry Protocol
                    </span>
                    <span className="text-xl font-extrabold text-brand-black line-clamp-1">
                      {selectedProperty.title}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedProperty(null)}
                    className="p-2 hover:bg-gray-50 text-gray-500 hover:text-brand-black rounded-full transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Property Detail Card */}
                <div className="bg-gray-50 p-4 flex items-center space-x-4 border border-gray-150/60 rounded-2xl">
                  <div className="w-16 h-12 bg-white overflow-hidden shrink-0 rounded-xl border border-gray-200">
                    <img
                      src={selectedProperty.image}
                      alt={selectedProperty.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="text-xs font-bold text-brand-black line-clamp-1">{selectedProperty.title}</h4>
                    <p className="text-xs text-gray-400 font-medium line-clamp-1 mt-0.5">{selectedProperty.location.split(",")[0]}</p>
                    <p className="text-xs font-extrabold text-brand-red mt-1">
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
                      className="space-y-5 text-xs text-brand-black font-sans"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="space-y-1">
                        <label className="text-xs tracking-[0.2em] uppercase font-extrabold text-gray-400">Full Name*</label>
                        <input
                          type="text"
                          required
                          value={inquiryForm.name}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200/80 px-4 py-3 rounded-xl focus:outline-none focus:border-brand-red focus:bg-white text-xs font-semibold"
                          placeholder="e.g. Rahul Sharma"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs tracking-[0.2em] uppercase font-extrabold text-gray-400">Email*</label>
                        <input
                          type="email"
                          required
                          value={inquiryForm.email}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200/80 px-4 py-3 rounded-xl focus:outline-none focus:border-brand-red focus:bg-white text-xs font-semibold"
                          placeholder="e.g. rahul.sharma@gmail.com"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs tracking-[0.2em] uppercase font-extrabold text-gray-400">Mobile Number*</label>
                        <input
                          type="tel"
                          required
                          value={inquiryForm.phone}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200/80 px-4 py-3 rounded-xl focus:outline-none focus:border-brand-red focus:bg-white text-xs font-semibold"
                          placeholder="e.g. +91 98765 43210"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs tracking-[0.2em] uppercase font-extrabold text-gray-400">Notes</label>
                        <textarea
                          rows={4}
                          value={inquiryForm.notes}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, notes: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200/80 px-4 py-3 rounded-xl focus:outline-none focus:border-brand-red focus:bg-white text-xs font-semibold resize-none"
                          placeholder="e.g. State your specific queries or requirements here."
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 bg-brand-black hover:bg-brand-red text-white text-xs tracking-[0.25em] font-extrabold uppercase transition-all duration-300 rounded-xl shadow-luxury hover:scale-101 cursor-pointer"
                      >
                        Submit
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      className="p-8 border border-brand-red/10 bg-brand-red/5 flex flex-col items-center justify-center text-center space-y-4 rounded-2xl"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="w-12 h-12 rounded-full bg-brand-red text-white flex items-center justify-center shadow-lg shadow-brand-red/20">
                        <Check size={20} />
                      </div>
                      <h4 className="text-lg font-extrabold text-brand-black">Inquiry Authenticated</h4>
                      <p className="text-xs text-gray-500 leading-relaxed font-semibold max-w-xs mx-auto">
                        Acquisition briefing verified. A dedicated partner broker will reach out within 4 hours with off-market spatial documentation.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-start space-x-2 text-xs text-gray-400 pt-6 border-t border-gray-100 font-medium">
                <Info size={12} className="flex-shrink-0 mt-0.5 text-brand-red" />
                <span>
                  All listings are subject to strict KYC procedures and structural verification checks to ensure RERA and title deed authenticity.
                </span>
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function PropertiesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow bg-brand-gray/10 min-h-screen">
        <Suspense
          fallback={
            <div className="max-w-7xl mx-auto px-6 pt-36 pb-32 text-center text-xs font-semibold text-brand-black/40 uppercase">
              Loading Discovery Index...
            </div>
          }
        >
          <PropertiesExplorerContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
