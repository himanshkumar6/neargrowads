"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { UploadCloud, Image as ImageIcon, Globe, Check, X, Loader2, RefreshCcw } from "lucide-react";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { getMediaLibraryItems, uploadBlogMedia } from "@/lib/blog/actions";
import { MediaLibraryItem } from "@/types/blog";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (data: { src: string; mediaId?: string; alt?: string; caption?: string }) => void;
  blogId?: string;
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  onInsertImage,
  blogId = "drafts",
}: MediaPickerModalProps) {
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [activeTab, setActiveTab] = useState<"upload" | "library" | "url">("upload");
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [uploadedMediaId, setUploadedMediaId] = useState<string>("");
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string>("");
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [externalUrl, setExternalUrl] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [libraryItems, setLibraryItems] = useState<MediaLibraryItem[]>([]);
  const [selectedLibraryItem, setSelectedLibraryItem] = useState<MediaLibraryItem | null>(null);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset fields on modal open
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  if (isOpen && !prevIsOpen) {
    setPrevIsOpen(true);
    setUploadedUrl("");
    setUploadedMediaId("");
    setLocalPreviewUrl("");
    setAltText("");
    setCaption("");
    setExternalUrl("");
    setSelectedLibraryItem(null);
    setActiveTab("upload");
    setIsDragging(false);
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Load media library when tab switches to 'library'
  useEffect(() => {
    if (isOpen && activeTab === "library") {
      let isMounted = true;
      const timer = setTimeout(() => {
        setIsLoadingLibrary(true);
      }, 0);
      getMediaLibraryItems().then((items) => {
        if (isMounted) {
          setLibraryItems(items);
          setIsLoadingLibrary(false);
        }
      });
      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }
  }, [isOpen, activeTab]);

  if (!isOpen || !mounted) return null;

  const processFile = async (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file format. Please upload JPG, PNG, WEBP, SVG, or GIF.");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error("File is too large. Maximum file size is 15MB.");
      return;
    }

    // 1. INSTANT LOCAL PREVIEW & Alt Text Auto-populate
    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(objectUrl);

    const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    setAltText(baseName.charAt(0).toUpperCase() + baseName.slice(1));

    setIsUploading(true);
    setUploadProgress(20);

    try {
      let fileToUpload = file;
      if (file.type !== "image/svg+xml") {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          onProgress: (p: number) => setUploadProgress(20 + Math.floor(p * 0.4)),
        };
        fileToUpload = await imageCompression(file, options);
      }

      setUploadProgress(65);

      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("blogId", blogId === "new" ? "drafts" : blogId);

      setUploadProgress(85);

      // Server action that uses privileged Admin client (bypasses RLS)
      const result = await uploadBlogMedia(formData);

      if (!result.success || !result.url) {
        throw new Error(result.error || "Upload failed");
      }

      setUploadProgress(100);
      setUploadedUrl(result.url);
      setUploadedMediaId(result.mediaId || "");

      toast.success("Image uploaded successfully!");
    } catch (err: unknown) {
      console.error("Upload error:", err);
      toast.error("Upload failed", {
        description: err instanceof Error ? err.message : "An unexpected error occurred.",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleApply = () => {
    let finalSrc = "";
    let finalMediaId = "";

    if (activeTab === "upload") {
      finalSrc = uploadedUrl || localPreviewUrl;
      finalMediaId = uploadedMediaId;
    } else if (activeTab === "library") {
      if (!selectedLibraryItem) return;
      finalSrc = selectedLibraryItem.url;
      finalMediaId = selectedLibraryItem.id;
    } else {
      if (!externalUrl.trim()) return;
      finalSrc = externalUrl.trim();
    }

    if (!finalSrc) {
      toast.error("Please provide or select an image.");
      return;
    }

    onInsertImage({
      src: finalSrc,
      mediaId: finalMediaId || undefined,
      alt: altText.trim() || undefined,
      caption: caption.trim() || undefined,
    });

    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md transition-all duration-300 overflow-y-auto overflow-x-hidden no-scrollbar animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-145 max-h-[90vh] bg-white dark:bg-[#0b1329] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/70 dark:shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col my-auto overflow-hidden animate-in zoom-in-95 duration-200 select-none"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 dark:border-white/10 bg-gray-50/80 dark:bg-[#0e1736]/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 dark:bg-primary-500/15 border border-primary-500/20 flex items-center justify-center text-primary-600 dark:text-primary-400">
              <ImageIcon size={16} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">Insert Media</h3>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">Select, upload, or paste an image for your article</p>
            </div>
          </div>

          {/* Navigation Tabs in Header */}
          <div className="flex items-center bg-gray-200/70 dark:bg-slate-800/80 p-1 rounded-xl border border-gray-300/40 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === "upload"
                ? "bg-white dark:bg-[#0b1329] text-primary-600 dark:text-primary-400 shadow-xs"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                }`}
            >
              <UploadCloud size={13} />
              Upload Image
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("library")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === "library"
                ? "bg-white dark:bg-[#0b1329] text-primary-600 dark:text-primary-400 shadow-xs"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                }`}
            >
              <ImageIcon size={13} />
              Media Library
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("url")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === "url"
                ? "bg-white dark:bg-[#0b1329] text-primary-600 dark:text-primary-400 shadow-xs"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                }`}
            >
              <Globe size={13} />
              Image URL
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X size={16} />
          </button>
        </div>

        {/* 2-Column Split Body */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">

          {/* LEFT PANEL: Full Cover Image / Dropzone / Library Grid */}
          <div className="w-full md:w-7/12 lg:w-3/5 p-5 bg-gray-50/50 dark:bg-[#070d1d]/60 border-b md:border-b-0 md:border-r border-gray-100 dark:border-white/10 flex flex-col overflow-hidden">

            {/* 1. Upload Tab */}
            {activeTab === "upload" && (
              <div className="w-full h-full flex flex-col">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="image/jpeg, image/png, image/webp, image/svg+xml, image/gif"
                  className="hidden"
                />

                {localPreviewUrl || uploadedUrl ? (
                  <div className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 group bg-slate-950 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={localPreviewUrl || uploadedUrl}
                      alt={altText || "Cover Preview"}
                      className="w-full h-full object-contain"
                    />

                    {/* Upload progress overlay */}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-white gap-2.5 z-10">
                        <Loader2 size={28} className="animate-spin text-primary-400" />
                        <span className="text-xs font-semibold tracking-wide">Optimizing &amp; Uploading... {uploadProgress}%</span>
                        <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-400 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      </div>
                    )}

                    {/* Floating controls on hover */}
                    {!isUploading && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-10 backdrop-blur-xs">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-1.5 bg-white text-gray-900 rounded-xl text-xs font-bold hover:bg-gray-100 flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                        >
                          <RefreshCcw size={13} /> Replace Image
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setLocalPreviewUrl("");
                            setUploadedUrl("");
                            setUploadedMediaId("");
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          className="px-3.5 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                        >
                          <X size={13} /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    onDragEnter={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(true);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.dataTransfer.dropEffect = "copy";
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(false);
                      const droppedFile = e.dataTransfer.files?.[0];
                      if (droppedFile) {
                        processFile(droppedFile);
                      }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full h-full rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 sm:p-8 text-center cursor-pointer group select-none ${isDragging
                      ? "border-primary-500 bg-primary-50/40 dark:bg-primary-500/15 scale-[1.01] shadow-xl shadow-primary-500/10 ring-2 ring-primary-500/20"
                      : "border-gray-300 dark:border-slate-700/80 hover:border-primary-500 hover:bg-primary-50/20 dark:hover:bg-primary-500/5"
                      }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary-500/10 dark:bg-primary-500/15 border border-primary-500/20 flex items-center justify-center mb-3 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                      <UploadCloud size={28} />
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {isDragging ? "Drop your image to upload" : "Drag & drop your image here"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-xs">
                      Supports JPG, PNG, WEBP, SVG, or GIF (Auto-compressed to &le;1MB)
                    </p>
                    <button
                      type="button"
                      className="mt-4 px-4 py-1.5 bg-primary-600/10 text-primary-600 dark:text-primary-400 dark:bg-primary-400/10 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-500 dark:hover:text-white rounded-xl text-xs font-bold transition-all"
                    >
                      Browse from Device
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 2. Media Library Tab */}
            {activeTab === "library" && (
              <div className="w-full h-full flex flex-col overflow-hidden">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-white/10 shrink-0">
                  <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">
                    {libraryItems.length} media files available
                  </span>
                </div>

                {isLoadingLibrary ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-2 text-xs text-gray-400">
                    <Loader2 size={24} className="animate-spin text-primary-500" />
                    Loading media library...
                  </div>
                ) : libraryItems.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-400 text-xs border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl">
                    <ImageIcon size={32} className="mb-2 text-gray-300 dark:text-slate-700" />
                    <p className="font-semibold text-gray-700 dark:text-gray-300">No media found</p>
                    <p className="mt-0.5">Upload images to populate your reusable media library.</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-1">
                    {libraryItems.map((item) => {
                      const isSelected = selectedLibraryItem?.url === item.url;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setSelectedLibraryItem(item);
                            if (!altText) setAltText(item.name.replace(/\.[^/.]+$/, ""));
                          }}
                          className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer group bg-gray-100 dark:bg-slate-800 ${isSelected
                            ? "border-primary-600 ring-2 ring-primary-500/20 shadow-md"
                            : "border-transparent hover:border-gray-300 dark:hover:border-slate-600"
                            }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                          {isSelected && (
                            <div className="absolute inset-0 bg-primary-600/30 flex items-center justify-center">
                              <span className="p-1 rounded-full bg-primary-600 text-white shadow-md">
                                <Check size={14} />
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 3. Image URL Tab */}
            {activeTab === "url" && (
              <div className="w-full h-full flex flex-col items-center justify-center rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 bg-slate-950 relative p-4">
                {externalUrl.trim() ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={externalUrl.trim()}
                    alt="External URL Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6 text-gray-400">
                    <Globe size={40} className="mb-2 text-gray-500/60" />
                    <p className="text-sm font-semibold text-gray-300">External Image Preview</p>
                    <p className="text-xs text-gray-500 mt-1 max-w-xs">
                      Enter a direct image link in the right panel to preview and configure it here.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* RIGHT PANEL: Attachment Details & SEO Metadata */}
          <div className="w-full md:w-5/12 lg:w-2/5 p-5 bg-white dark:bg-[#0b1329] flex flex-col justify-between overflow-y-auto no-scrollbar">

            <div className="space-y-4">
              {/* Header inside right panel */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/10">
                <span className="text-[11px] font-bold tracking-wider uppercase text-gray-400">Attachment Details</span>
                {activeTab === "upload" && (localPreviewUrl || uploadedUrl) && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                    {isUploading ? "Uploading..." : "Ready"}
                  </span>
                )}
                {activeTab === "library" && selectedLibraryItem && (
                  <span className="px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 text-[10px] font-bold">
                    Selected
                  </span>
                )}
              </div>

              {/* URL Input (if on URL tab) */}
              {activeTab === "url" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Image Source URL <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#070d1d] border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                    autoFocus
                  />
                </div>
              )}

              {/* Alt Text Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Alt Text (Alternative Text)
                  </label>
                  <span className="text-[10px] text-primary-500 font-medium">Google SEO</span>
                </div>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="e.g., Luxury hotel boutique suite with private balcony"
                  className="w-full px-3.5 py-2 bg-gray-50 dark:bg-[#070d1d] border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                />
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                  Describe the purpose of the image. Crucial for Google image rankings and screen readers.
                </p>
              </div>

              {/* Caption Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Caption (Optional)
                  </label>
                  <span className="text-[10px] text-gray-400">Editorial</span>
                </div>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g., Figure 1: Oceanfront suite view during sunset"
                  className="w-full px-3.5 py-2 bg-gray-50 dark:bg-[#070d1d] border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all resize-none"
                />
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                  Will be displayed as a styled figcaption underneath the photo in the published article.
                </p>
              </div>

              {/* Pro Tip Card */}
              <div className="p-3 bg-primary-50/60 dark:bg-primary-500/10 border border-primary-200/60 dark:border-primary-500/20 rounded-xl">
                <p className="text-[11px] text-primary-800 dark:text-primary-300 leading-snug">
                  <strong>Pro-Tip:</strong> High-resolution photos are automatically compressed to &le;1MB for blazing-fast PageSpeed scores.
                </p>
              </div>
            </div>

            {/* Bottom info inside right panel */}
            <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-[11px] text-gray-400">
              <span>Target: TipTap Rich Content</span>
              <span>CDN: Cloudinary</span>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-100 dark:border-white/10 bg-gray-50/80 dark:bg-[#0e1736]/80 shrink-0">
          <div className="text-xs text-gray-500 dark:text-slate-400">
            {activeTab === "upload" && (localPreviewUrl || uploadedUrl) && (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                <Check size={13} /> Image ready to embed
              </span>
            )}
            {activeTab === "library" && selectedLibraryItem && (
              <span className="text-primary-600 dark:text-primary-400 font-medium flex items-center gap-1.5">
                <Check size={13} /> {selectedLibraryItem.name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={
                activeTab === "upload"
                  ? (!uploadedUrl && !localPreviewUrl) || isUploading
                  : activeTab === "library"
                    ? !selectedLibraryItem
                    : !externalUrl.trim()
              }
              className="px-5 py-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2"
            >
              {isUploading && <Loader2 size={13} className="animate-spin" />}
              {isUploading ? "Uploading..." : "Insert Image into Post"}
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
