// Configuration for Correlation Factory
// All values can be overridden via environment variables

export const config = {
  // Site URL - used for canonical URLs, Open Graph, etc.
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://correlation-factory.vercel.app",

  // Social media handles - used for social media meta tags
  social: {
    twitter:
      process.env.NEXT_PUBLIC_TWITTER_HANDLE || "https://x.com/Causelyai",
    bluesky:
      process.env.NEXT_PUBLIC_BLUESKY_HANDLE ||
      "https://bsky.app/profile/causely.ai",
    linkedin:
      process.env.NEXT_PUBLIC_LINKEDIN_HANDLE ||
      "https://www.linkedin.com/company/causely-ai/",
  },

  // Logo URLs - used for Causely branding
  logos: {
    light:
      process.env.NEXT_PUBLIC_CAUSELY_LOGO_LIGHT ||
      "https://www.causely.ai/images/causely-logo.svg",
    dark:
      process.env.NEXT_PUBLIC_CAUSELY_LOGO_DARK ||
      "https://www.causely.ai/images/causely-logo-dark.svg",
  },

  // Google Analytics
  googleAnalytics: {
    measurementId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_KEY,
  },
};

export default config;
