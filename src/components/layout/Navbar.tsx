"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Heart, Phone, Building2, Home, LayoutGrid, Scale,
  Globe, UserCheck, Info, Users, Briefcase, Calculator,
  ArrowLeftRight, Ruler, ChevronDown, Sparkles, ArrowRight
} from "lucide-react";

const menus = [
  {
    label: "Properties",
    items: [
      { icon: Sparkles, label: "New Launches", desc: "Freshly launched projects in Hyderabad", href: "/new-launches", badge: "New" },
      { icon: Home, label: "Ready To Move", desc: "RERA-clear homes available immediately", href: "/ready-to-move" },
      { icon: LayoutGrid, label: "All Properties", desc: "Browse our full verified collection", href: "/properties" },
      { icon: Scale, label: "Start Comparing", desc: "Side-by-side property comparison tool", href: "/compare" },
    ]
  },
  {
    label: "Services",
    items: [
      { icon: Globe, label: "Second Opinion Services", desc: "Neutral expert review of any property deal", href: "/second-opinion" },
      { icon: UserCheck, label: "Expert Advisory", desc: "Book a dedicated real estate consultant", href: "/expert-advisory" },
    ]
  },
  {
    label: "Tools",
    items: [
      { icon: Calculator, label: "Home Loan Eligibility", desc: "Check how much loan you qualify for", href: "/calculators/home-loan" },
      { icon: ArrowLeftRight, label: "Property EMI Calculator", desc: "Plan your monthly outgoing with precision", href: "/calculators/emi" },
      { icon: Ruler, label: "Area Converter", desc: "Convert sq ft, sq m, yards, cents & more", href: "/calculators/area" },
    ]
  },
  {
    label: "About",
    items: [
      { icon: Info, label: "About Us", desc: "Our story, mission and audit philosophy", href: "/about" },
      { icon: Users, label: "Team", desc: "Meet the advisors behind NexHouz", href: "/team" },
      { icon: Briefcase, label: "Careers", desc: "Join Hyderabad's most trusted property firm", href: "/careers" },
    ]
  }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const pathname = usePathname();
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveMenu(null);
  }, [pathname]);

  const handleMouseEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(label);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 bg-white/95 backdrop-blur-xl border-b border-black/6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)]"
          : "py-4 bg-white border-b border-black/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center shrink-0 focus:outline-none">
          <img
            src="/images/logo_black_text_mainlogo.png"
            alt="NexHouz"
            className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {menus.map((menu) => (
            <div
              key={menu.label}
              className="relative"
              onMouseEnter={() => handleMouseEnter(menu.label)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[11px] font-bold tracking-widest uppercase transition-all cursor-pointer ${
                  activeMenu === menu.label
                    ? "text-brand-red bg-brand-red/4"
                    : "text-brand-black/55 hover:text-brand-black hover:bg-gray-50"
                }`}
              >
                {menu.label}
                <ChevronDown
                  size={11}
                  className={`transition-transform duration-200 ${activeMenu === menu.label ? "rotate-180 text-brand-red" : ""}`}
                />
              </button>

              {/* Dropdown panel */}
              <AnimatePresence>
                {activeMenu === menu.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    onMouseEnter={() => handleMouseEnter(menu.label)}
                    onMouseLeave={handleMouseLeave}
                    className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.15)] overflow-hidden z-50"
                  >
                    <div className="p-2">
                      {menu.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-start gap-3 p-3 rounded-xl transition-all group/item ${
                              isActive ? "bg-brand-red/4" : "hover:bg-gray-50"
                            }`}
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              isActive ? "bg-brand-red text-white" : "bg-gray-100 text-gray-500 group-hover/item:bg-brand-red/10 group-hover/item:text-brand-red"
                            }`}>
                              <Icon size={15} className="stroke-[1.8]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-[12px] font-bold ${isActive ? "text-brand-red" : "text-brand-black group-hover/item:text-brand-red"} transition-colors`}>
                                  {item.label}
                                </span>
                                {"badge" in item && item.badge && (
                                  <span className="text-[8px] font-extrabold uppercase tracking-wider bg-brand-red text-white px-1.5 py-0.5 rounded-full">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-gray-400 font-medium mt-0.5 leading-snug">{item.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                    {/* Footer link */}
                    <div className="px-3 pb-3">
                      <div className="border-t border-gray-100 pt-2.5 flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">NexHouz</span>
                        <Link href="/contact" className="text-[9px] font-bold text-brand-red hover:underline flex items-center gap-1">
                          Talk to Expert <ArrowRight size={9} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <a href="tel:+918585854853" className="flex items-center gap-1.5 text-[11px] font-bold text-brand-black/55 hover:text-brand-black transition-colors">
            <Phone size={12} className="stroke-[2]" />
            <span>+91 85858 54853</span>
          </a>
          <Link href="/dashboard?tab=saved" className="p-2 hover:bg-gray-50 rounded-full transition-colors text-brand-black/40 hover:text-brand-black" aria-label="Saved">
            <Heart size={16} className="stroke-[2]" />
          </Link>
          <Link href="/contact" className="flex items-center justify-center text-[10px] font-extrabold tracking-widest text-white bg-brand-red hover:bg-brand-red/90 px-5 py-2.5 rounded-full uppercase transition-all shadow-sm hover:shadow-lg hover:shadow-brand-red/20 hover:scale-105 active:scale-95 whitespace-nowrap">
            Book Free Consultation
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-brand-black focus:outline-none cursor-pointer" aria-label="Toggle menu">
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl lg:hidden max-h-[85vh] overflow-y-auto"
          >
            <div className="p-4 space-y-1">
              {menus.map((menu) => (
                <div key={menu.label}>
                  <button
                    onClick={() => setExpandedMobile(expandedMobile === menu.label ? null : menu.label)}
                    className="w-full flex items-center justify-between px-3 py-3 text-xs font-extrabold uppercase tracking-widest text-brand-black/70 hover:text-brand-black cursor-pointer"
                  >
                    {menu.label}
                    <ChevronDown size={13} className={`transition-transform ${expandedMobile === menu.label ? "rotate-180 text-brand-red" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expandedMobile === menu.label && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-3 pb-2 space-y-1">
                          {menu.items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                              >
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                                  <Icon size={14} className="stroke-[1.8]" />
                                </div>
                                <span className="text-sm font-semibold text-brand-black">{item.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <a href="tel:+918585854853" className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-brand-black/60">
                  <Phone size={13} /> +91 85858 54853
                </a>
                <Link href="/contact" onClick={() => setIsOpen(false)} className="flex items-center justify-center text-xs font-extrabold tracking-widest text-white bg-brand-red py-3.5 uppercase rounded-full hover:bg-brand-red/90 transition-colors">
                  Book Free Consultation
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
