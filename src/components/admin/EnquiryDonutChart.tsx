"use client";

import React from "react";

interface EnquiryDonutChartProps {
  contactUs: number;
  getInTouch: number;
  chatbot: number;
  total: number;
}

export default function EnquiryDonutChart({
  contactUs,
  getInTouch,
  chatbot,
  total,
}: EnquiryDonutChartProps) {
  const r = 54;
  const c = 2 * Math.PI * r; // ~339.292

  // Determine dominant source and percentages
  let dominantSource = "No Enquiries";
  let dominantPct = 0;
  let dominantColor = "text-slate-400";

  const contactPct = total > 0 ? Math.round((contactUs / total) * 100) : 0;
  const getInTouchPct = total > 0 ? Math.round((getInTouch / total) * 100) : 0;
  const chatbotPct = total > 0 ? Math.round((chatbot / total) * 100) : 0;

  if (total > 0) {
    if (chatbot >= getInTouch && chatbot >= contactUs) {
      dominantSource = "Chatbot Leads";
      dominantPct = chatbotPct;
      dominantColor = "text-sky-500";
    } else if (getInTouch >= contactUs) {
      dominantSource = "Get in Touch";
      dominantPct = getInTouchPct;
      dominantColor = "text-secondary-500";
    } else {
      dominantSource = "Contact Us";
      dominantPct = contactPct;
      dominantColor = "text-primary-500";
    }
  }

  // Calculate arc lengths
  const chatbotArc = total > 0 ? (chatbot / total) * c : 0;
  const getInTouchArc = total > 0 ? (getInTouch / total) * c : 0;
  const contactArc = total > 0 ? (contactUs / total) * c : 0;

  // Offsets for sequential segments (clockwise starting at 12 o'clock)
  const offsetChatbot = 0;
  const offsetGetInTouch = chatbotArc;
  const offsetContact = chatbotArc + getInTouchArc;

  return (
    <div className="flex flex-col items-center justify-between h-full space-y-4">
      {/* Circular Progress Gauge */}
      <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center shrink-0">
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full -rotate-90 transform"
          role="img"
          aria-label={`Enquiry distribution: Chatbot ${chatbotPct}%, Get in Touch ${getInTouchPct}%, Contact Us ${contactPct}%`}
        >
          {/* Subtle Background Track */}
          <circle
            cx="80"
            cy="80"
            r={r}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="13"
            className="text-slate-100 dark:text-slate-800/80"
          />

          {total > 0 ? (
            <>
              {/* Chatbot Segment (Sky Blue) */}
              {chatbotArc > 0 && (
                <circle
                  cx="80"
                  cy="80"
                  r={r}
                  fill="transparent"
                  stroke="#0ea5e9"
                  strokeWidth="13"
                  strokeDasharray={`${chatbotArc} ${c - chatbotArc}`}
                  strokeDashoffset={-offsetChatbot}
                  className="transition-all duration-700 ease-out"
                />
              )}

              {/* Get in Touch Segment (Secondary Amber) */}
              {getInTouchArc > 0 && (
                <circle
                  cx="80"
                  cy="80"
                  r={r}
                  fill="transparent"
                  stroke="#fbaf35"
                  strokeWidth="13"
                  strokeDasharray={`${getInTouchArc} ${c - getInTouchArc}`}
                  strokeDashoffset={-offsetGetInTouch}
                  className="transition-all duration-700 ease-out"
                />
              )}

              {/* Contact Us Segment (Primary Green) */}
              {contactArc > 0 && (
                <circle
                  cx="80"
                  cy="80"
                  r={r}
                  fill="transparent"
                  stroke="#68b955"
                  strokeWidth="13"
                  strokeDasharray={`${contactArc} ${c - contactArc}`}
                  strokeDashoffset={-offsetContact}
                  className="transition-all duration-700 ease-out"
                />
              )}
            </>
          ) : (
            <circle
              cx="80"
              cy="80"
              r={r}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="13"
              strokeDasharray="4 6"
              className="text-slate-300 dark:text-slate-700"
            />
          )}
        </svg>

        {/* Center Prominent Percentage & Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
            {total > 0 ? `${dominantPct}%` : "0%"}
          </span>
          <span className={`text-[11px] font-bold uppercase tracking-wider mt-0.5 truncate max-w-[110px] ${dominantColor}`}>
            {total > 0 ? dominantSource : "No Data"}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            {total > 0 ? `${total} Total Leads` : "Awaiting Submissions"}
          </span>
        </div>
      </div>

      {/* Legend & Breakdown */}
      <div className="w-full grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
        {/* Contact Us */}
        <div className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-50/70 dark:bg-[#07111e]/90 border border-slate-200/50 dark:border-white/10">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#68b955] shrink-0" />
            <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 truncate">Contact</span>
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">{contactUs}</span>
          <span className="text-[10px] font-medium text-slate-400">{contactPct}%</span>
        </div>

        {/* Get in Touch */}
        <div className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-50/70 dark:bg-[#07111e]/90 border border-slate-200/50 dark:border-white/10">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fbaf35] shrink-0" />
            <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 truncate">Touch</span>
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">{getInTouch}</span>
          <span className="text-[10px] font-medium text-slate-400">{getInTouchPct}%</span>
        </div>

        {/* Chatbot */}
        <div className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-50/70 dark:bg-[#07111e]/90 border border-slate-200/50 dark:border-white/10">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9] shrink-0" />
            <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 truncate">Chatbot</span>
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">{chatbot}</span>
          <span className="text-[10px] font-medium text-slate-400">{chatbotPct}%</span>
        </div>
      </div>
    </div>
  );
}
