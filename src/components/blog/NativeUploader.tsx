"use client";
/* eslint-disable @typescript-eslint/no-unused-vars, @next/next/no-img-element */

import { useState, useRef } from "react";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { ImageIcon, UploadCloud, X, Loader2, RefreshCcw, Trash2 } from "lucide-react";
import { uploadBlogMedia } from "@/lib/blog/actions";

interface NativeUploaderProps {
  onUploadComplete: (url: string) => void;
  blogId?: string;
  existingImageUrl?: string;
  className?: string;
  variant?: 'cover' | 'avatar';
}

export default function NativeUploader({
  onUploadComplete,
  blogId = "drafts",
  existingImageUrl,
  className,
  variant = 'cover'
}: NativeUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Client-Side Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type", { description: "Please upload a JPG, PNG, WEBP, or SVG." });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB absolute limit before compression
      toast.error("File too large", { description: "Maximum initial file size is 10MB." });
      return;
    }

    setIsUploading(true);
    setProgress(10); // Start progress

    try {
      // 2. Image Compression (skip for SVG)
      let fileToUpload = file;
      if (file.type !== 'image/svg+xml') {
        const options = {
          maxSizeMB: 1, // Compress down to 1MB max
          maxWidthOrHeight: 1920, // Resize large images
          useWebWorker: true,
          onProgress: (p: number) => setProgress(10 + Math.floor(p * 0.4)) // 10% -> 50%
        };
        fileToUpload = await imageCompression(file, options);
      }

      setProgress(60);

      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('blogId', blogId === 'new' ? 'drafts' : blogId);

      setProgress(85);

      const result = await uploadBlogMedia(formData);

      if (!result.success || !result.url) {
        throw new Error(result.error || "Upload failed");
      }

      setProgress(100);
      toast.success("Upload Successful!");
      onUploadComplete(result.url);

    } catch (error: unknown) {
      console.error("Upload Error:", error);
      toast.error("Upload Failed", { description: error instanceof Error ? error.message : "An unknown error occurred." });
    } finally {
      setIsUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
    }
  };

  return (
    <div className={`relative w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-500/5 transition-all overflow-hidden bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center group ${className || ''}`}>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp, image/svg+xml"
        className="hidden"
      />

      {isUploading ? (
        variant === 'avatar' ? (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 w-full h-full p-6 text-center z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Uploading & Optimizing...</p>
              <p className="text-xs text-gray-500 mt-1">{progress}% Complete</p>
            </div>
            <div className="w-full max-w-xs h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-primary-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )
      ) : existingImageUrl ? (
        <>
          <img src={existingImageUrl} alt="Cover Preview" className="absolute inset-0 w-full h-full object-cover" />
          {/* Overlay controls on hover */}
          {variant === 'avatar' ? (
            <div
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer z-10"
              onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
              title="Replace Avatar"
            >
              <RefreshCcw className="w-6 h-6 text-white" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-10">
              <button
                onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
                className="p-2 bg-white text-gray-900 rounded-full hover:bg-gray-100 shadow-sm transition-colors"
                title="Replace Image"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUploadComplete("");
                }}
                className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 shadow-sm transition-colors"
                title="Remove Image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <button
          onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
          className="flex flex-col items-center justify-center gap-2 text-gray-500 w-full h-full p-2"
        >
          {variant === 'avatar' ? (
            <UploadCloud size={20} className="text-gray-400 group-hover:text-primary-500 transition-colors" />
          ) : (
            <>
              <UploadCloud size={32} className="text-gray-400" />
              <div className="text-center">
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Click to upload image</span>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP, SVG (Max 10MB)</p>
              </div>
            </>
          )}
        </button>
      )}
    </div>
  );
}
