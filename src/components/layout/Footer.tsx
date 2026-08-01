"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { CONTAINER, PHONE_DISPLAY, PHONE_TEL, EMAIL } from "@/components/ui/theme";

const explore = [
  { label: "Buy a home", href: "/properties" },
  { label: "New launches", href: "/new-launches" },
  { label: "Ready to move", href: "/ready-to-move" },
  { label: "Compare properties", href: "/compare" },
];

const company = [
  { label: "About NexHouz", href: "/about" },
  { label: "Second opinion", href: "/second-opinion" },
  { label: "Expert advisory", href: "/expert-advisory" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#F6F1E7] px-4 md:px-6 xl:px-[60px] pt-10 lg:pt-[60px] font-archivo">
      <div className={CONTAINER}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-8 lg:gap-[50px] pb-8 lg:pb-[50px] border-b border-[#e0d9cb]">
          <div>
            <img src="/images/logo_black_text_mainlogo.png" alt="NexHouz" className="h-11 lg:h-14 w-auto object-contain" />
            <p className="text-[14px] lg:text-[15px] leading-[1.65] text-[#57534a] mt-4 max-w-[320px]">
              Hyderabad&apos;s premium, tech-enabled home-buying advisory. Buyer-side only — verified properties, expert
              guidance, zero brokerage.
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold tracking-[0.14em] text-[#8A6D2F] mb-4 lg:mb-[18px]">EXPLORE</div>
            <div className="flex flex-col gap-3 text-[15px] lg:text-[15.5px] font-medium">
              {explore.map((l) => (
                <Link key={l.label} href={l.href} className="text-[#2b2823] hover:text-[#D31E28] transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold tracking-[0.14em] text-[#8A6D2F] mb-4 lg:mb-[18px]">COMPANY</div>
            <div className="flex flex-col gap-3 text-[15px] lg:text-[15.5px] font-medium">
              {company.map((l) => (
                <Link key={l.label} href={l.href} className="text-[#2b2823] hover:text-[#D31E28] transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold tracking-[0.14em] text-[#8A6D2F] mb-4 lg:mb-[18px]">REACH US</div>
            <div className="flex flex-col gap-3 text-[15px] lg:text-[15.5px] font-medium text-[#2b2823] leading-normal">
              <a href={PHONE_TEL} className="flex items-center gap-2 hover:text-[#D31E28] transition-colors">
                <Phone size={14} /> {PHONE_DISPLAY}
              </a>
              <a href={`mailto:${EMAIL}`} className="hover:text-[#D31E28] transition-colors">
                {EMAIL}
              </a>
              <span className="font-normal text-[#57534a]">
                B-609, B Block, Asian Sun City, Kothaguda X Road, Kondapur, Hyderabad 500084
              </span>
              <span className="font-normal text-[#57534a]">WhatsApp us for instant AI matching</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 py-5 lg:py-[22px] text-[12.5px] lg:text-[13.5px] text-[#948d7c]">
          <span>© {new Date().getFullYear()} NexHouz Real Estate Advisory · All rights reserved</span>
          <span>RERA Registered · GHMC Approved · Buyer-side advisory only</span>
        </div>
      </div>
    </footer>
  );
}
