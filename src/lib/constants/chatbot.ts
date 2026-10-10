export const CHAT_STEPS = {
  WELCOME: 0,
  INITIAL_PROMPT: 1,
  NAME: 2,
  EMAIL: 3,
  PHONE: 4,
  SERVICE: 5,
  MESSAGE: 6,
  SUBMITTING: 7,
  SUCCESS: 8,
  ERROR: 9,
} as const;

export const SERVICES_LIST = [
  "Google Business Profile & Local SEO",
  "Meta Ads & Google Search Ads",
  "Landing Pages & Business Websites",
  "Conversion Tracking & Analytics",
  "Brand Identity & Strategy",
  "Creative Services & Reel Editing",
  "Local Citations & Directory Listings",
  "Organic Social Media Management",
];

export const BOT_AVATAR = "/icon.png"; // Standard NearGrow Avatar

export const CHATBOT_MESSAGES = {
  WELCOME: "Welcome to NearGrow Ads. How can I help you grow today?",
  ASK_NAME: "What's your name?",
  ASK_EMAIL: "What's the Email Id",
  ASK_PHONE: "What's your phone number we can call you on?",
  ASK_SERVICE: "Thanks You! ",
  ASK_MESSAGE: "Awesome. Anything specific you'd like us to know before we hop on a call?",
  SUCCESS: "All set! 🎉 Our team will review your details and reach out shortly. Have a great day!",
  ERROR_GENERIC: "Oops! Something went wrong on our end. Please try again or reach out to us directly.",
  ERROR_RATE_LIMIT: "You're moving too fast! Please wait a moment before trying again.",
};
