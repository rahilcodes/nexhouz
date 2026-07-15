"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Phone, Home, LayoutGrid, Scale, Globe, UserCheck, Info,
  Briefcase, Calculator, ArrowLeftRight, Ruler, ChevronDown, Sparkles, Check,
} from "lucide-react";
import { CONTAINER, PHONE_DISPLAY, PHONE_TEL } from "@/components/ui/theme";

export const menus = [
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
      { icon: Sparkles, label: "AI Advisor Chat", desc: "24/7 smart real estate advisor", href: "/chat", badge: "Live" },
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
      { icon: Briefcase, label: "Careers", desc: "Join Hyderabad's most trusted property firm", href: "/careers" },
    ]
  }
];

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // On the homepage the CTA scrolls to the callback form; elsewhere it opens /contact
  const handleBookSession = () => {
    const form = document.getElementById("callback-form-section");
    if (form) {
      form.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/contact");
    }
  };

  const handleEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(label);
  };
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120);
  };

  return (
    <header className="relative z-[60] bg-white font-archivo">
      {/* Trust strip */}
      <div className="hidden lg:block px-6 xl:px-[60px] py-3 bg-[#0A0A0A] text-white">
        <div className={`${CONTAINER} flex items-center justify-between`}>
          <div className="flex gap-8 text-sm font-medium">
            {["RERA Registered", "GHMC Approved", "100% Legal-Clear Properties"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <Check size={13} className="text-[#D31E28]" strokeWidth={3} /> {t}
              </span>
            ))}
          </div>
          <div className="flex gap-7 text-sm font-medium items-center">
            <a href={PHONE_TEL} className="flex items-center gap-1.5 text-white hover:text-[#f3c9cb] transition-colors">
              <Phone size={13} /> {PHONE_DISPLAY}
            </a>
            <span className="text-[#f3c9cb]">Mon–Sun · 9 AM – 8 PM</span>
          </div>
        </div>
      </div>

      {/* Nav row */}
      <div className="px-4 md:px-6 xl:px-[60px] border-b border-[#EEE9E0] bg-white">
        <div className={`${CONTAINER} flex items-center justify-between py-3 lg:py-3.5`}>
          <Link href="/" className="shrink-0" aria-label="NexHouz home">
            <img
              src="/images/logo_black_text_mainlogo.png"
              alt="NexHouz"
              className="h-10 lg:h-[52px] xl:h-[58px] w-auto object-contain"
            />
          </Link>

          {/* Desktop menu */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-3">
            {menus.map((menu) => (
              <div
                key={menu.label}
                className="relative"
                onMouseEnter={() => handleEnter(menu.label)}
                onMouseLeave={handleLeave}
              >
                <button
                  className={`flex items-center gap-1.5 px-3 xl:px-4 py-2.5 rounded-lg text-[15px] xl:text-base font-medium transition-colors cursor-pointer ${
                    activeMenu === menu.label ? "text-[#D31E28] bg-[#FAF7F1]" : "text-[#2b2823] hover:text-[#D31E28]"
                  }`}
                >
                  {menu.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      activeMenu === menu.label ? "rotate-180 text-[#D31E28]" : "text-[#948d7c]"
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {activeMenu === menu.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      onMouseEnter={() => handleEnter(menu.label)}
                      onMouseLeave={handleLeave}
                      className="absolute top-full left-0 mt-2 w-80 bg-white border border-[#EEE9E0] rounded-2xl shadow-[0_18px_50px_rgba(30,25,15,0.14)] overflow-hidden"
                    >
                      <div className="p-2">
                        {menu.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = pathname === item.href;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setActiveMenu(null)}
                              className={`flex items-start gap-3.5 p-3 rounded-xl transition-colors group/item ${
                                isActive ? "bg-[#FAF7F1]" : "hover:bg-[#FAF7F1]"
                              }`}
                            >
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                  isActive
                                    ? "bg-[#D31E28] text-white"
                                    : "bg-[#FAF7F1] text-[#8A6D2F] group-hover/item:bg-[#D31E28] group-hover/item:text-white"
                                }`}
                              >
                                <Icon size={16} className="stroke-[1.8]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-[15px] font-semibold transition-colors ${
                                      isActive ? "text-[#D31E28]" : "text-[#0A0A0A] group-hover/item:text-[#D31E28]"
                                    }`}
                                  >
                                    {item.label}
                                  </span>
                                  {"badge" in item && item.badge && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#D31E28] text-white px-1.5 py-0.5 rounded-full">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[13px] text-[#948d7c] mt-0.5 leading-snug">{item.desc}</p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <button
            onClick={handleBookSession}
            className="hidden lg:inline-block bg-[#D31E28] hover:bg-[#B8171F] text-white text-[15px] xl:text-base font-semibold px-6 xl:px-7 py-3.5 xl:py-4 rounded-lg cursor-pointer shadow-[0_4px_14px_rgba(211,30,40,0.25)] transition-colors whitespace-nowrap"
          >
            Book Free Expert Session
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="lg:hidden w-11 h-11 rounded-[10px] bg-[#f4efe6] flex flex-col items-center justify-center gap-1 cursor-pointer"
          >
            <span className="w-[18px] h-0.5 bg-[#0A0A0A]" />
            <span className="w-[18px] h-0.5 bg-[#0A0A0A]" />
            <span className="w-[18px] h-0.5 bg-[#0A0A0A]" />
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-white overflow-y-auto lg:hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#EEE9E0]">
              <img src="/images/logo_black_text_mainlogo.png" alt="NexHouz" className="h-10 w-auto object-contain" />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="w-11 h-11 rounded-[10px] bg-[#f4efe6] flex items-center justify-center cursor-pointer"
              >
                <X size={20} className="text-[#0A0A0A]" />
              </button>
            </div>
            <div className="p-4 pb-10">
              {menus.map((menu) => (
                <div key={menu.label} className="border-b border-[#f0ebe1]">
                  <button
                    onClick={() => setExpandedMobile(expandedMobile === menu.label ? null : menu.label)}
                    className="w-full flex items-center justify-between px-2 py-4 text-base font-semibold text-[#0A0A0A] cursor-pointer"
                  >
                    {menu.label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${expandedMobile === menu.label ? "rotate-180 text-[#D31E28]" : "text-[#948d7c]"}`}
                    />
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
                        <div className="pb-3 space-y-1">
                          {menu.items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-[#FAF7F1] transition-colors"
                              >
                                <div className="w-9 h-9 rounded-[10px] bg-[#FAF7F1] flex items-center justify-center text-[#8A6D2F] shrink-0">
                                  <Icon size={15} className="stroke-[1.8]" />
                                </div>
                                <span className="text-[15px] font-medium text-[#2b2823]">{item.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <div className="pt-5 space-y-3">
                <a
                  href={PHONE_TEL}
                  className="flex items-center justify-center gap-2 border-[1.5px] border-[#d8d2c6] text-[#0A0A0A] text-base font-semibold py-4 rounded-xl"
                >
                  <Phone size={15} /> {PHONE_DISPLAY}
                </a>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setTimeout(handleBookSession, 150);
                  }}
                  className="w-full bg-[#D31E28] hover:bg-[#B8171F] text-white text-base font-semibold py-4 rounded-xl cursor-pointer shadow-[0_6px_16px_rgba(211,30,40,0.25)] transition-colors"
                >
                  Book Free Expert Session
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
