import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Meta tags */}
        <meta name="description" content="A humorous web app that generates fake correlations between absurd DevOps metrics" />
        <meta name="keywords" content="devops, metrics, correlations, humor, data visualization" />
        <meta name="author" content="Causeless Chaos" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Causeless Chaos" />
        <meta property="og:description" content="Generate fake correlations between absurd DevOps metrics" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://causeless-chaos.vercel.app" />
        <meta property="og:image" content="/og-image.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Causeless Chaos" />
        <meta name="twitter:description" content="Generate fake correlations between absurd DevOps metrics" />
        <meta name="twitter:image" content="/og-image.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 