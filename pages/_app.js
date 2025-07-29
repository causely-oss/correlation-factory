import "../styles/globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { config } from "../lib/config";

export default function App({ Component, pageProps }) {
  return (
    <>
      <GoogleAnalytics gaId={config.googleAnalytics.measurementId} />
      <Component {...pageProps} />
    </>
  );
}
