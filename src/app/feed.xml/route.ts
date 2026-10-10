import { Feed } from 'feed';
import { getAllPublishedPosts } from '@/lib/blog/data';

export const revalidate = 3600; // Cache for 1 hour, allowing ISR

export async function GET() {
  const baseUrl = 'https://trisagemarketing.com';
  const now = new Date();

  try {
    const posts = await getAllPublishedPosts();

    const feed = new Feed({
      title: "NearGrow Ads Blog | Digital Marketing Insights",
      description: "Expert perspectives on SEO, performance marketing, direct booking strategies, and scaling business revenue growth.",
      id: baseUrl,
      link: baseUrl,
      language: "en",
      image: `${baseUrl}/icon.png`,
      favicon: `${baseUrl}/favicon.ico`,
      copyright: `All rights reserved ${now.getFullYear()}, NearGrow Ads`,
      updated: now,
      generator: "NearGrow Ads CMS",
      feedLinks: {
        rss2: `${baseUrl}/feed.xml`,
      },
      author: {
        name: "NearGrow Ads",
        email: "info@neargrowads.in",
        link: baseUrl,
      }
    });

    posts.forEach(post => {
      const postUrl = `${baseUrl}/blog/${post.slug}`;
      const pubDate = new Date(post.published_at || post.created_at || now);

      feed.addItem({
        title: post.title,
        id: postUrl,
        link: postUrl,
        description: post.excerpt || post.meta_description || "Read more on our blog.",
        // Using excerpt as summary since parsing complex ProseMirror JSON to clean HTML here is unnecessary for RSS.
        content: post.excerpt || post.meta_description || "Read more on our blog.",
        author: [
          {
            name: post.author_name || "NearGrow Team",
            // role is mapped as title if needed
          }
        ],
        date: pubDate,
        image: post.cover_image || undefined,
        category: [
          { name: post.category ?? 'General' },
          ...(post.tags || []).map((tag: string) => ({ name: tag }))
        ],
      });
    });

    return new Response(feed.rss2(), {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    });

  } catch (error) {
    console.error('[RSS Feed] Failed to generate:', error);
    return new Response('<error>Internal Server Error</error>', { 
      status: 500,
      headers: { 'Content-Type': 'application/xml; charset=utf-8' }
    });
  }
}
