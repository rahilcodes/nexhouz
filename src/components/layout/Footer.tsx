"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white/90 border-t border-white/5 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-white/10">
          
          {/* Column 1: Brand & Narrative */}
          <div className="space-y-6">
            <Link href="/" className="group inline-block focus:outline-none">
              <img
                src="/images/complete_white_logo.png"
                alt="NexHouz Logo"
                className="h-10 md:h-12 w-auto object-contain"
              />
            </Link>
            
            <p className="text-xs font-light text-white/60 leading-relaxed">
              NexHouz is a trusted real estate platform dedicated to helping buyers and investors find the perfect property in Hyderabad. We provide verified listings, expert guidance, and seamless support from reputed developers.
            </p>
            
            {/* Social Icons - Handcrafted Custom SVGs for absolute safety */}
            <div className="flex items-center space-x-4 pt-2">
              <a href="#" aria-label="Twitter" className="p-2 bg-white/5 hover:bg-brand-red hover:text-white rounded-full transition-all duration-300 flex items-center justify-center">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2 bg-white/5 hover:bg-brand-red hover:text-white rounded-full transition-all duration-300 flex items-center justify-center">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c-0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="p-2 bg-white/5 hover:bg-brand-red hover:text-white rounded-full transition-all duration-300 flex items-center justify-center">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Our Services */}
          <div className="space-y-6 md:pl-6">
            <h4 className="text-xs font-bold tracking-[0.3em] uppercase text-white/40">Our Services</h4>
            <ul className="space-y-4 text-xs font-medium text-white/70">
              <li>
                <Link href="/properties?type=Villa" className="hover:text-brand-red transition-all duration-300">
                  Premium Villas
                </Link>
              </li>
              <li>
                <Link href="/properties?type=Penthouse" className="hover:text-brand-red transition-all duration-300">
                  Luxury Apartments
                </Link>
              </li>
              <li>
                <Link href="/properties?type=Estate" className="hover:text-brand-red transition-all duration-300">
                  Commercial Developments
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Useful Links */}
          <div className="space-y-6 md:pl-6">
            <h4 className="text-xs font-bold tracking-[0.3em] uppercase text-white/40">Useful Links</h4>
            <ul className="space-y-4 text-xs font-medium text-white/70">
              <li>
                <Link href="/" className="hover:text-brand-red transition-all duration-300">
                  Home Portal
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-red transition-all duration-300">
                  About NexHouz
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-brand-red transition-all duration-300">
                  Properties Registry
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-red transition-all duration-300">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Office Info */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold tracking-[0.3em] uppercase text-white/40">Hyderabad Office</h4>
            <div className="space-y-4 text-xs font-light text-white/70 leading-relaxed font-sans">
              <div>
                <span className="font-bold text-[9px] uppercase text-white/40 block mb-1">Corporate Address</span>
                <p>
                  B 109, B-BLOCK Asian Sun City,<br />
                  Behind AMB Mall, Forest Dept Colony,<br />
                  Kothaguda X Road, Kondapur,<br />
                  Hyderabad, Telangana 500084
                </p>
              </div>
              <div>
                <span className="font-bold text-[9px] uppercase text-white/40 block mb-1">Direct Lines</span>
                <p className="space-y-1">
                  <span className="block">+91 8585854853</span>
                  <span className="block">+91 9966998665</span>
                </p>
              </div>
              <div>
                <span className="font-bold text-[9px] uppercase text-white/40 block mb-1">Email Curation</span>
                <p>Info@nexhouz.com</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Metadata & Legal */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-12 text-[10px] tracking-widest uppercase text-white/40 font-semibold space-y-4 md:space-y-0">
          <div>
            © {new Date().getFullYear()} NexHouz Real Estate Advisor. All rights reserved.
          </div>
          <div className="flex items-center space-x-8">
            <a href="#" className="hover:text-white transition-colors duration-300">Sovereign Compliance</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Ledger Security</a>
            <a href="#" className="hover:text-white transition-colors duration-300">API Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
