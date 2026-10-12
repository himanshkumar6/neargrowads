"use client";

import React, { useState, useRef } from "react";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { UploadCloud, X, Loader2, RefreshCcw, Link as LinkIcon, User } from "lucide-react";
import { uploadBlogMedia } from "@/lib/blog/actions";

interface CloudinaryUploaderProps {
  label?: string;
  value?: string | null;
  onChange: (url: string) => void;
  className?: string;
  blogId?: string;
  variant?: "banner" | "avatar";
}

export function CloudinaryUploader({
  label = "Upload Image",
  value = "",
  onChange,
  className = "",
  blogId = "drafts",
  variant,
}: CloudinaryUploaderProps) {
  const isAvatar = variant === "avatar" || label.toLowerCase().includes("avatar");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a JPG, PNG, WEBP, or SVG.");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 15MB.");
      return;
    }

    setIsUploading(true);
    setProgress(15);

    try {
      let fileToUpload = file;
      if (file.type !== "image/svg+xml") {
        const options = {
          maxSizeMB: 1.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          onProgress: (p: number) => setProgress(15 + Math.floor(p * 0.4)),
        };
        fileToUpload = await imageCompression(file, options);
      }

      setProgress(60);
      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("blogId", blogId === "new" ? "drafts" : blogId);

      setProgress(80);
      const result = await uploadBlogMedia(formData);

      if (!result.success || !result.url) {
        throw new Error(result.error || "Upload failed");
      }

      setProgress(100);
      toast.success("Image uploaded successfully!");
      onChange(result.url);
    } catch (err: unknown) {
      console.error("Upload Error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setIsUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleApplyUrl = () => {
    if (!inputUrl.trim()) return;
    onChange(inputUrl.trim());
    setInputUrl("");
    setIsUrlMode(false);
    toast.success("Image URL applied");
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setIsUrlMode(!isUrlMode)}
          className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
        >
          <LinkIcon size={11} />
          {isUrlMode ? "Upload File" : "Paste URL"}
        </button>
      </div>

      {isUrlMode ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 min-h-[38px] text-base sm:text-xs border border-slate-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-[#68b955]/30 focus:border-[#68b955] dark:bg-[#050b14]/80 dark:text-white outline-none"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-2 min-h-[38px] bg-[#68b955] hover:bg-[#4e993d] text-white font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center shrink-0"
          >
            Apply
          </button>
        </div>
      ) : null}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp, image/svg+xml, image/gif"
        className="hidden"
      />

      {isAvatar ? (
        /* 👤 AVATAR PREVIEW MODE (1:1 Ratio, Circular Headshot) */
        isUploading ? (
          <div className="flex items-center gap-4 p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-[#07111e]/90">
            <div className="relative w-20 h-20 rounded-full border border-slate-200/80 dark:border-white/10 bg-slate-100 dark:bg-[#050b14]/80 flex flex-col items-center justify-center shrink-0">
              <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Uploading Avatar...</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{progress}% Complete</p>
              <div className="w-full max-w-[180px] h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        ) : value ? (
          <div className="flex items-center gap-4 p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-[#07111e]/90">
            {/* Round Avatar Thumbnail */}
            <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full ring-2 ring-emerald-500/40 dark:ring-emerald-500/30 overflow-hidden shadow-md shrink-0 bg-slate-900 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt={label}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              {/* Hover overlay with action buttons */}
              <div className="absolute inset-0 bg-slate-950/65 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 bg-white text-slate-900 rounded-full hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
                  title="Replace avatar"
                  aria-label="Replace avatar"
                >
                  <RefreshCcw size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="p-1.5 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
                  title="Remove avatar"
                  aria-label="Remove avatar"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Avatar Details & Action Buttons */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/50">
                  Author Photo
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                1:1 square crop displays on blog articles &amp; author bio.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RefreshCcw size={12} className="text-emerald-500" />
                  <span>Change</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <X size={12} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-4 p-3.5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/10 hover:border-[#68b955] dark:hover:border-[#68b955] bg-slate-50/70 dark:bg-[#07111e]/90 hover:bg-[#68b955]/5 dark:hover:bg-[#68b955]/10 transition-all cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#050b14]/80 flex items-center justify-center text-slate-400 group-hover:text-[#68b955] group-hover:scale-105 transition-all shadow-xs shrink-0">
              <User size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Upload Author Photo
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Square headshot (1:1), JPG, PNG, WEBP up to 5MB
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1.5">
                <UploadCloud size={13} />
                <span>Click to browse</span>
              </span>
            </div>
          </div>
        )
      ) : (
        /* 🖼️ BANNER PREVIEW MODE (16:9 Ratio, Featured/OG Image) */
        isUploading ? (
          <div className="relative w-full aspect-video sm:h-36 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-[#07111e]/90 flex flex-col items-center justify-center p-4">
            <Loader2 className="w-6 h-6 text-emerald-500 animate-spin mb-2" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Uploading & Optimizing...</p>
            <p className="text-[11px] text-slate-400 mt-1">{progress}% Complete</p>
            <div className="w-3/4 max-w-xs h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : value ? (
          <div className="relative w-full aspect-video sm:h-36 rounded-xl border border-slate-200/80 dark:border-white/10 overflow-hidden group bg-slate-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
                title="Replace image"
                aria-label="Replace image"
              >
                <RefreshCcw size={14} />
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
                title="Remove image"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-video sm:h-36 rounded-xl border-2 border-dashed border-slate-300 dark:border-white/10 hover:border-[#68b955] dark:hover:border-[#68b955] bg-slate-50/70 dark:bg-[#07111e]/90 hover:bg-[#68b955]/5 dark:hover:bg-[#68b955]/10 transition-all flex flex-col items-center justify-center p-4 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#050b14]/80 flex items-center justify-center text-slate-400 group-hover:text-[#68b955] transition-colors mb-2">
              <UploadCloud size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-[#68b955] transition-colors">
              Upload Image
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">JPG, PNG, WEBP, SVG up to 15MB</span>
          </button>
        )
      )}
    </div>
  );
}
