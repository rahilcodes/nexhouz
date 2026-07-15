import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Tag, ArrowRight, ShieldCheck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { blogPosts } from "@/data/blog";
import { properties } from "@/data/properties";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

const CONTAINER = "max-w-[1400px] mx-auto w-full";
const SECTION_X = "px-4 md:px-6 xl:px-[60px]";

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const post = blogPosts.find((p) => p.slug === slug);

  // Fallback if post not found
  if (!post) {
    return (
      <div className="font-archivo bg-white">
        <Navbar />
        <main className={`${SECTION_X} py-24 lg:py-32 flex flex-col items-center justify-center text-center`}>
          <h2 className="font-display font-semibold text-[32px] text-[#0A0A0A] mb-4">Essay not found</h2>
          <p className="text-[15px] text-[#57534a] leading-relaxed max-w-sm mb-8">
            The article you&apos;re looking for could not be found. It may have been moved or archived.
          </p>
          <Link
            href="/blog"
            className="px-7 py-4 bg-[#0A0A0A] hover:bg-[#D31E28] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Return to the journal
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Showcase a matching property on the sidebar for high conversion
  const featuredProp = properties[0];
  const priceCr = featuredProp.price >= 10000000
    ? `₹${parseFloat((featuredProp.price / 10000000).toFixed(2))} Cr`
    : `₹${parseFloat((featuredProp.price / 100000).toFixed(2))} Lakhs`;

  return (
    <div className="font-archivo bg-white">
      <Navbar />

      <main className={`${SECTION_X} py-12 lg:py-16`}>
        <div className={CONTAINER}>
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[13px] tracking-wide font-semibold text-[#57534a] hover:text-[#D31E28] uppercase mb-8 lg:mb-12 group"
          >
            <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
            Back to the journal
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Main article */}
            <article className="lg:col-span-8">
              <div className="flex items-center gap-4 text-[11px] tracking-[0.14em] font-bold uppercase text-[#948d7c]">
                <span className="flex items-center gap-1.5 text-[#8A6D2F]">
                  <Tag size={11} className="text-[#D31E28]" />
                  {post.category}
                </span>
                <span className="text-[#e0d9cb]">•</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={11} />
                  {post.readTime}
                </span>
              </div>

              <h1 className="font-display font-semibold text-[32px] md:text-[48px] lg:text-[56px] text-[#0A0A0A] leading-[1.1] mt-4 text-balance">
                {post.title}
              </h1>

              <p className="text-[16px] md:text-[18px] text-[#57534a] leading-relaxed italic border-l-2 border-[#D31E28] pl-4 mt-5">
                {post.excerpt}
              </p>

              {/* Cover image */}
              <div className="aspect-[16/9] overflow-hidden bg-[#efeae1] border border-[#EEE9E0] rounded-2xl mt-8">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>

              {/* Author row */}
              <div className="flex items-center justify-between py-5 border-y border-[#EEE9E0] mt-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center font-semibold text-sm">
                    {post.author.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold text-[#0A0A0A]">{post.author}</h4>
                    <p className="text-[11px] text-[#948d7c] font-bold uppercase tracking-wider">{post.authorRole}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[13px] text-[#57534a] font-semibold uppercase">
                  <Calendar size={13} className="text-[#D31E28]" />
                  {post.date}
                </div>
              </div>

              {/* Prose content */}
              <div
                className="prose prose-neutral max-w-none text-[#44403a] text-[16px] leading-[1.8] mt-8
                  prose-headings:font-display prose-headings:font-semibold prose-headings:text-[#0A0A0A]
                  prose-h2:text-[26px] prose-h2:md:text-[32px] prose-h2:pt-8 prose-h2:mt-8 prose-h2:border-t prose-h2:border-[#EEE9E0]
                  prose-a:text-[#D31E28] prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-4 prose-blockquote:border-[#D31E28] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-[#2b2823] prose-blockquote:font-normal prose-blockquote:text-lg prose-blockquote:my-8
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
                  prose-strong:font-semibold prose-strong:text-[#0A0A0A]"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4 lg:sticky lg:top-6 space-y-6">
              <div className="bg-[#FAF7F1] border border-[#EEE9E0] rounded-2xl p-6">
                <div className="text-[11px] tracking-[0.18em] text-[#8A6D2F] font-semibold uppercase">Featured residence</div>
                <h4 className="font-display font-semibold text-[22px] text-[#0A0A0A] mt-1">A home worth touring.</h4>

                <div className="bg-white border border-[#EEE9E0] rounded-xl overflow-hidden group mt-5">
                  <Link href="/properties" className="relative block aspect-[4/3] overflow-hidden bg-[#efeae1]">
                    <img
                      src={featuredProp.image}
                      alt={featuredProp.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 bg-emerald-500 text-white rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck size={10} /> Legal Clear
                    </span>
                  </Link>
                  <div className="p-5">
                    <span className="text-[11px] text-[#948d7c] font-bold uppercase tracking-[0.18em]">
                      {featuredProp.location.split(",")[0]}
                    </span>
                    <Link
                      href="/properties"
                      className="block font-display font-semibold text-[19px] text-[#D31E28] hover:text-[#B8171F] transition-colors mt-1.5"
                    >
                      {featuredProp.title}
                    </Link>
                    <div className="flex justify-between items-center pt-3.5 mt-3.5 border-t border-[#EEE9E0] text-[12px] text-[#948d7c] uppercase font-bold tracking-wide">
                      <span>{featuredProp.bhk} BHK · {featuredProp.area}</span>
                      <span className="text-[#D31E28]">{priceCr}</span>
                    </div>
                    <Link
                      href="/properties"
                      className="w-full mt-4 py-3 bg-[#0A0A0A] hover:bg-[#D31E28] text-white text-[11px] tracking-widest font-bold uppercase text-center block rounded-full transition-colors"
                    >
                      View property
                    </Link>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-[#0A0A0A] text-white rounded-2xl p-6">
                <div className="text-[11px] tracking-[0.18em] text-[#D31E28] font-semibold uppercase">Free Expert Session</div>
                <h4 className="font-display font-semibold text-[22px] text-white mt-1.5">Talk to a certified advisor.</h4>
                <p className="text-[14px] text-white/60 leading-relaxed mt-2">
                  Verified shortlists, 47-point audits, and zero brokerage — buyer-side only.
                </p>
                <Link
                  href="/contact"
                  className="flex items-center justify-between text-[12px] tracking-widest font-bold uppercase text-white bg-[#D31E28] hover:bg-[#B8171F] px-4 py-3.5 mt-4 rounded-lg transition-colors group"
                >
                  <span>Book free session</span>
                  <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}
