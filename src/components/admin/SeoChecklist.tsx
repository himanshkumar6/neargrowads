"use client";

import React, { useMemo } from 'react';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface SeoChecklistProps {
  title?: string;
  description?: string;
  content?: unknown;
  keywords?: string;
  featuredImage?: string;
}

export function SeoChecklist({
  title = '',
  description = '',
  content = '',
  keywords = '',
  featuredImage = '',
}: SeoChecklistProps) {
  // Extract text from content (string or Tiptap JSON)
  const plainText = useMemo(() => {
    if (!content) return '';
    if (typeof content === 'string') {
      return content.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    }
    try {
      return JSON.stringify(content).replace(/[{}"[\],:]/g, ' ').replace(/\s+/g, ' ').trim();
    } catch {
      return '';
    }
  }, [content]);

  const wordCount = useMemo(() => {
    return plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
  }, [plainText]);

  const primaryKeyword = useMemo(() => {
    if (!keywords || !keywords.trim()) return '';
    const list = keywords.split(',').map((k) => k.trim().toLowerCase()).filter(Boolean);
    return list[0] || '';
  }, [keywords]);

  const checks = useMemo(() => {
    const titleLen = (title || '').trim().length;
    const descLen = (description || '').trim().length;
    const lowerTitle = (title || '').toLowerCase();
    const lowerDesc = (description || '').toLowerCase();
    const lowerContent = plainText.toLowerCase();

    return [
      {
        id: 'title-length',
        label: 'Title Length (40–60 chars)',
        passed: titleLen >= 40 && titleLen <= 70,
        hint: titleLen === 0 ? 'Title is missing' : titleLen < 40 ? `Too short (${titleLen} chars)` : titleLen > 70 ? `Too long (${titleLen} chars)` : `Optimal (${titleLen} chars)`,
      },
      {
        id: 'desc-length',
        label: 'Meta Description (120–160 chars)',
        passed: descLen >= 100 && descLen <= 170,
        hint: descLen === 0 ? 'Description is missing' : descLen < 100 ? `Too short (${descLen} chars)` : descLen > 170 ? `Too long (${descLen} chars)` : `Optimal (${descLen} chars)`,
      },
      {
        id: 'focus-keyword',
        label: 'Focus Keyword Defined',
        passed: !!primaryKeyword,
        hint: primaryKeyword ? `Primary: "${primaryKeyword}"` : 'Add at least one focus keyword',
      },
      {
        id: 'kw-title',
        label: 'Keyword in Title',
        passed: !!primaryKeyword && lowerTitle.includes(primaryKeyword),
        hint: !primaryKeyword ? 'Define keyword first' : lowerTitle.includes(primaryKeyword) ? 'Found in title' : 'Keyword not found in title',
      },
      {
        id: 'kw-desc',
        label: 'Keyword in Meta Description',
        passed: !!primaryKeyword && lowerDesc.includes(primaryKeyword),
        hint: !primaryKeyword ? 'Define keyword first' : lowerDesc.includes(primaryKeyword) ? 'Found in description' : 'Keyword not found in description',
      },
      {
        id: 'kw-content',
        label: 'Keyword in Content',
        passed: !!primaryKeyword && lowerContent.includes(primaryKeyword),
        hint: !primaryKeyword ? 'Define keyword first' : lowerContent.includes(primaryKeyword) ? 'Found in article body' : 'Keyword not found in article body',
      },
      {
        id: 'content-length',
        label: 'Content Length (> 300 words)',
        passed: wordCount >= 300,
        hint: `${wordCount} words ${wordCount >= 300 ? '(Good)' : '(Aim for 300+ words)'}`,
      },
      {
        id: 'featured-image',
        label: 'Featured / Cover Image',
        passed: !!featuredImage && featuredImage.trim().length > 0,
        hint: featuredImage ? 'Cover image added' : 'Add a featured image for social previews',
      },
    ];
  }, [title, description, primaryKeyword, plainText, wordCount, featuredImage]);

  const passedCount = checks.filter((c) => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);

  const getScoreColor = () => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 50) return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/30';
  };

  const getScoreBadge = () => {
    if (score >= 80) return 'Great SEO';
    if (score >= 50) return 'Needs Work';
    return 'Poor SEO';
  };

  return (
    <div className="bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xs p-4 sm:p-5 lg:p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-3 mb-2">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-emerald-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Live SEO Analysis</h2>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreColor()}`}>
          {score}% • {getScoreBadge()}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-100 dark:bg-[#07111e] rounded-full overflow-hidden mb-4">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Checklist Items */}
      <div className="space-y-2.5">
        {checks.map((check) => (
          <div
            key={check.id}
            className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
          >
            {check.passed ? (
              <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={15} className="text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className={`font-semibold ${check.passed ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {check.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {check.hint}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
