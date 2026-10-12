"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Save,
  X,
  AlertTriangle,
  Tag,
  FolderOpen,
  Search,
  Globe,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getCategoriesFull,
  createCategory,
  updateCategory,
  deleteCategory,
  FullCategory,
} from "@/lib/blog/actions";

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<FullCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "", description: "" });
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getCategoriesFull();
      setCategories(data || []);
    } catch (err: unknown) {
      toast.error(
        "Failed to load categories: " + (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getCategoriesFull()
      .then((data) => {
        if (isMounted) {
          setCategories(data || []);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          toast.error(
            "Failed to load categories: " + (err instanceof Error ? err.message : "Unknown error")
          );
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!isEditing) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, name, slug }));
    } else {
      setFormData((prev) => ({ ...prev, name }));
    }
  };

  const resetForm = () => {
    setFormData({ name: "", slug: "", description: "" });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (cat: FullCategory) => {
    setFormData({ name: cat.name, slug: cat.slug, description: cat.description || "" });
    setIsEditing(true);
    setEditingId(cat.id);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    const id = categoryToDelete;
    setCategoryToDelete(null);

    const previous = [...categories];
    setCategories((prev) => prev.filter((c) => c.id !== id));

    try {
      const res = await deleteCategory(id);
      if (res.error) {
        throw new Error(res.error);
      }
      toast.success("Category deleted successfully");
      if (isEditing && editingId === id) {
        resetForm();
      }
    } catch (err: unknown) {
      setCategories(previous);
      toast.error(
        err instanceof Error ? err.message : "An error occurred while deleting the category"
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error("Name and slug are required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && editingId) {
        const res = await updateCategory(editingId, {
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
        });

        if (res.error || !res.category) {
          throw new Error(res.error || "Failed to update category");
        }
        toast.success("Category updated successfully");
      } else {
        const res = await createCategory({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
        });

        if (res.error || !res.category) {
          throw new Error(res.error || "Failed to create category");
        }
        toast.success("Category created successfully");
      }

      await fetchCategories();
      resetForm();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "An error occurred while saving the category"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered categories
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.slug.toLowerCase().includes(query) ||
        (c.description && c.description.toLowerCase().includes(query))
    );
  }, [categories, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-[360px] flex flex-col items-center justify-center gap-3 bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-2xl p-8 shadow-xs">
        <Loader2 className="animate-spin text-[#68b955]" size={32} />
        <p className="text-xs text-slate-500 font-medium">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Banner (Synchronized with CMS Standard) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">
              Blog Categories
            </h1>
            <span className="px-3 py-0.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-semibold uppercase tracking-wider">
              {categories.length} Taxonomies Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
            Manage article classifications, SEO topic clusters, and content taxonomies.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#68b955] hover:bg-[#4e993d] text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Write New Post</span>
          </Link>
        </div>
      </div>

      {/* 2. ROW 1: Three Equally Sized Summary Cards (Exact Dashboard Pattern) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
        {/* Card 1: Total Categories */}
        <div className="bg-slate-50/80 dark:bg-[#07111e]/90 border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Categories
            </span>
            <div className="w-9 h-9 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shadow-xs">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="block text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
              {categories.length}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-primary-600 dark:text-primary-400 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Active content groupings</span>
            </div>
          </div>
        </div>

        {/* Card 2: Routing Slugs */}
        <div className="bg-slate-50/80 dark:bg-[#07111e]/90 border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              SEO URL Slugs
            </span>
            <div className="w-9 h-9 rounded-full bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 flex items-center justify-center shadow-xs">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="block text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
              100%
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-secondary-600 dark:text-secondary-400 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Clean canonical paths</span>
            </div>
          </div>
        </div>

        {/* Card 3: Taxonomy Health */}
        <div className="bg-slate-50/80 dark:bg-[#07111e]/90 border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              System Sync
            </span>
            <div className="w-9 h-9 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="block text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
              Healthy
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Relational integrity active</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ROW 2: Two Panels — Left Form (Col 4) + Right Table (Col 8) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Left Column: Add / Edit Form Card */}
        <div className="xl:col-span-4 xl:sticky xl:top-4 bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isEditing
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    : "bg-primary-500/10 text-primary-600 dark:text-primary-400"
                }`}
              >
                {isEditing ? <Pencil size={14} /> : <Plus size={14} />}
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {isEditing ? "Edit Category" : "Add New Category"}
              </h2>
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <X size={14} /> Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={handleNameChange}
                className="w-full px-3.5 py-2.5 min-h-[42px] border border-slate-200/90 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#68b955]/30 focus:border-[#68b955] dark:bg-[#050b14]/80 dark:text-white text-base sm:text-sm bg-slate-50/70 transition-all outline-none"
                placeholder="e.g. Local SEO"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                  }))
                }
                className="w-full px-3.5 py-2.5 min-h-[42px] border border-slate-200/90 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#68b955]/30 focus:border-[#68b955] dark:bg-[#050b14]/80 dark:text-white text-base sm:text-sm font-mono bg-slate-50/70 transition-all outline-none"
                placeholder="e.g. local-seo"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Description (Optional)
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-3.5 py-2.5 border border-slate-200/90 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#68b955]/30 focus:border-[#68b955] dark:bg-[#050b14]/80 dark:text-white text-base sm:text-sm bg-slate-50/70 transition-all outline-none resize-none"
                placeholder="Brief summary of topics covered under this taxonomy..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-1.5 bg-[#68b955] hover:bg-[#4e993d] text-white font-bold py-2.5 px-4 rounded-xl transition-all disabled:opacity-70 text-xs sm:text-sm shadow-xs cursor-pointer h-[42px] mt-2 active:scale-95"
            >
              {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              <span>{isEditing ? "Update Category" : "Add Category"}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Existing Categories Table Card */}
        <div className="xl:col-span-8 bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                <FolderOpen size={16} />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Existing Categories
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {filteredCategories.length} category entries found
                </p>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories..."
                className="w-full pl-8 pr-3 py-1.5 min-h-[36px] border border-slate-200/90 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#68b955]/30 focus:border-[#68b955] dark:bg-[#050b14]/80 dark:text-white text-base sm:text-xs bg-slate-50/70 transition-all outline-none"
              />
            </div>
          </div>

          {filteredCategories.length === 0 ? (
            <div className="p-8 sm:p-12 text-center text-slate-500 dark:text-slate-400">
              <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400 border border-transparent dark:border-white/5">
                <Tag size={24} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                {searchQuery ? "No matching categories" : "No categories found"}
              </h3>
              <p className="text-xs">
                {searchQuery
                  ? "Try clearing your search query"
                  : "Create your first category using the form on the left."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-3 px-3 py-1 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/80 dark:bg-[#07111e]/90 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-white/10">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">Category Name</th>
                    <th className="px-5 py-3.5 font-bold hidden sm:table-cell">Slug</th>
                    <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 dark:divide-white/10">
                  {filteredCategories.map((cat) => {
                    const isSelected = isEditing && editingId === cat.id;
                    return (
                      <tr
                        key={cat.id}
                        className={`transition-colors ${
                          isSelected
                            ? "bg-primary-500/10 dark:bg-primary-500/15"
                            : "hover:bg-slate-50/60 dark:hover:bg-white/5"
                        }`}
                      >
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                            {cat.name}
                          </div>
                          {cat.description && (
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                              {cat.description}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3.5 hidden sm:table-cell text-xs text-slate-500 dark:text-slate-400 font-mono">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-slate-600 dark:text-slate-300 text-[11px]">
                            {cat.slug}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEdit(cat)}
                              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                isSelected
                                  ? "bg-[#68b955] text-white"
                                  : "bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 text-slate-600 dark:text-slate-300"
                              }`}
                              title="Edit Category"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => setCategoryToDelete(cat.id)}
                              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                              title="Delete Category"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {categoryToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCategoryToDelete(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0d1526] rounded-2xl shadow-2xl border border-slate-200/80 dark:border-white/10 overflow-hidden z-10"
            >
              <div className="p-6 sm:p-7 space-y-4">
                <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-rose-600 dark:text-rose-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    Delete Category?
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Are you sure you want to delete this category? Any blog posts assigned to this
                    category will lose their category tag.
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCategoryToDelete(null)}
                    className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition-all flex justify-center items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <Trash2 size={14} />
                    <span>Delete Category</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
