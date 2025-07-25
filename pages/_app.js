import "../styles/globals.css";
import GoogleAnalytics from "../components/GoogleAnalytics";

export default function App({ Component, pageProps }) {
  return (
    <>
      <GoogleAnalytics />
      <Component {...pageProps} />
    </>
  );
}
