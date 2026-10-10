import { TiptapJSONContent } from '@/types/blog';

export interface KeywordLinkRule {
  keyword: string;
  url: string;
  maxOccurrences?: number;
}

/**
 * Standard catalog of NearGrow Ads Core Services & CTAs for automatic interlinking.
 * Ordered by length descending so longer, specific phrases match first.
 */
export const DEFAULT_KEYWORD_RULES: KeywordLinkRule[] = [
  { keyword: 'Book Your Free Hotel Marketing Audit', url: '/contact', maxOccurrences: 2 },
  { keyword: 'Free Hotel Marketing Audit', url: '/contact', maxOccurrences: 2 },
  { keyword: 'Hotel Marketing Audit', url: '/contact', maxOccurrences: 2 },
  { keyword: 'Website Design, SEO & GEO AI', url: '/services/website-design-seo', maxOccurrences: 2 },
  { keyword: 'Website Design & SEO', url: '/services/website-design-seo', maxOccurrences: 2 },
  { keyword: 'Hotel Website Design', url: '/services/website-design-seo', maxOccurrences: 2 },
  { keyword: 'Content Creation & Copywriting', url: '/services/content-copywriting', maxOccurrences: 2 },
  { keyword: 'Brand Strategy & Identity', url: '/services/brand-strategy', maxOccurrences: 2 },
  { keyword: 'Brand Strategy', url: '/services/brand-strategy', maxOccurrences: 2 },
  { keyword: 'Revenue Management', url: '/services/revenue-management', maxOccurrences: 2 },
  { keyword: 'Performance Marketing', url: '/services/performance-marketing', maxOccurrences: 2 },
  { keyword: 'Influencer & PR Outreach', url: '/services/influencer-pr', maxOccurrences: 2 },
  { keyword: 'Social Media Management', url: '/services/social-media-management', maxOccurrences: 2 },
  { keyword: 'Google Business Profile', url: '/services/seo-gmb', maxOccurrences: 2 },
  { keyword: 'GEO & GMB', url: '/services/seo-gmb', maxOccurrences: 2 },
];

/**
 * Automatically walks a TipTap AST and converts mentions of NearGrow Ads services
 * and audit CTAs into styled, clickable links without requiring manual linking in the editor.
 */
export function autoLinkAst<T extends TiptapJSONContent | TiptapJSONContent[] | string | undefined>(
  content: T,
  rules: KeywordLinkRule[] = DEFAULT_KEYWORD_RULES
): T {
  if (!content) return content;

  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content);
      const linked = autoLinkAst(parsed, rules);
      return JSON.stringify(linked) as T;
    } catch {
      return content;
    }
  }

  const keywordCounts = new Map<string, number>();
  rules.forEach((r) => keywordCounts.set(r.keyword.toLowerCase(), 0));

  function processNodes(nodes: TiptapJSONContent[]): TiptapJSONContent[] {
    const result: TiptapJSONContent[] = [];

    for (const node of nodes) {
      if (node.type === 'text') {
        const hasLink = node.marks && node.marks.some((m: { type: string }) => m.type === 'link');
        if (hasLink || !node.text) {
          result.push(node);
          continue;
        }

        let currentSegments: TiptapJSONContent[] = [
          {
            type: 'text',
            text: node.text,
            marks: node.marks ? [...node.marks] : undefined,
          },
        ];

        for (const item of rules) {
          const lowerKw = item.keyword.toLowerCase();
          const maxAllowed = item.maxOccurrences ?? 2;
          const currentCount = keywordCounts.get(lowerKw) || 0;
          if (currentCount >= maxAllowed) continue;

          const nextSegments: TiptapJSONContent[] = [];

          for (const seg of currentSegments) {
            const segHasLink = seg.marks && seg.marks.some((m: { type: string }) => m.type === 'link');
            if (segHasLink || !seg.text) {
              nextSegments.push(seg);
              continue;
            }

            const escaped = item.keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(^|[^a-zA-Z0-9])(${escaped})([^a-zA-Z0-9]|$)`, 'i');
            const match = seg.text.match(regex);

            if (match && (keywordCounts.get(lowerKw) || 0) < maxAllowed) {
              const matchedKeyword = match[2];
              const prefixBoundary = match[1];
              const suffixBoundary = match[3];

              const matchIdx = seg.text.indexOf(match[0]);
              const beforeText = seg.text.substring(0, matchIdx) + prefixBoundary;
              const afterText = suffixBoundary + seg.text.substring(matchIdx + match[0].length);

              if (beforeText) {
                nextSegments.push({
                  type: 'text',
                  text: beforeText,
                  marks: seg.marks ? [...seg.marks] : undefined,
                });
              }

              keywordCounts.set(lowerKw, (keywordCounts.get(lowerKw) || 0) + 1);
              nextSegments.push({
                type: 'text',
                text: matchedKeyword,
                marks: [
                  ...(seg.marks || []),
                  {
                    type: 'link',
                    attrs: {
                      href: item.url,
                      target: '_self',
                      targetType: 'external',
                      blogId: null,
                    },
                  },
                ],
              });

              if (afterText) {
                nextSegments.push({
                  type: 'text',
                  text: afterText,
                  marks: seg.marks ? [...seg.marks] : undefined,
                });
              }
            } else {
              nextSegments.push(seg);
            }
          }

          currentSegments = nextSegments;
        }

        result.push(...currentSegments);
      } else {
        const cloned: TiptapJSONContent = { ...node };
        if (cloned.content && Array.isArray(cloned.content)) {
          cloned.content = processNodes(cloned.content);
        }
        result.push(cloned);
      }
    }

    return result;
  }

  if (Array.isArray(content)) {
    return processNodes(content) as T;
  }

  if (content && typeof content === 'object' && 'content' in content && Array.isArray((content as TiptapJSONContent).content)) {
    return {
      ...(content as object),
      content: processNodes((content as TiptapJSONContent).content || []),
    } as T;
  }

  return content;
}
