"use client";

import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// NexHouz Web Style Guide — shared design tokens & primitives
//   Primary Red #D31E28 (hover #B8171F) · Near-Black #0A0A0A · Warm White #FAF7F1
//   Champagne #F6F1E7 · Gold #8A6D2F · Border #EEE9E0
//   Display: Cormorant Garamond 600 (.font-display) · UI/body: Archivo (.font-archivo)
// ─────────────────────────────────────────────────────────────────────────────

export const PHONE_DISPLAY = "+91 85858 54853";
export const PHONE_TEL = "tel:+918585854853";
export const EMAIL = "admin@nexhouz.com";

// Centers section content on large screens so cards keep design proportions
export const CONTAINER = "max-w-[1400px] mx-auto w-full";

// Standard horizontal section padding
export const SECTION_X = "px-4 md:px-6 xl:px-[60px]";

// Fade-up reveal per style guide (subtle, 20px, no parallax)
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Small tracking-wide section label — gold on light, red on dark
export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div
      className={`text-xs md:text-[13.5px] font-semibold tracking-[0.24em] uppercase ${
        light ? "text-[#D31E28]" : "text-[#8A6D2F]"
      }`}
    >
      {children}
    </div>
  );
}

// Serif section heading
export function SectionHeading({
  children,
  light = false,
  className = "",
}: {
  children: React.ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <h2
      className={`font-display font-semibold text-[28px] md:text-[40px] lg:text-[44px] leading-[1.2] lg:leading-[1.15] text-balance mt-3 lg:mt-4 ${
        light ? "text-white" : "text-[#0A0A0A]"
      } ${className}`}
    >
      {children}
    </h2>
  );
}
