"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { getMarkRange } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { useEffect, useState, useRef } from "react";
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  Heading2, Heading3, Heading4, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, 
  ImageIcon, Quote, Code, Undo, Redo, RotateCcw,
  Table as TableIcon, ChevronDown, Plus, Trash2, Sparkles
} from "lucide-react";
import { toast } from "sonner";

import { TiptapJSONContent } from "@/types/blog";
import { autoLinkAst } from "@/lib/blog/autolinker";
import InternalLinkModal from "./InternalLinkModal";
import MediaPickerModal from "./MediaPickerModal";

interface EditorProps {
  initialContent?: TiptapJSONContent | string;
  onChange: (content: TiptapJSONContent) => void;
  onAutoSave?: (content: TiptapJSONContent) => Promise<void>;
  editable?: boolean;
  blogId?: string;
}

// =======================
// CUSTOM EXTENSIONS WITH DYNAMIC CMS ATTRIBUTES
// =======================

const CustomLink = Link.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      blogId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-blog-id"),
        renderHTML: (attributes) => {
          if (!attributes.blogId) return {};
          return { "data-blog-id": attributes.blogId };
        },
      },
      targetType: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-target-type"),
        renderHTML: (attributes) => {
          if (!attributes.targetType) return {};
          return { "data-target-type": attributes.targetType };
        },
      },
    };
  },
}).configure({
  openOnClick: false,
  autolink: true,
  HTMLAttributes: {
    class: "text-primary-600 dark:text-primary-400 underline underline-offset-4 font-semibold cursor-pointer",
  },
});

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      mediaId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-media-id"),
        renderHTML: (attributes) => {
          if (!attributes.mediaId) return {};
          return { "data-media-id": attributes.mediaId };
        },
      },
      caption: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-caption"),
        renderHTML: (attributes) => {
          if (!attributes.caption) return {};
          return { "data-caption": attributes.caption };
        },
      },
    };
  },
}).configure({
  inline: true,
  allowBase64: true,
});

const EditorButton = ({ 
  onClick, 
  isActive = false, 
  children, 
  title,
  disabled = false
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  children: React.ReactNode; 
  title: string;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    onMouseDown={(e) => e.preventDefault()} // CRITICAL: Prevents the button from stealing focus from Tiptap and breaking text selection!
    disabled={disabled}
    title={title}
    className={`p-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
      isActive
        ? "bg-primary-600 text-white shadow-sm"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
    }`}
  >
    {children}
  </button>
);

export default function BlogEditor({ 
  initialContent = "", 
  onChange, 
  onAutoSave,
  editable = true,
  blogId
}: EditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isTableMenuOpen, setIsTableMenuOpen] = useState(false);
  const [savedLinkSelection, setSavedLinkSelection] = useState<{
    from: number;
    to: number;
    text: string;
  } | null>(null);
  const [activeLinkHref, setActiveLinkHref] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: false,
        underline: false,
      }),
      CustomImage,
      CustomLink,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "tiptap-table border-collapse table-auto w-full my-6 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 px-3.5 py-2.5 text-left font-bold text-gray-900 dark:text-white text-sm",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-gray-200 dark:border-gray-800 px-3.5 py-2 text-gray-800 dark:text-gray-200 align-top text-sm",
        },
      }),
      Placeholder.configure({
        placeholder: "Start typing your article here...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
    ],
    content: initialContent,
    editable,
    editorProps: {
      attributes: {
        class: "prose sm:prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[340px] p-3.5 sm:p-4 text-gray-900 dark:text-white leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      const jsonContent = editor.getJSON();
      onChange(jsonContent);
    },
  });

  const autoSaveRef = useRef(onAutoSave);
  useEffect(() => {
    autoSaveRef.current = onAutoSave;
  }, [onAutoSave]);

  // Debounced Autosave Effect
  useEffect(() => {
    if (!editor || !onAutoSave) return;

    const handler = setTimeout(async () => {
      if (autoSaveRef.current) {
        setIsSaving(true);
        const jsonContent = editor.getJSON();
        await autoSaveRef.current(jsonContent);
        setIsSaving(false);
      }
    }, 3000);

    return () => clearTimeout(handler);
  }, [editor, editor?.state.doc, onAutoSave]);

  if (!editor) {
    return <div className="h-[500px] w-full animate-pulse bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-800" />;
  }

  // Open Link Modal with snapshot of current selection
  const handleOpenLinkModal = () => {
    if (!editor) return;
    let { from, to, empty } = editor.state.selection;

    // Expand to mark range if cursor is on or inside an existing link
    if (editor.isActive("link")) {
      const markRange = getMarkRange(editor.state.selection.$from, editor.schema.marks.link);
      if (markRange) {
        from = markRange.from;
        to = markRange.to;
        empty = false;
      }
    }

    const text = empty ? "" : editor.state.doc.textBetween(from, to, " ");
    const currentAttrs = editor.getAttributes("link");
    setSavedLinkSelection({ from, to, text });
    setActiveLinkHref(currentAttrs?.href || "");
    setIsLinkModalOpen(true);
  };

  // Handle Internal Link Selection
  const handleSelectInternalLink = (data: { blogId: string; slug: string; title: string; href: string }) => {
    if (!editor) return;

    if (savedLinkSelection && savedLinkSelection.from !== savedLinkSelection.to) {
      // Highlighted text existed when modal opened -> restore selection and set link
      editor
        .chain()
        .setTextSelection({ from: savedLinkSelection.from, to: savedLinkSelection.to })
        .setLink({
          href: data.href,
          blogId: data.blogId,
          targetType: "blog",
        } as unknown as { href: string })
        .focus()
        .run();
    } else {
      // No text was highlighted: insert the blog title as new linked text
      editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          text: data.title,
          marks: [
            {
              type: "link",
              attrs: {
                href: data.href,
                blogId: data.blogId,
                targetType: "blog",
              },
            },
          ],
        })
        .run();
    }
    setSavedLinkSelection(null);
  };

  // Handle Custom Link Selection
  const handleSelectCustomLink = (data: { href: string; openInNewTab: boolean }) => {
    if (!editor) return;

    if (savedLinkSelection && savedLinkSelection.from !== savedLinkSelection.to) {
      // Highlighted text existed -> restore selection and apply link
      editor
        .chain()
        .setTextSelection({ from: savedLinkSelection.from, to: savedLinkSelection.to })
        .setLink({
          href: data.href,
          target: data.openInNewTab ? "_blank" : undefined,
          targetType: "external",
          blogId: null,
        } as unknown as { href: string })
        .focus()
        .run();
    } else {
      // No text was highlighted: insert the URL as new linked text
      editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          text: data.href,
          marks: [
            {
              type: "link",
              attrs: {
                href: data.href,
                target: data.openInNewTab ? "_blank" : undefined,
                targetType: "external",
                blogId: null,
              },
            },
          ],
        })
        .run();
    }
    setSavedLinkSelection(null);
  };

  // Handle Remove Link
  const handleRemoveLink = () => {
    if (!editor) return;
    if (savedLinkSelection && savedLinkSelection.from !== savedLinkSelection.to) {
      editor
        .chain()
        .setTextSelection({ from: savedLinkSelection.from, to: savedLinkSelection.to })
        .unsetLink()
        .focus()
        .run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setSavedLinkSelection(null);
  };

  // Handle Image Insertion
  const handleInsertImage = (data: { src: string; mediaId?: string; alt?: string; caption?: string }) => {
    editor.chain().focus().setImage({
      src: data.src,
      alt: data.alt || "",
      mediaId: data.mediaId,
      caption: data.caption,
    } as unknown as { src: string }).run();
  };

  // 1-Click Auto-link for NearGrow Ads services and CTAs
  const handleAutoLinkKeywords = () => {
    if (!editor) return;
    const currentJson = editor.getJSON();
    const autoLinked = autoLinkAst(currentJson);
    if (autoLinked) {
      editor.commands.setContent(autoLinked);
      const jsonContent = editor.getJSON();
      onChange(jsonContent);
      toast.success("✨ NearGrow Ads services & Free Audit CTAs auto-linked successfully!");
    }
  };

  // Pre-formatted Hotel Comparison Table from User Notes
  const HOTEL_COMPARISON_DATA = [
    { area: "Property knowledge", inHouse: "Strong day-to-day knowledge", agency: "Requires regular coordination with the hotel" },
    { area: "Speed for daily updates", inHouse: "Usually faster", agency: "Depends on process and response time" },
    { area: "Specialist expertise", inHouse: "Limited by the people hired", agency: "Access to multiple specialists" },
    { area: "Content capacity", inHouse: "Can reduce during busy periods", agency: "Larger creative and production support" },
    { area: "SEO and paid ads", inHouse: "Often depends on one generalist", agency: "Usually managed by channel experts" },
    { area: "Continuity", inHouse: "Can be affected by leave or resignation", agency: "Shared systems reduce dependency on one person" },
    { area: "Outside perspective", inHouse: "May become brand-blind", agency: "Offers broader market and competitor exposure" },
    { area: "Fixed cost", inHouse: "Salaries, tools, training and production", agency: "Retainer plus agreed third-party costs" },
    { area: "Scalability", inHouse: "Requires new hiring", agency: "Scope can usually be expanded more quickly" },
    { area: "Revenue accountability", inHouse: "Varies by internal structure", agency: "Should be built into strategy and reporting" },
  ];

  const handleInsertHotelComparisonTable = () => {
    if (!editor) return;
    setIsTableMenuOpen(false);
    editor.chain().focus().insertContent({
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            { type: "tableHeader", content: [{ type: "paragraph", content: [{ type: "text", text: "Area" }] }] },
            { type: "tableHeader", content: [{ type: "paragraph", content: [{ type: "text", text: "Small In-House Team" }] }] },
            { type: "tableHeader", content: [{ type: "paragraph", content: [{ type: "text", text: "Hospitality Marketing Agency" }] }] },
          ],
        },
        ...HOTEL_COMPARISON_DATA.map((row) => ({
          type: "tableRow",
          content: [
            { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: row.area }] }] },
            { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: row.inHouse }] }] },
            { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: row.agency }] }] },
          ],
        })),
      ],
    }).run();
  };

  const handleInsertBlankTable = () => {
    if (!editor) return;
    setIsTableMenuOpen(false);
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="relative border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-[#0a1220] shadow-sm">
      
      {/* Top Toolbar */}
      <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1 px-2.5 py-1.5 bg-gray-50/95 dark:bg-[#0d1728]/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 select-none">
        
        {/* Undo / Redo */}
        <EditorButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
          <Undo size={16} />
        </EditorButton>
        <EditorButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)">
          <Redo size={16} />
        </EditorButton>

        <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

        {/* Headings */}
        <EditorButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          isActive={editor.isActive("heading", { level: 2 })} 
          title="Heading 2 (H2)"
        >
          <Heading2 size={16} /> H2
        </EditorButton>
        <EditorButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
          isActive={editor.isActive("heading", { level: 3 })} 
          title="Heading 3 (H3)"
        >
          <Heading3 size={16} /> H3
        </EditorButton>
        <EditorButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} 
          isActive={editor.isActive("heading", { level: 4 })} 
          title="Heading 4 (H4)"
        >
          <Heading4 size={16} /> H4
        </EditorButton>

        <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

        {/* Basic Text Formatting */}
        <EditorButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} title="Bold (Ctrl+B)">
          <Bold size={16} />
        </EditorButton>
        <EditorButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} title="Italic (Ctrl+I)">
          <Italic size={16} />
        </EditorButton>
        <EditorButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive("underline")} title="Underline (Ctrl+U)">
          <UnderlineIcon size={16} />
        </EditorButton>
        <EditorButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive("strike")} title="Strikethrough">
          <Strikethrough size={16} />
        </EditorButton>

        <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

        {/* Text Alignment */}
        <EditorButton onClick={() => editor.chain().focus().setTextAlign("left").run()} isActive={editor.isActive({ textAlign: "left" })} title="Align Left">
          <AlignLeft size={16} />
        </EditorButton>
        <EditorButton onClick={() => editor.chain().focus().setTextAlign("center").run()} isActive={editor.isActive({ textAlign: "center" })} title="Align Center">
          <AlignCenter size={16} />
        </EditorButton>
        <EditorButton onClick={() => editor.chain().focus().setTextAlign("right").run()} isActive={editor.isActive({ textAlign: "right" })} title="Align Right">
          <AlignRight size={16} />
        </EditorButton>

        <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

        {/* Lists */}
        <EditorButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")} title="Bullet List">
          <List size={16} />
        </EditorButton>
        <EditorButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")} title="Numbered List">
          <ListOrdered size={16} />
        </EditorButton>

        <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

        {/* Link & Image Modals */}
        <EditorButton 
          onClick={handleOpenLinkModal} 
          isActive={editor.isActive("link")} 
          title="Insert Link (Internal Blog or URL)"
        >
          <LinkIcon size={16} />
        </EditorButton>

        {/* 1-Click Auto-Link Services & CTAs */}
        <EditorButton
          onClick={handleAutoLinkKeywords}
          title="✨ Auto-Link NearGrow Ads Services & Free Audit CTAs (1-Click)"
        >
          <Sparkles size={16} className="text-amber-500" />
          <span className="hidden xl:inline text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            Auto-Link
          </span>
        </EditorButton>

        <EditorButton 
          onClick={() => setIsMediaModalOpen(true)} 
          isActive={editor.isActive("image")} 
          title="Insert Image (Upload or Media Library)"
        >
          <ImageIcon size={16} />
        </EditorButton>

        <EditorButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")} title="Quote Block">
          <Quote size={16} />
        </EditorButton>
        
        <EditorButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive("codeBlock")} title="Code Block">
          <Code size={16} />
        </EditorButton>

        <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

        {/* Table Dropdown Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsTableMenuOpen(!isTableMenuOpen)}
            className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-medium transition-colors cursor-pointer ${
              editor.isActive("table") || isTableMenuOpen
                ? "bg-secondary-50 dark:bg-secondary-950/60 text-secondary-600 dark:text-secondary-400 border border-secondary-200 dark:border-secondary-800"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            title="Table Options"
          >
            <TableIcon size={16} />
            <ChevronDown size={11} className={`transition-transform duration-150 ${isTableMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {isTableMenuOpen && (
            <>
              {/* Click-Outside Backdrop */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsTableMenuOpen(false)} 
              />
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-[#0c1424] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl z-50 p-2 space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={handleInsertHotelComparisonTable}
                  className="w-full text-left px-3 py-2.5 text-xs font-semibold text-gray-800 dark:text-gray-200 hover:bg-secondary-50 dark:hover:bg-secondary-950/50 hover:text-secondary-600 dark:hover:text-secondary-400 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-secondary-500/10 text-secondary-500 flex items-center justify-center shrink-0">
                    <TableIcon size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Insert Comparison Table</div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400 font-normal">Hotel Agency vs In-House (10 rows)</div>
                  </div>
                </button>

                <div className="border-t border-gray-100 dark:border-gray-800/80 my-1" />

                <button
                  type="button"
                  onClick={handleInsertBlankTable}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/80 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center shrink-0">
                    <Plus size={16} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-200">Insert Blank Table</div>
                    <div className="text-[11px] text-gray-400">Standard 3 × 3 grid</div>
                  </div>
                </button>

                {editor.isActive("table") && (
                  <>
                    <div className="border-t border-gray-100 dark:border-gray-800/80 my-1" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsTableMenuOpen(false);
                        editor.chain().focus().deleteTable().run();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                    >
                      <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center shrink-0">
                        <Trash2 size={15} />
                      </div>
                      <div>
                        <div className="font-semibold">Delete Table</div>
                        <div className="text-[11px] text-rose-400/80">Remove entire active table</div>
                      </div>
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Reset Formatting */}
        <EditorButton onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear Formatting">
          <RotateCcw size={16} />
        </EditorButton>
      </div>

      {/* Contextual Table Tools (Active when inside a table) */}
      {editor.isActive("table") && (
        <div className="flex flex-wrap items-center gap-1.5 px-3.5 py-1.5 bg-secondary-50/70 dark:bg-[#091824] border-b border-secondary-200/80 dark:border-secondary-900/60 text-xs select-none animate-in fade-in duration-150">
          <span className="font-bold mr-1 flex items-center gap-1 text-[11px] text-secondary-700 dark:text-secondary-300">
            <TableIcon size={13} /> Table Controls:
          </span>
          <button
            type="button"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className="px-2 py-0.5 rounded-md bg-white dark:bg-secondary-950/80 hover:bg-secondary-100 dark:hover:bg-secondary-900 text-secondary-800 dark:text-secondary-200 border border-secondary-200 dark:border-secondary-800 text-xs font-semibold cursor-pointer transition-colors"
          >
            + Row Below
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteRow().run()}
            className="px-2 py-0.5 rounded-md bg-white dark:bg-secondary-950/80 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/60 text-gray-700 dark:text-gray-200 border border-secondary-200 dark:border-secondary-800 text-xs font-semibold cursor-pointer transition-colors"
          >
            - Delete Row
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className="px-2 py-0.5 rounded-md bg-white dark:bg-secondary-950/80 hover:bg-secondary-100 dark:hover:bg-secondary-900 text-secondary-800 dark:text-secondary-200 border border-secondary-200 dark:border-secondary-800 text-xs font-semibold cursor-pointer transition-colors"
          >
            + Col Right
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteColumn().run()}
            className="px-2 py-0.5 rounded-md bg-white dark:bg-secondary-950/80 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/60 text-gray-700 dark:text-gray-200 border border-secondary-200 dark:border-secondary-800 text-xs font-semibold cursor-pointer transition-colors"
          >
            - Delete Col
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-xs font-semibold cursor-pointer ml-auto transition-colors"
          >
            Remove Table
          </button>
        </div>
      )}

      {/* Editor Content */}
      <div className="relative">
        <EditorContent editor={editor} />
      </div>

      {/* Editor Status Bar / Footer (Properly Justified & Responsive) */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 sm:px-4 py-2 bg-gray-50/80 dark:bg-[#0c1424]/80 border-t border-gray-200/80 dark:border-gray-800/80 text-xs text-gray-500 dark:text-gray-400 select-none">
        <div className="flex items-center gap-2 text-[11px] sm:text-xs">
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {editor.getText().trim() ? editor.getText().trim().split(/\s+/).length : 0}
          </span>
          <span>words</span>
          <span className="text-gray-300 dark:text-gray-700">•</span>
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {editor.getText().length}
          </span>
          <span>characters</span>
        </div>

        {onAutoSave && (
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium">
            {isSaving ? (
              <span className="flex items-center gap-1.5 text-amber-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Draft Saved
              </span>
            )}
          </div>
        )}
      </div>

      {/* WordPress-Like Internal Link Modal */}
      <InternalLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => {
          setIsLinkModalOpen(false);
          setSavedLinkSelection(null);
        }}
        onSelectInternalLink={handleSelectInternalLink}
        onSelectCustomLink={handleSelectCustomLink}
        onRemoveLink={handleRemoveLink}
        initialHref={activeLinkHref}
        isLinkActive={editor.isActive("link")}
      />

      {/* Media Upload & Library Modal */}
      <MediaPickerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onInsertImage={handleInsertImage}
        blogId={blogId}
      />
    </div>
  );
}
