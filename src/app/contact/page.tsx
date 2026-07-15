"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Check, Clock, ShieldCheck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CONTAINER, SECTION_X, Reveal, Eyebrow, PHONE_TEL } from "@/components/ui/theme";
import { submitLead } from "@/lib/db";

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    message: ""
  });
  const [agree, setAgree] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return;

    setIsSubmitting(true);
    const success = await submitLead({
      name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      phone: form.mobile,
      notes: form.message,
      leadType: "general"
    });
    setIsSubmitting(false);
    if (success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ firstName: "", lastName: "", email: "", mobile: "", message: "" });
        setAgree(false);
      }, 3500);
    }
  };

  const channels = [
    {
      icon: MapPin,
      label: "Corporate Address",
      value: (
        <>
          B 609, 6th Floor, B-Block Asian Sun City,<br />
          Behind AMB Mall, Kothaguda X Road,<br />
          Kondapur, Hyderabad, Telangana 500084
        </>
      ),
    },
    {
      icon: Phone,
      label: "Direct Lines",
      value: (
        <span className="flex flex-col gap-1">
          <a href="tel:+918585854853" className="hover:text-[#f3c9cb] transition-colors">+91 85858 54853</a>
          <a href="tel:+919966998665" className="hover:text-[#f3c9cb] transition-colors">+91 99669 98665</a>
        </span>
      ),
    },
    {
      icon: Mail,
      label: "Email",
      value: (
        <a href="mailto:Info@nexhouz.com" className="hover:text-[#f3c9cb] transition-colors">Info@nexhouz.com</a>
      ),
    },
    {
      icon: Clock,
      label: "Hours",
      value: "Mon–Sun · 9 AM – 8 PM",
    },
  ];

  const inputClass =
    "w-full border-[1.5px] border-[#e0d9cb] rounded-[10px] px-[18px] py-4 text-base text-[#0A0A0A] placeholder-[#948d7c] focus:outline-none focus:border-[#D31E28] transition-colors bg-white";
  const labelClass = "text-[13px] font-semibold tracking-[0.1em] uppercase text-[#948d7c] mb-1.5 block";

  return (
    <div className="font-archivo bg-white">
      <Navbar />

      {/* Header band */}
      <section className={`${SECTION_X} pt-12 pb-12 lg:pt-16 lg:pb-16 bg-[#FAF7F1] border-b border-[#EEE9E0]`}>
        <div className={`${CONTAINER} max-w-[760px]`}>
          <Eyebrow>Contact NexHouz</Eyebrow>
          <h1 className="font-display font-semibold text-[32px] md:text-[44px] lg:text-[52px] leading-[1.12] text-[#0A0A0A] mt-3 text-balance">
            Let&apos;s find your home together.
          </h1>
          <p className="text-[16px] lg:text-lg leading-[1.7] text-[#57534a] mt-4 max-w-[560px]">
            An investment query, spatial guidance, or ready to take the next step in Hyderabad — a certified regional
            advisor responds within 4 hours. No spam, no pressure.
          </p>
        </div>
      </section>

      {/* Dark band: contact channels + form */}
      <section className={`${SECTION_X} py-14 lg:py-20 bg-[#0A0A0A]`}>
        <div className={`${CONTAINER} grid grid-cols-1 lg:grid-cols-[1fr_560px] gap-10 lg:gap-[70px] items-start`}>
          <Reveal>
            <Eyebrow light>Talk to a certified advisor</Eyebrow>
            <h2 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[44px] leading-[1.15] text-white mt-3 text-balance">
              Every conversation is buyer-side only.
            </h2>
            <p className="text-base lg:text-lg leading-[1.7] text-white/65 mt-4 max-w-[480px]">
              Reach us on any channel below, or send the briefing and we&apos;ll call you back with a verified shortlist.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
              {channels.map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.label} className="border border-white/[0.14] rounded-[14px] p-5">
                    <div className="w-10 h-10 rounded-[10px] bg-[#D31E28]/15 text-[#D31E28] flex items-center justify-center">
                      <Icon size={17} />
                    </div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45 mt-3">{c.label}</div>
                    <div className="text-[14.5px] leading-[1.55] text-white/85 mt-1.5">{c.value}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-5 mt-8 text-[15px] font-medium text-white/75">
              <span className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-[#D31E28]" /> Response within 4 hours
              </span>
              <span className="flex items-center gap-2">
                <Check size={15} className="text-[#D31E28]" strokeWidth={3} /> ₹0 fees, always
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="bg-white rounded-[18px] p-6 lg:p-[34px] lg:px-8">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="text-[20px] lg:text-[22px] font-semibold leading-[1.3] text-[#0A0A0A]">
                      Register your query
                    </div>
                    <p className="text-[14px] text-[#948d7c] mt-1.5">
                      Share your parameters — a certified advisor responds within 4 hours.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-5">
                      <div>
                        <label className={labelClass}>First name</label>
                        <input
                          type="text"
                          required
                          value={form.firstName}
                          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                          className={inputClass}
                          placeholder="Siddharth"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Last name</label>
                        <input
                          type="text"
                          required
                          value={form.lastName}
                          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                          className={inputClass}
                          placeholder="Reddy"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-3.5">
                      <div>
                        <label className={labelClass}>Email address</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className={inputClass}
                          placeholder="you@email.com"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Mobile number</label>
                        <input
                          type="tel"
                          required
                          value={form.mobile}
                          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                          className={inputClass}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                    <div className="mt-3.5">
                      <label className={labelClass}>Your message</label>
                      <textarea
                        rows={4}
                        required
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className={`${inputClass} resize-none`}
                        placeholder="Your property timeline, budget, or preferred Hyderabad locations."
                      />
                    </div>
                    <div className="flex items-start gap-3 mt-4">
                      <input
                        type="checkbox"
                        required
                        id="privacy-agree"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="mt-1 cursor-pointer accent-[#D31E28] w-4 h-4"
                      />
                      <label htmlFor="privacy-agree" className="text-[13px] leading-relaxed text-[#948d7c] cursor-pointer select-none">
                        I agree to be contacted about my query. My information stays private and is never sold.
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting || !agree}
                      className="w-full bg-[#D31E28] hover:bg-[#B8171F] disabled:bg-[#D31E28]/40 text-white text-[17px] font-semibold py-[18px] rounded-[10px] cursor-pointer disabled:cursor-not-allowed shadow-[0_6px_18px_rgba(211,30,40,0.3)] transition-colors mt-5"
                    >
                      {isSubmitting ? "Sending…" : "Send my message"}
                    </button>
                    <p className="text-[13.5px] text-[#948d7c] text-center mt-3">
                      No spam. A certified advisor responds within 4 hours.
                    </p>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    className="flex flex-col items-center justify-center py-12 text-center"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-14 h-14 rounded-full bg-[#D31E28] flex items-center justify-center">
                      <Check size={24} className="text-white" strokeWidth={3} />
                    </div>
                    <div className="text-[22px] font-semibold text-[#0A0A0A] mt-4">Message sent</div>
                    <p className="text-[15px] leading-relaxed text-[#57534a] mt-2 max-w-xs">
                      Your briefing reached our advisory team. A trusted advisor will connect with you shortly.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Map */}
      <section className={`${SECTION_X} py-14 lg:py-20 bg-white`}>
        <div className={CONTAINER}>
          <Reveal>
            <Eyebrow>Visit us</Eyebrow>
            <h2 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[44px] leading-[1.15] text-[#0A0A0A] mt-3">
              Our Hyderabad office.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-6 lg:mt-8 rounded-2xl overflow-hidden border border-[#EEE9E0] h-[320px] lg:h-[420px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.024320935778!2d78.3630342!3d17.45855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x83caa45fc340abd9%3A0xee9b39daa6d27739!2sNexdesk%20Coworking%20spaces!5e0!3m2!1sen!2sin!4v1781446910793!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
