import CTA from "@/components/CTA";
import type { Metadata } from "next";
import { getAllPublishedPosts, getAllCategories } from "@/lib/blog/data";
import BlogLayout from "@/components/blog/BlogLayout";

export const metadata: Metadata = {
  title: "Growth Insights & Strategy | NearGrow Ads",
  description: "Expert perspectives on SEO, direct booking strategies, performance marketing, and scaling business revenue growth.",
  alternates: {
    canonical: "https://trisagemarketing.com/blog",
  },
};

export const revalidate = 60;

export default async function BlogPage() {
  const [blogs, dbCategories] = await Promise.all([
    getAllPublishedPosts(),
    getAllCategories(),
  ]);

  return (
    <main className="min-h-screen bg-white dark:bg-[#050b14] relative overflow-hidden">
      <BlogLayout initialBlogs={blogs} dbCategories={dbCategories} />
      <CTA />
    </main>
  );
}
