"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Star, Award, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const team = [
  { name: "Arun Reddy", role: "Founder & CEO", bio: "15+ years transforming how Hyderabad professionals buy homes. Former McKinsey real estate vertical, IIT Bombay alumnus.", expertise: ["Strategy", "Luxury Residential", "NRI Investments"], image: "/images/real_estate_advisor_portrait.png", deals: "600+", rating: 5.0 },
  { name: "Priya Venkatesh", role: "Head of Advisory", bio: "Leads our certified advisor team. Deep expertise in Kokapet and Jubilee Hills corridors. Speaks 4 languages.", expertise: ["Luxury Villas", "Legal Clearances", "Negotiations"], image: "/images/expert_advisory_visual.png", deals: "340+", rating: 4.9 },
  { name: "Suresh Varma", role: "Legal & RERA Head", bio: "Former High Court advocate with 17 years of property law practice. Has cleared 500+ disputed title deeds.", expertise: ["Title Clearance", "RERA", "GHMC Approvals"], image: "/images/purchase_tracker_visual.png", deals: "520+", rating: 5.0 },
  { name: "Kavitha Sharma", role: "NRI Desk Lead", bio: "Specialized NRI property advisor. Facilitates seamless remote buying for overseas Indians across 12 countries.", expertise: ["NRI Services", "Virtual Tours", "Property Management"], image: "/images/ai_matchmaker_visual.png", deals: "210+", rating: 4.8 },
  { name: "Rahul Menon", role: "AI & Product", bio: "Leads NexHouz's AI-powered property matching engine. Ex-Google engineer. Makes complex data simple.", expertise: ["AI Matching", "Data Analytics", "PropTech"], image: "/images/robot_advisor_mascot.png", deals: "N/A", rating: 4.9 },
  { name: "Sneha Kapoor", role: "Client Success Manager", bio: "Ensures every NexHouz client feels heard. Manages post-purchase onboarding, loan coordination, and satisfaction.", expertise: ["Client Relations", "Loan Assistance", "Post-Purchase Support"], image: "/images/hero_modernist_villa.png", deals: "300+", rating: 5.0 },
];

export default function TeamPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        {/* Hero */}
        <section className="relative pt-32 pb-20 bg-white overflow-hidden">
          <div className="absolute inset-0 architectural-grid opacity-50" />
          <div className="relative max-w-7xl mx-auto px-6 text-center space-y-5">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-red/5 border border-brand-red/20 rounded-full mb-5">
                <Users size={10} className="text-brand-red" />
                <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-brand-red">Meet the Team</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-brand-black leading-tight tracking-tight mb-5">
                The People Behind<br /><span className="text-brand-red">Hyderabad's</span> Most Trusted Property Firm.
              </h1>
              <p className="text-sm text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
                Every NexHouz advisor is a certified real estate specialist with deep Hyderabad market knowledge. We are not a call center — we are a small, focused team that genuinely cares about your outcome.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-wrap justify-center gap-6 pt-2">
              {[
                { value: "20+", label: "Team Members" },
                { value: "5 Yrs", label: "Avg Experience" },
                { value: "4.9★", label: "Avg Client Rating" },
                { value: "2,000+", label: "Deals Facilitated" },
              ].map(s => (
                <div key={s.label} className="text-center px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl">
                  <p className="text-2xl font-extrabold text-brand-black">{s.value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Team Grid */}
        <section className="py-16 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {team.map((member, idx) => (
                <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.1 }} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:border-brand-red/15 transition-all group">
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div>
                        <p className="text-white font-extrabold text-lg">{member.name}</p>
                        <p className="text-white/70 text-xs font-medium">{member.role}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        <Star size={10} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs font-extrabold text-white">{member.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">{member.bio}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {member.expertise.map(e => (
                        <span key={e} className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-bold text-gray-600">{e}</span>
                      ))}
                    </div>
                    {member.deals !== "N/A" && (
                      <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                        <div>
                          <p className="text-xl font-extrabold text-brand-black">{member.deals}</p>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Deals</p>
                        </div>
                        <div className="w-px h-8 bg-gray-100" />
                        <div>
                          <p className="text-xl font-extrabold text-brand-black">{member.rating}</p>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Rating</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-black py-16">
          <div className="max-w-3xl mx-auto px-6 text-center space-y-5">
            <h2 className="text-4xl font-extrabold text-white">Want to join our team?</h2>
            <p className="text-sm text-white/55 font-medium">We're always looking for exceptional property advisors, legal experts, and tech talent who share our mission.</p>
            <Link href="/careers" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-red hover:bg-brand-red/90 text-white text-sm font-extrabold uppercase tracking-wider rounded-full transition-all hover:scale-105">
              See Open Positions <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
