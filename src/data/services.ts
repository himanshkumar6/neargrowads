import { Fingerprint, Headset, PenTool, Zap, Users, Briefcase, LayoutGrid, Globe } from 'lucide-react';

export const services = [
  {
    id: 1,
    slug: "brand-strategy",
    title: "Brand Identity & Strategy",
    subheading: "Stand Out in Your Local Market",
    description: "We help local businesses establish a cohesive brand identity, distinct visual positioning, and consistent messaging across all digital touchpoints.",
    longDescription: "A strong brand gives local businesses credibility before a customer ever walks through the door or calls. NearGrow Ads crafts professional brand identities—from logo guidelines and color palettes to local market positioning and tone of voice—that help you stand out from local competitors and earn customer trust.",
    icon: Fingerprint,
    features: [
      "Local market positioning",
      "Visual identity guidelines",
      "Typography and color palette",
      "Messaging and tagline framework",
      "Digital touchpoint consistency",
      "Local competitor differentiation"
    ],
    benefits: [
      "Stand out clearly in competitive local markets",
      "Build immediate trust with prospective local customers",
      "Maintain consistent branding across all digital profiles",
      "Establish a memorable, professional business identity"
    ],
    faqs: [
      {
        question: "Why does brand identity matter for a local business?",
        answer: "A professional, consistent visual identity builds immediate credibility. When local customers compare options, strong branding signals quality, reliability, and attention to detail."
      },
      {
        question: "What deliverables are included in brand identity services?",
        answer: "Deliverables typically include core logo usage guidelines, primary and secondary color palettes, font pairings, messaging pillars, and templates for digital touchpoints."
      }
    ],
    relatedArticles: [
      {
        title: "How Local Branding Influences Customer Trust",
        slug: "local-branding-customer-trust"
      }
    ]
  },
  {
    id: 2,
    slug: "revenue-management",
    title: "Conversion Tracking & Analytics",
    subheading: "Data-Driven Insights for Every Campaign",
    description: "We configure conversion tracking, phone call tracking, WhatsApp click monitoring, and lead funnel analytics so you know which channels perform.",
    longDescription: "Stop guessing what drives customer inquiries. NearGrow Ads sets up essential conversion tracking across Meta Pixel, Google Tag Manager, Google Analytics, and lead capture forms. We ensure every call, form submission, and WhatsApp inquiry is measured accurately so your marketing budget is invested wisely.",
    icon: Headset,
    features: [
      "Google Tag Manager setup",
      "Meta Pixel and event tracking",
      "Google Ads conversion tracking",
      "Phone call click tracking",
      "WhatsApp click monitoring",
      "Form submission tracking",
      "Monthly performance reporting"
    ],
    benefits: [
      "Gain complete transparency into where inquiries come from",
      "Identify your highest-converting marketing channels",
      "Eliminate wasted spend by tracking real business actions",
      "Make informed marketing decisions backed by verified data"
    ],
    faqs: [
      {
        question: "Why is conversion tracking essential for local advertising?",
        answer: "Conversion tracking attributes real business actions—such as phone calls, WhatsApp messages, or form fills—back to specific ads or campaigns so you know exactly which marketing efforts produce results."
      },
      {
        question: "Can you track phone calls and WhatsApp inquiries from our website?",
        answer: "Yes. We configure click-to-call and WhatsApp click events via Google Tag Manager and analytics platforms to measure customer engagement accurately."
      }
    ],
    relatedArticles: [
      {
        title: "Understanding Local Ad Tracking and Conversions",
        slug: "understanding-ad-tracking"
      }
    ]
  },
  {
    id: 3,
    slug: "website-design-seo",
    title: "Landing Pages & Business Websites",
    subheading: "Fast, Mobile-First Digital Storefronts",
    description: "We build responsive, conversion-focused landing pages and small business websites engineered for speed, clean UX, and seamless lead capture.",
    longDescription: "Your website is your central digital anchor. NearGrow Ads designs and develops mobile-first landing pages and small business websites focused on clarity and action. With fast load speeds, integrated WhatsApp and call buttons, and built-in local SEO foundations, we convert visitors into active inquiries.",
    icon: PenTool,
    features: [
      "Mobile-first responsive design",
      "Conversion-focused landing page layout",
      "Click-to-call and WhatsApp integration",
      "Contact and inquiry form setup",
      "Fast load speed optimization",
      "On-page local SEO foundations",
      "Clear service and pricing presentation",
      "Clean, modern typography and visuals"
    ],
    benefits: [
      "Turn online visitors into direct phone and WhatsApp inquiries",
      "Provide a clean, trustworthy digital impression for your brand",
      "Ensure a flawless browsing experience across all mobile devices",
      "Own your primary digital asset without third-party platform limitations"
    ],
    faqs: [
      {
        question: "What is the difference between a landing page and a full business website?",
        answer: "A landing page is a single, focused web page designed specifically to convert ad traffic for a particular campaign or service. A full business website includes multiple pages detailing your company, complete service range, about story, and contact channels."
      },
      {
        question: "Are your websites optimized for mobile visitors?",
        answer: "Yes. Over 70% of local searches happen on mobile devices. Every website and landing page we build is engineered mobile-first with fast load times and prominent call-to-action buttons."
      }
    ],
    relatedArticles: [
      {
        title: "Key Elements of a High-Converting Local Business Website",
        slug: "local-website-conversion-elements"
      }
    ]
  },
  {
    id: 4,
    slug: "performance-marketing",
    title: "Meta Ads & Google Search Ads",
    subheading: "Targeted Advertising for Local Customer Acquisition",
    description: "We plan, launch, and manage targeted campaigns across Facebook, Instagram, and Google Search. Client ad spend is kept completely separate from management fees.",
    longDescription: "Reach high-intent local buyers when they are actively looking for your products or services. NearGrow Ads manages targeted Google Search Ads capturing active searchers and Meta Ads (Facebook & Instagram) driving local awareness and direct inquiries. We structure campaigns carefully, review search queries, test creatives, and provide clear monthly reporting. Note: Client advertising spend is paid directly to advertising platforms and remains distinct from our management fee.",
    icon: Zap,
    features: [
      "Meta Ads (Facebook & Instagram) management",
      "Google Search Ads campaign setup & care",
      "Local radius and geographic targeting",
      "Ad creative design and copy variations",
      "Search query reviews and negative keywords",
      "Lead generation and message campaigns",
      "Meta and Google Ads account audits",
      "Monthly performance reviews"
    ],
    benefits: [
      "Capture high-intent local searchers actively looking for your service",
      "Build local brand familiarity across Facebook and Instagram feeds",
      "Complete billing transparency with ad spend kept separate from management fees",
      "Ongoing campaign refinement and negative keyword pruning to protect budgets"
    ],
    faqs: [
      {
        question: "Is advertising budget included in NearGrow Ads management fees?",
        answer: "No. Advertising spend is paid directly to Meta or Google. Our fee covers strategy, campaign setup, creative design, copywriting, targeting, ongoing optimization, and performance reporting."
      },
      {
        question: "Do you guarantee specific numbers of leads or sales?",
        answer: "No. We never make speculative guarantees. Advertising performance depends on local market demand, competition, pricing, and campaign variables. We focus on data-driven best practices, continuous testing, and transparent reporting."
      }
    ],
    relatedArticles: [
      {
        title: "How Local Businesses Can Optimize Google Search Ads",
        slug: "optimizing-google-search-ads"
      }
    ]
  },
  {
    id: 5,
    slug: "seo-gmb",
    title: "Google Business Profile & Local SEO",
    subheading: "Improve Your Google Maps & Local Search Presence",
    description: "We optimize your Google Business Profile (GBP) and local search foundations to improve visibility on Google Maps and help nearby customers find your business easily.",
    longDescription: "When local customers search for services 'near me', your Google Business Profile is often their first impression. NearGrow Ads handles complete GBP setup, profile verification guidance, primary and secondary category selection, business description optimization, high-quality photo uploads, and review reply drafting. Paired with local citation consistency, we help strengthen your local search footprint.",
    icon: Users,
    features: [
      "Google Business Profile setup and claim assistance",
      "Verification guidance and profile audit",
      "Category and service list optimization",
      "Compelling business description drafting",
      "High-resolution photo and asset uploads",
      "Google Business Profile weekly posts and updates",
      "Review reply drafting and management guidance",
      "Local citation consistency checks"
    ],
    benefits: [
      "Appear prominently when local customers search on Google Maps",
      "Drive more phone calls, direction requests, and website visits",
      "Build social proof through an active, professionally maintained profile",
      "Ensure accurate business hours, phone number, and location details"
    ],
    faqs: [
      {
        question: "What is included in Google Business Profile (GBP) optimization?",
        answer: "We optimize your business categories, service listings, business description, operating hours, photo gallery, and Google updates. We also provide verification guidance and draft professional review responses."
      },
      {
        question: "Do you guarantee a top 3 ranking on Google Maps?",
        answer: "No agency can ethically guarantee a top 3 placement on Google Maps, as Google's local algorithm considers proximity, relevance, and prominence. We implement proven local SEO best practices to maximize your ranking potential."
      }
    ],
    relatedArticles: [
      {
        title: "Best Practices for Google Business Profile Optimization",
        slug: "gbp-optimization-best-practices"
      }
    ]
  },
  {
    id: 6,
    slug: "content-copywriting",
    title: "Creative Services & Reel Editing",
    subheading: "Engaging Visuals & High-Impact Video Editing",
    description: "We design static social posts, informative carousels, and professionally edit short-form reels from client-supplied footage to keep your brand visually active.",
    longDescription: "Consistent, high-quality visual content builds familiarity and trust in your local community. NearGrow Ads provides graphic design for static posts and educational carousels, alongside video editing for Instagram Reels and YouTube Shorts. We edit and polish client-provided footage with engaging pacing, captions, and branding to maximize viewer attention.",
    icon: Briefcase,
    features: [
      "Branded static social post design",
      "Multi-slide educational carousel design",
      "Short-form reel and video editing",
      "Client footage pacing, transitions, and audio sync",
      "On-screen captions and engaging hooks",
      "Promotional banner and poster design",
      "Local business copywriting for social captions",
      "On-site content shoot coordination (Optional)"
    ],
    benefits: [
      "Maintain a polished, consistent visual standard on social feeds",
      "Save significant time by outsourcing graphic design and editing",
      "Engage prospective customers with modern short-form video formats",
      "Communicate service benefits clearly through concise, persuasive copy"
    ],
    faqs: [
      {
        question: "Do clients need to provide footage for reel editing?",
        answer: "Yes, standard reel editing packages utilize client-supplied video footage and photos. We provide guidance on what to record. Optional on-site content shoots can be arranged depending on location and scope."
      },
      {
        question: "What styles of social graphics do you produce?",
        answer: "We produce clean static announcements, promotional creatives, customer testimonials, educational carousels, and seasonal service banners tailored to your brand colors and typography."
      }
    ],
    relatedArticles: [
      {
        title: "Creating Engaging Short-Form Video for Local Businesses",
        slug: "short-form-video-for-local-business"
      }
    ]
  },
  {
    id: 7,
    slug: "influencer-pr",
    title: "Local Citations & Directory Listings",
    subheading: "Consistent Business Information Across the Web",
    description: "We submit and manage accurate Name, Address, and Phone (NAP) citations across top business directories to reinforce your local search authority.",
    longDescription: "Search engines evaluate the credibility of local businesses by checking how consistently their details appear across the web. NearGrow Ads builds and audits local citations on reputable business directories, mapping platforms, and regional listings. We also help set up WhatsApp Business profiles to streamline direct customer communication.",
    icon: Globe,
    features: [
      "NAP consistency audit (Name, Address, Phone)",
      "Top Indian local directory submissions",
      "Duplicate listing identification and cleanup guidance",
      "WhatsApp Business profile setup and quick replies",
      "Industry-specific regional directory listings",
      "Consistent business category alignment",
      "Local community and citation maintenance"
    ],
    benefits: [
      "Reinforce search engine confidence in your physical location data",
      "Prevent customer confusion caused by outdated phone numbers or addresses",
      "Create additional verified discovery touchpoints across the web",
      "Strengthen your overall local SEO foundation"
    ],
    faqs: [
      {
        question: "What are local citations and why do they matter?",
        answer: "Local citations are online mentions of your business Name, Address, and Phone number (NAP) on directories and portals. Consistent citations help search engines verify your legitimacy and improve local search confidence."
      },
      {
        question: "How does WhatsApp Business setup support customer acquisition?",
        answer: "Setting up a professional WhatsApp Business profile with verified hours, automated greeting messages, catalog links, and quick replies makes it effortless for local prospects to contact and inquire directly."
      }
    ],
    relatedArticles: [
      {
        title: "The Importance of NAP Consistency in Local Search",
        slug: "nap-consistency-local-seo"
      }
    ]
  },
  {
    id: 8,
    slug: "social-media-management",
    title: "Organic Social Media Management",
    subheading: "Consistent Presence Across Instagram & Facebook",
    description: "We manage organic social media channels with scheduled posts, strategic content calendars, branded graphics, and profile optimization to keep your audience engaged.",
    longDescription: "An active social media profile signals a thriving, reliable business to prospective customers. NearGrow Ads manages your organic presence across Instagram and Facebook. From profile bio optimization and monthly content calendars to regular scheduling and caption writing, we ensure your business maintains a professional, active community presence.",
    icon: LayoutGrid,
    features: [
      "Profile bio and highlight cover optimization",
      "Monthly content calendar planning",
      "Consistent post scheduling and publishing",
      "Engaging caption writing with local hashtags",
      "Story templates and announcement posts",
      "Social profile audit and recommendations",
      "Organic audience engagement best practices"
    ],
    benefits: [
      "Keep your business top-of-mind with local customers and followers",
      "Ensure new visitors see an active, trustworthy, and modern profile",
      "Showcase your work, team, client reviews, and special offers consistently",
      "Clearly separate organic brand building from paid advertising campaigns"
    ],
    faqs: [
      {
        question: "What is the difference between organic social media and paid ads?",
        answer: "Organic social media focuses on maintaining an active, credible presence for people who visit your profile or follow your page. Paid ads (Meta Ads) proactively target new local users who do not yet follow your business to generate inquiries."
      },
      {
        question: "How often will content be posted on our social media profiles?",
        answer: "Posting frequency depends on your selected monthly package—typically ranging from 8 to 16 curated static/carousel posts and reels per month, supported by regular stories."
      }
    ],
    relatedArticles: [
      {
        title: "Building an Organic Social Media Strategy for Local Brands",
        slug: "organic-social-strategy-local-brands"
      }
    ]
  }
];
