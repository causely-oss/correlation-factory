import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_KEY;

const GoogleAnalytics = () => {
  const router = useRouter();

  useEffect(() => {
    if (!GA_TRACKING_ID) {
      console.log(
        "Google Analytics not loaded: NEXT_PUBLIC_GOOGLE_ANALYTICS_KEY not set",
      );
      return;
    }

    // Track page views on route changes
    const handleRouteChange = (url) => {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("config", GA_TRACKING_ID, {
          page_title: document.title,
          page_location: url,
        });
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // Don't render anything if GA is not configured
  if (!GA_TRACKING_ID) {
    return null;
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;
