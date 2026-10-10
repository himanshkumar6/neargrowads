import { Metadata } from "next";
import VillasitaCaseStudyClient from "./VillasitaCaseStudyClient";

export const metadata: Metadata = {
  title: "Villasita Resort Growth Case Study | NearGrow Ads",
  description: "See how NearGrow Ads built Villasita Resort's digital growth system, scaling online revenue to approximately ₹1 crore with up to 10x ROAS.",
  keywords: [
    "Villasita Resort Growth Case Study",
    "Haridwar Resort Marketing",
    "Hospitality Digital Growth System",
    "Hotel Direct Booking Strategy",
    "Hotel OTA Revenue Management",
    "Resort Marketing Haridwar",
    "NearGrow Ads Case Study",
    "GEO Hospitality SEO"
  ],
  alternates: {
    canonical: "https://trisagemarketing.com/case-studies/villasita-resort-haridwar",
  },
  openGraph: {
    title: "Villasita Resort Growth Case Study | NearGrow Ads",
    description: "See how NearGrow Ads built Villasita Resort's digital growth system, scaling online revenue to approximately ₹1 crore with up to 10x ROAS.",
    url: "https://trisagemarketing.com/case-studies/villasita-resort-haridwar",
    siteName: "NearGrow Ads",
    images: [
      {
        url: "https://ik.imagekit.io/rrcdbevrb/Hornbill%20post%20july%204.png",
        width: 1200,
        height: 630,
        alt: "Villasita Resort Haridwar Case Study - NearGrow Ads",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Villasita Resort Growth Case Study | NearGrow Ads",
    description: "See how NearGrow Ads built Villasita Resort's digital growth system, scaling online revenue to approximately ₹1 crore with up to 10x ROAS.",
    images: ["https://ik.imagekit.io/rrcdbevrb/Hornbill%20post%20july%204.png"],
  },
};

export default function VillasitaCaseStudyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://trisagemarketing.com/case-studies/villasita-resort-haridwar#article",
        "isPartOf": {
          "@type": "WebPage",
          "@id": "https://trisagemarketing.com/case-studies/villasita-resort-haridwar"
        },
        "headline": "Villasita Resort Growth Case Study: From the Ground Up to a Scalable Digital Revenue Engine",
        "description": "See how NearGrow Ads built Villasita Resort's digital growth system, scaling online revenue to approximately ₹1 crore with up to 10x ROAS.",
        "image": "https://ik.imagekit.io/rrcdbevrb/Hornbill%20post%20july%204.png",
        "datePublished": "2024-01-15T08:00:00+05:30",
        "dateModified": "2026-07-30T16:00:00+05:30",
        "author": {
          "@type": "Organization",
          "name": "NearGrow Ads",
          "url": "https://trisagemarketing.com"
        },
        "publisher": {
          "@type": "Organization",
          "name": "NearGrow Ads",
          "url": "https://trisagemarketing.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://trisagemarketing.com/logo.png"
          }
        },
        "mainEntityOfPage": "https://trisagemarketing.com/case-studies/villasita-resort-haridwar"
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://trisagemarketing.com/case-studies/villasita-resort-haridwar#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://trisagemarketing.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Case Studies",
            "item": "https://trisagemarketing.com/case-studies"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Villasita Resort Haridwar",
            "item": "https://trisagemarketing.com/case-studies/villasita-resort-haridwar"
          }
        ]
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://trisagemarketing.com/case-studies/villasita-resort-haridwar#client",
        "name": "Villasita Resort, Haridwar",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Haridwar",
          "addressRegion": "Uttarakhand",
          "addressCountry": "IN"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "1240"
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VillasitaCaseStudyClient />
    </>
  );
}
