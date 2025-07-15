import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import CorrelationChart from "../components/CorrelationChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShare,
  faSun,
  faMoon,
  faDesktop,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import html2canvas from "html2canvas";

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
  const chartRef = useRef(null);

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
      console.error("Error generating chaos:", err);
      setError("Failed to generate chaos. Please try again.");
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
      console.error("Error generating chaos:", error);
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
          Causeless Chaos - Discover Spurious Correlations in DevOps
        </title>
        <meta
          name="description"
          content="Generate and explore spurious correlations between DevOps metrics and everyday life. A fun tool for data scientists, engineers, and curious minds to discover meaningless but statistically significant relationships."
        />
        <meta
          name="keywords"
          content="spurious correlation, DevOps metrics, data science, correlation analysis, chaos engineering, statistical significance, data visualization"
        />
        <meta name="author" content="Causely" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#1a1a1a" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Causeless Chaos - Discover Spurious Correlations in DevOps"
        />
        <meta
          property="og:description"
          content="Generate and explore spurious correlations between DevOps metrics and everyday life. A fun tool for data scientists and engineers."
        />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://causeless-chaos.vercel.app" />
        <meta property="og:site_name" content="Causeless Chaos" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Causeless Chaos - Discover Spurious Correlations in DevOps"
        />
        <meta
          name="twitter:description"
          content="Generate and explore spurious correlations between DevOps metrics and everyday life. A fun tool for data scientists and engineers."
        />
        <meta name="twitter:image" content="/og-image.png" />
        <meta name="twitter:creator" content="@causely" />

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

        {/* Additional SEO */}
        <meta name="application-name" content="Causeless Chaos" />
        <meta name="apple-mobile-web-app-title" content="Causeless Chaos" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://causeless-chaos.vercel.app" />
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
                <img
                  src={
                    resolvedTheme === "dark"
                      ? "/causely-logo-dark.svg"
                      : "/causely-logo.svg"
                  }
                  alt="Causely Logo"
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
                    title="Share This Chaos"
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

              <a
                href="https://github.com/causely-oss/causeless-chaos"
                target="_blank"
                rel="noopener noreferrer"
                className="github-link-compact"
                title="View Source Code"
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
          <div className="header">
            <h1 className="title">Causeless Chaos</h1>
            <p className="subtitle">
              Generating spurious correlations in DevOps metrics since 2025
            </p>
          </div>

          <button
            className="chaos-button"
            onClick={generateChaos}
            disabled={isGenerating}
          >
            {isGenerating
              ? "Generating Chaos..."
              : "Show Me the Causeless Chaos"}
          </button>

          {isGenerating && (
            <div className="loading">
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
        </div>
      </div>
    </>
  );
}
