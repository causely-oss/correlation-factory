import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import CorrelationChart from "../components/CorrelationChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShare,
  faSun,
  faMoon,
  faDesktop,
  faDownload,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import html2canvas from "html2canvas";
import { config } from "../lib/config";

// Theme management hook
function useTheme() {
  const [theme, setTheme] = useState("system");
  const [resolvedTheme, setResolvedTheme] = useState("dark");

  useEffect(() => {
    // Get saved theme from localStorage or default to 'system'
    const savedTheme = localStorage.getItem("theme") || "system";
    setTheme(savedTheme);

    // Function to determine resolved theme based on system preference
    const getResolvedTheme = (themeMode) => {
      if (themeMode === "system") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      return themeMode;
    };

    // Set initial resolved theme
    setResolvedTheme(getResolvedTheme(savedTheme));

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e) => {
      if (savedTheme === "system") {
        setResolvedTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, []);

  const toggleTheme = () => {
    const themes = ["system", "light", "dark"];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];

    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);

    // Update resolved theme
    if (nextTheme === "system") {
      setResolvedTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
      );
    } else {
      setResolvedTheme(nextTheme);
    }
  };

  return { theme, resolvedTheme, toggleTheme };
}

// Generate three random words via API
async function generateRandomWords() {
  const response = await fetch("/api/words");
  if (!response.ok) {
    throw new Error("Failed to fetch random words");
  }
  return response.json();
}

// Parse URL parameters to extract seeds, correlation ID, and points
function parseShareUrl() {
  if (typeof window === "undefined") return null;

  const urlParams = new URLSearchParams(window.location.search);
  const cc = urlParams.get("cc");
  const points = urlParams.get("points");

  if (!cc) return null;

  const parts = cc.split("-");
  if (parts.length !== 3) return null;

  return {
    seed1: parts[0],
    seed2: parts[1],
    correlationId: parts[2],
    points: points ? parseInt(points, 10) : 10,
  };
}

// Generate shareable URL with points parameter
function generateShareUrl(seed1, seed2, correlationId, points = 10) {
  if (typeof window === "undefined") return "";

  const baseUrl = window.location.origin + window.location.pathname;
  let url = `${baseUrl}?cc=${seed1}-${seed2}-${correlationId}`;

  if (points !== 10) {
    url += `&points=${points}`;
  }

  return url;
}



// Calculate correlation coefficient (R²) and p value from two datasets
function calculateCorrelationStats(dataA, dataB) {
  const n = dataA.length;
  const xValues = dataA.map((d) => d.value);
  const yValues = dataB.map((d) => d.value);

  // Calculate means
  const meanX = xValues.reduce((sum, x) => sum + x, 0) / n;
  const meanY = yValues.reduce((sum, y) => sum + y, 0) / n;

  // Calculate correlation coefficient
  let numerator = 0;
  let denominatorX = 0;
  let denominatorY = 0;

  for (let i = 0; i < n; i++) {
    const dx = xValues[i] - meanX;
    const dy = yValues[i] - meanY;

    numerator += dx * dy;
    denominatorX += dx * dx;
    denominatorY += dy * dy;
  }

  const correlation = numerator / Math.sqrt(denominatorX * denominatorY);
  const rSquared = correlation * correlation;

  // Generate a more realistic p value based on R² and sample size
  // Higher R² and larger sample size = lower p value
  const tStat =
    Math.abs(correlation) * Math.sqrt((n - 2) / (1 - rSquared + 0.001)); // Add small epsilon to avoid division by zero

  // Calculate p value - always significant but varied realistically
  let pValue;
  if (rSquared >= 0.8) {
    // Very strong correlation
    pValue = n >= 20 ? 0.001 : 0.01;
  } else if (rSquared >= 0.7) {
    // Strong correlation
    pValue = n >= 20 ? 0.01 : 0.05;
  } else if (rSquared >= 0.6) {
    // Moderate correlation (minimum threshold)
    pValue = 0.05;
  } else {
    // Fallback for any edge cases below 0.6
    pValue = 0.05;
  }

  return {
    rSquared: Math.round(rSquared * 1000) / 1000, // Round to 3 decimal places
    pValue: pValue,
  };
}

// Combine data from two metric APIs into chart format
function combineMetricData(metricAData, metricBData) {
  const chartData = [];

  // Assume both datasets have the same dates (they should!)
  for (let i = 0; i < metricAData.length; i++) {
    chartData.push({
      date: metricAData[i].date,
      metricA: metricAData[i].value,
      metricB: metricBData[i].value,
    });
  }

  return chartData;
}

export default function Home() {
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const [correlationData, setCorrelationData] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [caption, setCaption] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [currentSeeds, setCurrentSeeds] = useState(null);
  const [shareUrl, setShareUrl] = useState("");
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [points, setPoints] = useState(10);
  const [showScrollButton, setShowScrollButton] = useState(true);
  const chartRef = useRef(null);
  const rootCauseSectionRef = useRef(null);

  // Intersection observer to hide/show button based on bottom section visibility
  useEffect(() => {
    if (!rootCauseSectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowScrollButton(false);
          } else {
            setShowScrollButton(true);
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(rootCauseSectionRef.current);

    return () => observer.disconnect();
  }, [correlationData, metrics, isGenerating, error]);

  // Save chart as image
  const saveChartAsImage = async () => {
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current, {
          backgroundColor: resolvedTheme === "dark" ? "#2d3748" : "#ffffff",
          scale: 2, // Higher resolution
          useCORS: true,
          allowTaint: true,
          logging: false,
        });

        const link = document.createElement("a");
        link.download = `correlation-${metrics.metricA.replace(/\s+/g, "-").toLowerCase()}-vs-${metrics.metricB.replace(/\s+/g, "-").toLowerCase()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch (error) {
        console.error("Error saving chart:", error);
      }
    }
  };

  // Check for shared URL on page load
  useEffect(() => {
    const sharedData = parseShareUrl();
    if (sharedData) {
      setPoints(sharedData.points);
      generateChaosFromSeeds(
        sharedData.seed1,
        sharedData.seed2,
        sharedData.correlationId,
        sharedData.points,
      );
    }
  }, []);

  const generateChaosFromSeeds = async (
    seed1,
    seed2,
    correlationId,
    numPoints = 10,
  ) => {
    setIsGenerating(true);
    setError(null);

    try {
      const pointsQuery = numPoints !== 10 ? `?points=${numPoints}` : "";

      // Make parallel API calls using the provided seeds and points
      const [metricAResponse, metricBResponse, captionResponse] =
        await Promise.all([
          fetch(`/api/metric/${seed1}/${correlationId}${pointsQuery}`),
          fetch(`/api/metric/${seed2}/${correlationId}${pointsQuery}`),
          fetch(`/api/caption/${correlationId}`),
        ]);

      // Check if all requests were successful
      if (!metricAResponse.ok || !metricBResponse.ok || !captionResponse.ok) {
        throw new Error("Failed to fetch data from API");
      }

      // Parse responses
      const metricAData = await metricAResponse.json();
      const metricBData = await metricBResponse.json();
      const captionData = await captionResponse.json();

      // Ensure we have one devops and one absurd metric
      const devopsMetric =
        metricAData.metricType === "devops" ? metricAData : metricBData;
      const absurdMetric =
        metricAData.metricType === "absurd" ? metricAData : metricBData;

      // Set up the metrics object for the chart
      const metricsObj = {
        metricA: devopsMetric.metric,
        metricB: absurdMetric.metric,
        unitA: devopsMetric.unit,
        unitB: absurdMetric.unit,
      };

      // Combine the data from both metrics into chart format
      const chartData = combineMetricData(devopsMetric.data, absurdMetric.data);

      // Calculate R² and p value locally from the two datasets
      const correlationStats = calculateCorrelationStats(
        devopsMetric.data,
        absurdMetric.data,
      );

      // Set state with the new data
      setMetrics(metricsObj);
      setCorrelationData({
        data: chartData,
        rSquared: correlationStats.rSquared,
        pValue: correlationStats.pValue,
      });
      setCaption(captionData.caption);
      setCurrentSeeds({ seed1, seed2, correlationId, points: numPoints });
      const newShareUrl = generateShareUrl(
        seed1,
        seed2,
        correlationId,
        numPoints,
      );
      setShareUrl(newShareUrl);

      // Update the URL with the new correlation parameters
      if (typeof window !== "undefined") {
        const urlPath = newShareUrl.replace(window.location.origin, "");
        window.history.pushState({}, "", urlPath);
      }
    } catch (err) {
      console.error("Error generating correlation:", err);
      setError("Failed to generate correlation. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateChaos = async () => {
    try {
      // Generate new random words via API
      const words = await generateRandomWords();
      const seed1 = words.adjectiveAM; // A-M adjective for metricA (DevOps)
      const seed2 = words.adjectiveNZ; // N-Z adjective for metricB (absurd)
      const correlationId = words.noun; // Noun for correlation ID

      await generateChaosFromSeeds(seed1, seed2, correlationId, points);

      // Update the URL with the new correlation parameters
      const newUrl = generateShareUrl(seed1, seed2, correlationId, points);
      const urlPath = newUrl.replace(window.location.origin, "");
      window.history.pushState({}, "", urlPath);
    } catch (error) {
      console.error("Error generating correlation:", error);
      setError("Failed to generate new words. Please try again.");
    }
  };

  const handleShare = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    } catch (err) {
      // Fallback: select the text for manual copying
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  };

  const handlePointsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 5 && value <= 100 && value % 5 === 0) {
      setPoints(value);

      // Auto-regenerate if we have current seeds (data is displayed)
      if (currentSeeds && !isGenerating) {
        generateChaosFromSeeds(
          currentSeeds.seed1,
          currentSeeds.seed2,
          currentSeeds.correlationId,
          value,
        );
      }
    }
  };

  return (
    <>
      <Head>
        <title>
          Correlation Factory - Discover Spurious Correlations in DevOps
        </title>
        <meta
          name="description"
          content="A humorous web app that generates fake correlations between absurd DevOps metrics. Perfect for demonstrating the dangers of spurious correlations in data science."
        />
        <meta
          name="keywords"
          content="spurious correlation, DevOps metrics, data science, correlation analysis, chaos engineering, statistical significance, data visualization"
        />
        <meta name="author" content="Correlation Factory" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#6366f1" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Correlation Factory - Discover Spurious Correlations in DevOps"
        />
        <meta
          property="og:description"
          content="A humorous web app that generates fake correlations between absurd DevOps metrics. Perfect for demonstrating the dangers of spurious correlations in data science."
        />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content={config.siteUrl} />
        <meta property="og:site_name" content="Correlation Factory" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Correlation Factory - Discover Spurious Correlations in DevOps"
        />
        <meta
          name="twitter:description"
          content="A humorous web app that generates fake correlations between absurd DevOps metrics. Perfect for demonstrating the dangers of spurious correlations in data science."
        />
        <meta name="twitter:image" content="/og-image.png" />
        <meta name="twitter:site" content={config.social.twitter} />
        <meta name="twitter:creator" content={config.social.twitter} />

        {/* Bluesky */}
        <meta name="bsky:card" content="summary_large_image" />
        <meta
          name="bsky:title"
          content="Correlation Factory - Discover Spurious Correlations in DevOps"
        />
        <meta
          name="bsky:description"
          content="A humorous web app that generates fake correlations between absurd DevOps metrics. Perfect for demonstrating the dangers of spurious correlations in data science."
        />
        <meta name="bsky:image" content="/og-image.png" />
        <meta name="bsky:site" content={config.social.bluesky} />
        <meta name="bsky:creator" content={config.social.bluesky} />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#6366f1" />

        {/* Additional SEO */}
        <meta name="application-name" content="Correlation Factory" />
        <meta name="apple-mobile-web-app-title" content="Correlation Factory" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Canonical URL */}
        <link rel="canonical" href={config.siteUrl} />
      </Head>

      <div className={`app ${resolvedTheme}`}>
        {/* Fixed Top Menu Bar */}
        <div className="top-menu">
          <div className="top-menu-left">
            <div className="powered-by-compact">
              <span>Proudly presented by</span>
              <a
                href="https://causely.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="causely-link-compact"
              >
                <Image
                  src={
                    resolvedTheme === "dark"
                      ? config.logos.dark
                      : config.logos.light
                  }
                  alt="Causely Logo"
                  width={120}
                  height={24}
                  className="causely-logo-compact"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "inline";
                  }}
                />
                <span
                  className="causely-text-compact"
                  style={{ display: "none" }}
                >
                  Causely
                </span>
              </a>
            </div>
          </div>

          <div className="top-menu-right">
            <div className="top-menu-controls">
              <div className="control-group-compact">
                <label htmlFor="points-top" className="control-label-compact">
                  Data Points:
                </label>
                <input
                  id="points-top"
                  type="number"
                  min="5"
                  max="100"
                  step="5"
                  value={points}
                  onChange={handlePointsChange}
                  className="points-input-compact"
                  disabled={isGenerating}
                />
              </div>

              {currentSeeds && (
                <>
                  <button
                    className="share-button-compact"
                    onClick={handleShare}
                    disabled={!shareUrl}
                    title="Share This Correlation"
                  >
                    <FontAwesomeIcon icon={faShare} />
                  </button>
                  <button
                    className="save-button-compact"
                    onClick={saveChartAsImage}
                    disabled={!correlationData || !metrics}
                    title="Save Chart as Image"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                </>
              )}

              <Link
                href="/api-docs"
                className="api-link-compact"
                title="API Documentation"
              >
                <FontAwesomeIcon icon={faBook} />
              </Link>

              <a
                href="https://github.com/causely-oss/correlation-factory"
                target="_blank"
                rel="noopener noreferrer"
                className="github-link-compact"
                title="View on GitHub"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>

              <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                title={`Current: ${theme === "system" ? "System" : theme === "light" ? "Light" : "Dark"}`}
              >
                <FontAwesomeIcon
                  icon={
                    theme === "system"
                      ? faDesktop
                      : theme === "light"
                        ? faSun
                        : faMoon
                  }
                />
              </button>
            </div>
          </div>
        </div>

        {/* Share Tooltip */}
        {showShareTooltip && (
          <div className="share-tooltip-fixed">Link copied to clipboard!</div>
        )}

        <div className="main-content">
          <div
            className={`header ${correlationData && metrics && !isGenerating && !error ? "header-hidden-mobile" : ""}`}
          >
            <h1 className="title">Correlation Factory</h1>
            <p className="subtitle">
              Generating spurious correlations in DevOps metrics since 2025
            </p>
          </div>

          <button
            className="correlation-button"
            onClick={generateChaos}
            disabled={isGenerating}
          >
            {isGenerating
              ? "Generating Correlation..."
              : correlationData && metrics && !error
                ? "Show me another correlation"
                : "Manufacture Correlation"}
          </button>

          {isGenerating && (
            <div
              className={`loading ${correlationData && metrics && !error ? "loading-hidden-mobile" : ""}`}
            >
              <p>🔄 Artificially correlating unrelated metrics...</p>
              <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                Making separate API calls for each metric, computing correlation
                locally...
              </p>
            </div>
          )}

          {error && (
            <div className="error">
              <p className="error-text">{error}</p>
            </div>
          )}

          {correlationData && metrics && !isGenerating && !error && (
            <>
              <CorrelationChart
                data={correlationData.data}
                metrics={metrics}
                rSquared={correlationData.rSquared}
                pValue={correlationData.pValue}
                ref={chartRef}
              />

              <div className="caption">
                <p className="caption-text">{caption}</p>
              </div>
            </>
          )}

          {!correlationData && !isGenerating && !error && (
            <div className="caption">
              <p className="caption-text">
                Click the button above to discover the hidden connections
                between your infrastructure metrics and the most important
                things in life.
              </p>
            </div>
          )}

          {/* Floating scroll button - only show when graph is rendered */}
          {correlationData &&
            metrics &&
            !isGenerating &&
            !error &&
            showScrollButton && (
              <div
                className="floating-scroll-button"
                onClick={() => {
                  setShowScrollButton(false);
                  document.querySelector(".root-cause-section").scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              >
                <div className="floating-text">
                  Discover real causal reasoning
                </div>
                <div className="floating-arrow">↓</div>
              </div>
            )}
        </div>

        {/* Causal Reasoning Section - only show when graph is rendered */}
        {correlationData && metrics && !isGenerating && !error && (
          <div className="root-cause-section" ref={rootCauseSectionRef}>
            <div className="root-cause-content">
              <h2 className="root-cause-title">
                Beyond Correlation: Real Causal Reasoning
              </h2>
              <p className="root-cause-text">
                While this app demonstrates how easy it is to find meaningless
                correlations, real observability requires understanding the
                actual causal relationships between systems. Causely uses
                probabilistic modeling and causal inference to transform
                high-volume observability signals into real-time, explainable
                insights.
              </p>
              <div className="root-cause-features">
                <div className="feature">
                  <h3>Model-Driven Reasoning</h3>
                  <p>
                    Built-in causal models capture common root causes and
                    failure propagation patterns across your entire
                    infrastructure.
                  </p>
                </div>
                <div className="feature">
                  <h3>Automatic Topology Discovery</h3>
                  <p>
                    Continuously maps your services, databases, and
                    infrastructure to understand real dependencies and blast
                    radius.
                  </p>
                </div>
                <div className="feature">
                  <h3>Real-Time Inference</h3>
                  <p>
                    Uses Bayesian networks to infer the most likely root cause
                    from observed symptoms, without manual correlation.
                  </p>
                </div>
              </div>
              <div className="root-cause-cta">
                <p className="cta-text">
                  Ready to move beyond correlation to true causal reasoning?
                </p>
                <a
                  href="https://www.causely.ai/try?utm_source=correlation-factory&utm_medium=web&utm_campaign=correlation-demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="demo-button"
                >
                  Get Started with Causely
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
