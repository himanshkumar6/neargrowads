"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, Save, X, AlertTriangle, ArrowLeft, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategoriesFull, createCategory, updateCategory, deleteCategory, FullCategory } from '@/lib/blog/actions';

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<FullCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getCategoriesFull();
      setCategories(data || []);
    } catch (err: unknown) {
      toast.error('Failed to load categories: ' + (err instanceof Error ? err.message : 'Unknown error'));
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
          toast.error('Failed to load categories: ' + (err instanceof Error ? err.message : 'Unknown error'));
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    // Auto-generate slug from name if we are creating a new one
    if (!isEditing) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setFormData((prev) => ({ ...prev, name, slug }));
    } else {
      setFormData((prev) => ({ ...prev, name }));
    }
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '' });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (cat: FullCategory) => {
    setFormData({ name: cat.name, slug: cat.slug, description: cat.description || '' });
    setIsEditing(true);
    setEditingId(cat.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    const id = categoryToDelete;
    setCategoryToDelete(null);

    const deletePromise = (async () => {
      const res = await deleteCategory(id);
      if (res.error) throw new Error(res.error);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      if (editingId === id) resetForm();
    })();

    toast.promise(deletePromise, {
      loading: 'Deleting category...',
      success: 'Category deleted successfully.',
      error: (err: unknown) => `Error deleting category: ${err instanceof Error ? err.message : 'Unknown error'}`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Category name is required.');
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
          throw new Error(res.error || 'Failed to update category');
        }
        toast.success('Category updated successfully');
      } else {
        const res = await createCategory({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
        });

        if (res.error || !res.category) {
          throw new Error(res.error || 'Failed to create category');
        }
        toast.success('Category created successfully');
      }

      await fetchCategories();
      resetForm();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'An error occurred while saving the category');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
        <p className="text-xs text-slate-500">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors shrink-0"
            title="Back to Blog Management"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Tag className="text-emerald-500" size={24} />
              Blog Categories
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Manage categories for your blog posts and marketing articles.
            </p>
          </div>
        </div>

        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Write New Post</span>
        </Link>
      </div>

      <div className="space-y-8">
        {/* Form Section */}
        <div className="w-full">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
              {isEditing ? (
                <>
                  <Pencil size={18} className="text-blue-500" />
                  Edit Category
                </>
              ) : (
                <>
                  <Plus size={18} className="text-emerald-500" />
                  Add New Category
                </>
              )}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row lg:items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white text-sm"
                  placeholder="e.g. Local SEO"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                    }))
                  }
                  className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white bg-slate-50 text-sm font-mono"
                  placeholder="e.g. local-seo"
                />
              </div>

              <div className="flex-1 lg:flex-[1.5]">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white text-sm"
                  placeholder="Short description..."
                />
              </div>

              <div className="flex gap-2 lg:w-48 shrink-0">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-4 rounded-lg transition-all disabled:opacity-70 h-[44px] text-sm shadow-sm"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {isEditing ? 'Update' : 'Add Category'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-[44px] h-[44px] flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Cancel Edit"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="w-full">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            {categories.length === 0 ? (
              <div className="p-8 sm:p-12 text-center text-slate-500 dark:text-slate-400">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <Tag size={24} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">No categories found</h3>
                <p className="text-xs">Create your first blog category using the form above.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Name</th>
                      <th className="px-6 py-4 font-semibold hidden sm:table-cell">Slug</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900 dark:text-white">{cat.name}</div>
                          {cat.description && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                              {cat.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell text-sm text-slate-500 dark:text-slate-400 font-mono">
                          {cat.slug}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(cat)}
                              className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Category"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => setCategoryToDelete(cat.id)}
                              className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 dark:text-rose-400 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Category"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden z-10"
            >
              <div className="p-6 sm:p-8">
                <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center mb-6">
                  <AlertTriangle className="h-7 w-7 text-rose-600 dark:text-rose-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Delete Category?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm leading-relaxed">
                  Are you sure you want to delete this category? Any blog posts assigned to this category will lose their category tag.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setCategoryToDelete(null)}
                    className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors cursor-pointer text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md shadow-rose-500/20 transition-all flex justify-center items-center gap-2 cursor-pointer text-sm"
                  >
                    <Trash2 size={16} />
                    Delete Category
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
