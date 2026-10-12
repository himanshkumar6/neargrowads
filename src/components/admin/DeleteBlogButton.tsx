"use client";

import React, { useState } from "react";
import { Trash2, AlertTriangle, Loader2, X } from "lucide-react";
import { deleteBlog } from "@/lib/blog/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteBlogButtonProps {
  id: string;
  title: string;
}

export default function DeleteBlogButton({ id, title }: DeleteBlogButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteBlog(id);
      if (res.success) {
        toast.success(`Successfully deleted "${title}"`);
        setIsOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete article.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Delete Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
        title="Delete article"
        aria-label={`Delete ${title}`}
      >
        <Trash2 size={16} />
      </button>

      {/* Simple Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <div
            onClick={() => !isDeleting && setIsOpen(false)}
            className="fixed inset-0 bg-gray-950/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-md bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 p-6 text-left my-auto">
            {/* Close Icon */}
            <button
              onClick={() => !isDeleting && setIsOpen(false)}
              disabled={isDeleting}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
            >
              <X size={18} />
            </button>

            {/* Content */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  Delete Blog Post?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Are you sure you want to permanently delete <strong className="text-slate-800 dark:text-slate-200">&quot;{title}&quot;</strong>? This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 mt-6 pt-4 border-t border-slate-200/80 dark:border-white/10">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors disabled:opacity-50 cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl transition-all shadow-md shadow-red-600/20 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    <span>Delete Article</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
