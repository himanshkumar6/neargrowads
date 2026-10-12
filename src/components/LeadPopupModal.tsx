"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Send, CheckCircle2, Building2, Phone, Mail, User, ChevronDown } from "lucide-react";
import { submitContactForm } from "@/app/actions/contact";
import { toast } from "sonner";

export default function LeadPopupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    service: "Google Business Profile & Maps Optimization",
    message: "",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const serviceOptions = [
    "Google Business Profile & Maps Optimization",
    "Meta Ads (Facebook & Instagram)",
    "Google Search Ads",
    "Local SEO & Citations",
    "Creative & Reel Editing Services",
    "Landing Page & Web Design",
    "Full Local Visibility Audit"
  ];

  const handleClose = () => {
    try {
      sessionStorage.setItem("neargrow_lead_modal_dismissed", "true");
    } catch {
      // Storage unavailable or blocked
    }
    setIsOpen(false);
  };

  useEffect(() => {
    // 1. Custom Event Listener: On-demand CTA button clicks ALWAYS open modal unconditionally
    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener("openLeadModal", handleOpenModal);

    // 2. Check if user already dismissed modal during this session
    const isDismissed = typeof window !== "undefined" ? sessionStorage.getItem("neargrow_lead_modal_dismissed") : null;
    let timer: NodeJS.Timeout | undefined;
    if (!isDismissed) {
      // Optimized Deferred Timer: Appears smoothly after 8 seconds once page animations settle
      timer = setTimeout(() => {
        setIsOpen(true);
      }, 8000);
    }

    return () => {
      window.removeEventListener("openLeadModal", handleOpenModal);
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Lock body scroll and listen for Escape key when open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      toast.error("Please enter a valid full name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      toast.error("Please enter a valid phone number (10 to 15 digits).");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitContactForm({
        ...formData,
        source: "get_in_touch",
      });
      if (res.success) {
        setIsSubmitted(true);
        sessionStorage.setItem("neargrow_lead_modal_dismissed", "true");
        toast.success("Thank you! Your inquiry has been sent to our team.");
        setTimeout(() => {
          setIsOpen(false);
        }, 2500);
      } else {
        toast.error(res.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-2.5 xs:p-4 sm:p-6 overflow-y-auto no-scrollbar overscroll-contain transform-gpu">
          
          {/* Backdrop Neutral Blur Overlay - GPU Accelerated */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md transform-gpu"
          />

          {/* NearGrow Modal Card Surface */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-modal-title"
            className="relative w-full max-w-lg bg-[#08100A] border border-[#68B955]/35 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] z-10 my-auto transform-gpu will-change-transform overflow-hidden max-h-[92dvh] flex flex-col"
          >
            {/* Background Controlled Atmospheric Depth (Clipped) */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl pointer-events-none z-0">
              {/* Dominant NearGrow Green Ambient Glow (Top Right) */}
              <div 
                className="absolute -top-24 -right-20 w-64 h-64 rounded-full bg-[#68B955]/[0.12] blur-3xl pointer-events-none" 
              />
              {/* Subtle NearGrow Orange Ambient Glow (Bottom Left) */}
              <div 
                className="absolute -bottom-24 -left-20 w-60 h-60 rounded-full bg-[#FBAF35]/[0.06] blur-3xl pointer-events-none" 
              />
            </div>

            {/* NearGrow Refined Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/65 hover:bg-[#68B955]/[0.12] hover:border-[#68B955]/30 hover:text-[#68B955] transition-all duration-200 cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="p-3.5 xs:p-5 sm:p-7 relative z-10 overflow-y-auto no-scrollbar">
              
              {isSubmitted ? (
                /* Success State */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center flex flex-col items-center justify-center gap-3"
                >
                  <div className="w-16 h-16 rounded-full bg-[#68B955]/10 border-2 border-[#68B955] flex items-center justify-center text-[#68B955] mb-2 shadow-lg shadow-[#68B955]/20">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Inquiry Received!
                  </h3>
                  <p className="text-sm text-white/75 max-w-xs mx-auto leading-relaxed">
                    Our senior growth marketing team is reviewing your details and will contact you shortly.
                  </p>
                </motion.div>
              ) : (
                /* Main Lead Form */
                <>
                  {/* Header Badge & Title */}
                  <div className="mb-3 xs:mb-4 sm:mb-5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 xs:px-3 py-0.5 xs:py-1 rounded-full bg-[#68B955]/[0.08] border border-[#68B955]/55 text-[10px] xs:text-[11px] font-medium uppercase tracking-wider text-[#68B955] mb-1.5 xs:mb-2 shadow-xs">
                      <Sparkles size={12} className="text-[#68B955]" />
                      <span>Free Visibility Check</span>
                    </div>
                    <h2 id="lead-modal-title" className="text-xl xs:text-2xl sm:text-3xl font-semibold sm:font-bold text-white tracking-tight leading-tight">
                      Grow Your Local <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#68B955] via-[#7BCB65] to-[#FBAF35]">Business</span>
                    </h2>
                    <p className="text-[11px] xs:text-xs sm:text-sm text-white/[0.78] mt-1 xs:mt-1.5 leading-relaxed">
                      Request a free Google Maps visibility audit and discover practical ways to attract more nearby customers.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-2.5 xs:space-y-3">
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-[10px] xs:text-[11px] font-medium uppercase tracking-wider text-white/[0.65] mb-1">
                        Full Name <span className="text-[#FBAF35] font-semibold">*</span>
                      </label>
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/55" />
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="e.g. Vikramaditya Roy"
                          className="w-full pl-10 pr-4 py-2 xs:py-2.5 text-base sm:text-sm rounded-xl border border-white/10 bg-[#0A120D] text-white placeholder:text-white/45 hover:border-[#68B955]/30 focus:outline-none focus:border-[#68B955]/75 focus:ring-2 focus:ring-[#68B955]/15 transition-all"
                        />
                      </div>
                    </div>

                    {/* Email & Phone Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                      <div>
                        <label className="block text-[10px] xs:text-[11px] font-medium uppercase tracking-wider text-white/[0.65] mb-1">
                          Email Address <span className="text-[#FBAF35] font-semibold">*</span>
                        </label>
                        <div className="relative">
                          <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/55" />
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="admin@brand.com"
                            className="w-full pl-10 pr-4 py-2 xs:py-2.5 text-base sm:text-sm rounded-xl border border-white/10 bg-[#0A120D] text-white placeholder:text-white/45 hover:border-[#68B955]/30 focus:outline-none focus:border-[#68B955]/75 focus:ring-2 focus:ring-[#68B955]/15 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] xs:text-[11px] font-medium uppercase tracking-wider text-white/[0.65] mb-1">
                          Phone Number <span className="text-[#FBAF35] font-semibold">*</span>
                        </label>
                        <div className="relative">
                          <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/55" />
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+91 9217989768"
                            className="w-full pl-10 pr-4 py-2 xs:py-2.5 text-base sm:text-sm rounded-xl border border-white/10 bg-[#0A120D] text-white placeholder:text-white/45 hover:border-[#68B955]/30 focus:outline-none focus:border-[#68B955]/75 focus:ring-2 focus:ring-[#68B955]/15 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Business Name */}
                    <div>
                      <label className="block text-[10px] xs:text-[11px] font-medium uppercase tracking-wider text-white/[0.65] mb-1">
                        Company / Business Name
                      </label>
                      <div className="relative">
                        <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/55" />
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="e.g. Apex Dental Clinic or City Cafe"
                          className="w-full pl-10 pr-4 py-2 xs:py-2.5 text-base sm:text-sm rounded-xl border border-white/10 bg-[#0A120D] text-white placeholder:text-white/45 hover:border-[#68B955]/30 focus:outline-none focus:border-[#68B955]/75 focus:ring-2 focus:ring-[#68B955]/15 transition-all"
                        />
                      </div>
                    </div>

                    {/* Service Required */}
                    <div>
                      <label className="block text-[10px] xs:text-[11px] font-medium uppercase tracking-wider text-white/[0.65] mb-1">
                        Primary Service Needed
                      </label>
                      <div className="relative">
                        {/* Custom Trigger (Visible everywhere) */}
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full px-3.5 py-2 xs:py-2.5 text-base sm:text-sm text-left rounded-xl border border-white/10 bg-[#0A120D] text-white hover:border-[#68B955]/30 focus:outline-none focus:border-[#68B955]/75 focus:ring-2 focus:ring-[#68B955]/15 transition-all cursor-pointer flex items-center justify-between"
                        >
                          <span className="truncate pr-2">{formData.service}</span>
                          <ChevronDown size={15} className={`text-white/60 shrink-0 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#68B955]' : ''}`} />
                        </button>

                        {/* Mobile Native Select Picker */}
                        <select
                          value={formData.service}
                          onChange={(e) => {
                            setFormData({ ...formData, service: e.target.value });
                            setIsDropdownOpen(false);
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer sm:hidden z-20 bg-[#0A120D] text-white text-base"
                        >
                          {serviceOptions.map((option) => (
                            <option key={option} value={option} className="bg-[#0A120D] text-white">{option}</option>
                          ))}
                        </select>

                        {/* Desktop Custom Dropdown Menu */}
                        <div className="hidden sm:block">
                          <AnimatePresence>
                            {isDropdownOpen && (
                              <>
                                <div 
                                  className="fixed inset-0 z-40" 
                                  onClick={() => setIsDropdownOpen(false)} 
                                />
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute left-0 right-0 bottom-[calc(100%+6px)] z-50 py-1.5 bg-[#0A120D] border border-white/15 rounded-xl shadow-[0_-12px_40px_rgba(0,0,0,0.65)] max-h-48 overflow-y-auto backdrop-blur-xl"
                                >
                                  {serviceOptions.map((option) => (
                                    <button
                                      key={option}
                                      type="button"
                                      onClick={() => {
                                        setFormData({ ...formData, service: option });
                                        setIsDropdownOpen(false);
                                      }}
                                      className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm transition-colors cursor-pointer ${
                                        formData.service === option 
                                          ? 'bg-[#68B955]/15 text-[#68B955] font-semibold' 
                                          : 'text-white/80 hover:bg-[#68B955]/10 hover:text-white'
                                      }`}
                                    >
                                      {option}
                                    </button>
                                  ))}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* Primary NearGrow CTA Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full min-h-[44px] py-2.5 xs:py-3 sm:py-3.5 px-4 xs:px-6 rounded-xl bg-gradient-to-r from-[#68B955] via-[#63B550] to-[#5AA548] hover:from-[#72C65E] hover:via-[#68B955] hover:to-[#60AC4E] text-neutral-950 font-bold text-xs xs:text-sm tracking-wide shadow-lg shadow-[#68B955]/25 hover:shadow-xl hover:shadow-[#68B955]/35 active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 mt-3 xs:mt-4 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-neutral-950" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                          </svg>
                          <span>Sending Details...</span>
                        </span>
                      ) : (
                        <>
                          <span className="xs:hidden">Get Free Audit</span>
                          <span className="hidden xs:inline">Submit & Get Free Audit</span>
                          <Send size={15} className="text-neutral-950 transition-transform duration-200 group-hover:translate-x-1" />
                        </>
                      )}
                    </button>

                  </form>
                </>
              )}

            </div>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
