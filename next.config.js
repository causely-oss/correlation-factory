/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_ANALYTICS_KEY: process.env.GOOGLE_ANALYTICS_KEY,
  },
}

module.exports = nextConfig 