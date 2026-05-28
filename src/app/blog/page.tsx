"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen, Clock, Tag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { blogPosts, BlogPost } from "@/data/blog";

export default function BlogIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Design & Architecture", "PropTech & Finance", "Sustainability"];

  const filteredPosts = blogPosts.filter((post) => {
    return selectedCategory === "All" || post.category === selectedCategory;
  });

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-white min-h-screen pt-36 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="max-w-2xl space-y-4 mb-16 border-b border-brand-gray-dark pb-10">
            <span className="text-[10px] tracking-[0.3em] font-bold text-brand-red uppercase">Essays & Perspectives</span>
            <h1 className="text-serif text-4xl md:text-5xl font-light tracking-tight text-brand-black">
              The Editorial Insights
            </h1>
            <p className="text-xs font-light text-brand-black/50 leading-relaxed font-sans max-w-lg">
              Critical readings detailing modern modernist architecture, global real estate economics, and micro-climate enclaves.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all duration-300 rounded-none border ${
                  selectedCategory === cat
                    ? "bg-brand-black border-brand-black text-white"
                    : "bg-transparent border-black/10 hover:border-brand-black text-brand-black/60 hover:text-brand-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Blog grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    className="group flex flex-col h-full bg-brand-gray/5 border border-black/5 hover:border-brand-black/20 hover:shadow-luxury transition-all duration-300"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-brand-gray relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      />
                      
                      {post.featured && (
                        <div className="absolute top-4 left-4 bg-brand-red text-white px-2 py-0.5 text-[8px] tracking-widest font-extrabold uppercase">
                          Featured Essay
                        </div>
                      )}
                    </div>
                    
                    <div className="p-8 flex-grow flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-[9px] tracking-widest font-bold uppercase text-brand-black/40">
                          <span className="flex items-center space-x-1">
                            <Tag size={10} className="text-brand-red" />
                            <span>{post.category}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock size={10} />
                            <span>{post.readTime}</span>
                          </span>
                        </div>
                        
                        <h3 className="text-serif text-xl font-light text-brand-black group-hover:text-brand-red transition-colors duration-300">
                          {post.title}
                        </h3>
                        
                        <p className="text-xs font-light text-brand-black/60 leading-relaxed font-sans line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-brand-gray-dark flex items-center justify-between text-[10px] tracking-wider text-brand-black/75">
                        <div className="flex flex-col">
                          <span className="font-semibold">By {post.author}</span>
                          <span className="text-[8px] text-brand-black/40 font-bold uppercase mt-0.5">{post.authorRole.split(" ")[0]}</span>
                        </div>
                        <span className="font-light">{post.date}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
