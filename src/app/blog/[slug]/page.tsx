import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Tag, User, MessageSquare, ArrowRight, Star } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { blogPosts } from "@/data/blog";
import { properties } from "@/data/properties";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const post = blogPosts.find((p) => p.slug === slug);

  // Fallback if post not found
  if (!post) {
    return (
      <>
        <Navbar />
        <main className="flex-grow bg-white min-h-screen pt-36 pb-32 flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-serif text-3xl font-light text-brand-black mb-4">Essay Not Located</h2>
          <p className="text-xs text-brand-black/50 leading-relaxed font-sans max-w-sm mb-8">
            The requested spatial publication could not be found inside the private registry. It may have been archived.
          </p>
          <Link
            href="/blog"
            className="px-6 py-3 bg-brand-black text-white text-xs tracking-widest font-extrabold uppercase"
          >
            Return to Insights
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  // Showcase a matching property on the sidebar for high conversion
  const featuredProp = properties[0];

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-white min-h-screen pt-36 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Back Nav Link */}
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-xs tracking-widest font-extrabold text-brand-black/60 hover:text-brand-black uppercase mb-12 group"
          >
            <ArrowLeft size={12} className="transform transition-transform duration-300 group-hover:-translate-x-0.5" />
            <span>Back to Insights</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* ========================================== */}
            {/* MAIN ARTICLE BODY                          */}
            {/* ========================================== */}
            <article className="lg:col-span-8 space-y-10">
              
              {/* Meta Tags */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4 text-xs tracking-widest font-bold uppercase text-brand-black/40">
                  <span className="flex items-center space-x-1">
                    <Tag size={10} className="text-brand-red" />
                    <span>{post.category}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Clock size={10} />
                    <span>{post.readTime}</span>
                  </span>
                </div>

                <h1 className="text-serif text-4xl md:text-6xl font-light text-brand-black tracking-tight leading-[1.1]">
                  {post.title}
                </h1>

                <p className="text-sm md:text-base font-light text-brand-black/50 leading-relaxed font-sans italic border-l-2 border-brand-red pl-4">
                  {post.excerpt}
                </p>
              </div>

              {/* Cover Image */}
              <div className="aspect-[16/9] overflow-hidden bg-brand-gray border border-black/5 shadow-luxury">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Author Row */}
              <div className="flex items-center justify-between py-6 border-y border-brand-gray-dark">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-brand-black text-white flex items-center justify-center font-bold text-sm">
                    {post.author.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brand-black">{post.author}</h4>
                    <p className="text-xs text-brand-black/40 font-bold uppercase tracking-wider">{post.authorRole}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-brand-black/50 font-semibold uppercase">
                  <Calendar size={12} className="text-brand-red" />
                  <span>{post.date}</span>
                </div>
              </div>

              {/* Prose Content */}
              <div 
                className="prose prose-neutral max-w-none text-brand-black/80 font-sans text-sm md:text-base leading-relaxed space-y-6
                  prose-headings:text-serif prose-headings:font-light prose-headings:text-brand-black prose-headings:tracking-tight
                  prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:pt-8 prose-h2:border-t prose-h2:border-brand-gray-dark
                  prose-blockquote:border-l-4 prose-blockquote:border-brand-red prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-brand-black/70 prose-blockquote:font-light prose-blockquote:text-lg prose-blockquote:my-8
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
                  prose-strong:font-bold prose-strong:text-brand-black"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

            </article>

            {/* ========================================== */}
            {/* HIGH-CONVERSION SIDEBAR                   */}
            {/* ========================================== */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-8">
              
              <div className="glass-panel p-6 shadow-luxury space-y-6 bg-brand-gray/10">
                <div className="space-y-1">
                  <span className="text-xs tracking-widest text-brand-black/40 font-bold uppercase">Spatial Connection</span>
                  <h4 className="text-serif text-xl font-light text-brand-black">Corresponding Estatement</h4>
                </div>

                <div className="bg-white border border-black/5 overflow-hidden group shadow-luxury">
                  <div className="aspect-[4/3] overflow-hidden bg-brand-gray relative">
                    <img src={featuredProp.image} alt={featuredProp.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-0.5 flex items-center space-x-1 border border-black/5">
                      <Star size={8} className="text-brand-red fill-brand-red" />
                      <span className="text-xs font-bold text-brand-black">{featuredProp.scores.architecturalIntegrity} AQ</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs text-brand-black/40 font-bold uppercase tracking-wider">{featuredProp.location}</span>
                      <h5 className="text-serif text-lg font-light text-brand-black">{featuredProp.title}</h5>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-brand-gray-dark text-xs text-brand-black/50 uppercase font-bold">
                      <span>{featuredProp.bhk} BHK • {featuredProp.area}</span>
                      <span className="text-xs font-semibold text-brand-black">${(featuredProp.price / 1000000).toFixed(1)}M</span>
                    </div>
                    <Link
                      href={`/properties`}
                      className="w-full py-3 bg-brand-black hover:bg-brand-red text-white text-xs tracking-widest font-extrabold uppercase text-center block transition-all duration-300"
                    >
                      Acquire Intelligence
                    </Link>
                  </div>
                </div>
              </div>

              {/* Call to Register Briefing */}
              <div className="bg-brand-black text-white p-6 shadow-luxury space-y-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 architectural-grid pointer-events-none" />
                <span className="text-xs tracking-widest text-white/40 font-bold uppercase block relative z-10">Private Briefing</span>
                <h4 className="text-serif text-xl font-light text-white relative z-10">Subscribe to Curation Reports</h4>
                <p className="text-sm font-light text-white/60 leading-relaxed relative z-10">
                  Receive full structural dossiers and off-market asset disclosures direct to your private inbox.
                </p>
                <Link
                  href="/dashboard"
                  className="flex items-center justify-between text-xs tracking-widest font-bold uppercase text-white bg-brand-red hover:bg-white hover:text-brand-black px-4 py-3 relative z-10 transition-colors duration-300 group"
                >
                  <span>Register KYC Portal</span>
                  <ArrowRight size={12} className="transform transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>

            </aside>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}
