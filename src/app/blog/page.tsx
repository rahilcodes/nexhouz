"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Tag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CONTAINER, SECTION_X, Eyebrow } from "@/components/ui/theme";
import { blogPosts } from "@/data/blog";

export default function BlogIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Design & Architecture", "PropTech & Finance", "Sustainability"];

  const filteredPosts = blogPosts.filter((post) => {
    return selectedCategory === "All" || post.category === selectedCategory;
  });

  return (
    <div className="font-archivo bg-white">
      <Navbar />

      {/* Header band */}
      <section className={`${SECTION_X} pt-12 pb-12 lg:pt-16 lg:pb-16 bg-[#FAF7F1] border-b border-[#EEE9E0]`}>
        <div className={`${CONTAINER} max-w-[760px]`}>
          <Eyebrow>Essays &amp; Perspectives</Eyebrow>
          <h1 className="font-display font-semibold text-[32px] md:text-[44px] lg:text-[52px] leading-[1.12] text-[#0A0A0A] mt-3 text-balance">
            The NexHouz journal.
          </h1>
          <p className="text-[16px] lg:text-lg leading-[1.7] text-[#57534a] mt-4 max-w-[560px]">
            Readings on modern architecture, Hyderabad real-estate economics, and the micro-markets shaping the city.
          </p>
        </div>
      </section>

      <section className={`${SECTION_X} py-14 lg:py-20 bg-white`}>
        <div className={CONTAINER}>
          {/* Category filter chips */}
          <div className="flex flex-wrap items-center gap-2.5 mb-8 lg:mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 text-[13px] font-semibold tracking-wide transition-colors rounded-full border ${
                  selectedCategory === cat
                    ? "bg-[#0A0A0A] border-[#0A0A0A] text-white"
                    : "bg-transparent border-[#d8d2c6] hover:border-[#0A0A0A] text-[#57534a] hover:text-[#0A0A0A]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Blog grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post) => (
                <motion.div
                  layout
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col h-full bg-white border border-[#EEE9E0] rounded-2xl overflow-hidden hover:shadow-[0_10px_30px_rgba(30,25,15,0.08)] transition-shadow"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-[#efeae1] relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {post.featured && (
                        <div className="absolute top-3.5 left-3.5 bg-[#D31E28] text-white px-3 py-1 text-[11px] tracking-wider font-bold uppercase rounded-full">
                          Featured Essay
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-grow flex flex-col justify-between gap-5">
                      <div>
                        <div className="flex items-center justify-between text-[11px] tracking-[0.14em] font-bold uppercase text-[#948d7c]">
                          <span className="flex items-center gap-1.5 text-[#8A6D2F]">
                            <Tag size={11} className="text-[#D31E28]" />
                            {post.category}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={11} />
                            {post.readTime}
                          </span>
                        </div>

                        <h3 className="font-display font-semibold text-[22px] leading-snug text-[#0A0A0A] group-hover:text-[#D31E28] transition-colors mt-3">
                          {post.title}
                        </h3>

                        <p className="text-[14px] text-[#57534a] leading-relaxed line-clamp-3 mt-2.5">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-5 border-t border-[#EEE9E0] flex items-center justify-between text-[13px] text-[#57534a]">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#2b2823]">By {post.author}</span>
                          <span className="text-[11px] text-[#948d7c] font-bold uppercase mt-0.5">{post.authorRole.split(" ")[0]}</span>
                        </div>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
