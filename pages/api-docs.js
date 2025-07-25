import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShare,
  faSun,
  faMoon,
  faDesktop,
  faDownload,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

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

export default function ApiDocs() {
  const router = useRouter();
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeEndpoint, setActiveEndpoint] = useState('words');
  const [testParams, setTestParams] = useState({
    words: {},
    metric: { seed: 'blue', correlationId: 'coffee' },
    caption: { correlationId: 'coffee' }
  });
  const [testResults, setTestResults] = useState({});

  // Handle URL parameter for active endpoint
  useEffect(() => {
    if (router.isReady && router.query.endpoint && mounted) {
      const endpoint = router.query.endpoint;
      if (endpoints[endpoint]) {
        setActiveEndpoint(endpoint);
      }
    }
  }, [router.isReady, router.query.endpoint, mounted]);

  // Update URL when active endpoint changes
  useEffect(() => {
    if (mounted && router.isReady && activeEndpoint) {
      const url = `${router.pathname}?endpoint=${activeEndpoint}`;
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', url);
      }
    }
  }, [activeEndpoint, mounted, router.isReady]);

  const endpoints = {
    words: {
      name: 'GET /api/words',
      description: 'Get random words for generating correlation IDs and seeds. Returns two adjectives and one noun. The noun is used as the correlation ID, which will ensure that metrics will always correlate, and the adjectives are used as the seeds for two metrics. Adjectives from letters A-M are used for devops metrics, and adjectives from letters N-Z are used for absurd metrics.',
      parameters: [],
      example: '/api/words'
    },
    metric: {
      name: 'GET /api/metric/[seed]/[correlationId]',
      description: 'Get correlation data for a specific seed and correlation ID. Metrics with the same correlation ID will always correlate, allowing users to pick any two or more metrics and they will have a correlation. The first letter of the seed determines if either the metric is devops (A-M) or absurd (N-Z).',
      parameters: [
        { name: 'seed', type: 'string', required: true, description: 'Seed for reproducible random generation. The first letter determines the category of the metric (devops (A-M) or absurd (N-Z)).' },
        { name: 'correlationId', type: 'string', required: true, description: 'Unique identifier for the correlation. Metrics with the same correlation ID will always correlate, making it easy to create fake correlations.' }
      ],
      example: '/api/metric/blue/coffee'
    },
    caption: {
      name: 'GET /api/caption/[correlationId]',
      description: 'Get a humorous caption for a correlation',
      parameters: [
        { name: 'correlationId', type: 'string', required: true, description: 'Unique identifier for the correlation' }
      ],
      example: '/api/caption/example-correlation'
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const testEndpoint = async (endpoint) => {
    const params = testParams[endpoint];
    let url = `/api/${endpoint}`;
    
    if (endpoint === 'metric') {
      url = `/api/metric/${params.seed}/${params.correlationId}`;
    } else if (endpoint === 'caption') {
      url = `/api/caption/${params.correlationId}`;
    } else {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      setTestResults(prev => ({
        ...prev,
        [endpoint]: {
          status: response.status,
          data: data,
          url: url
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [endpoint]: {
          status: 'error',
          data: { error: error.message },
          url: url
        }
      }));
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>API Documentation - Causeless Chaos</title>
        <meta name="description" content="API documentation for Causeless Chaos endpoints" />
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
                      ? "/causely-logo-dark.svg"
                      : "/causely-logo.svg"
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
              <Link
                href="/"
                className="back-link-compact"
                title="Back to Game"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </Link>

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

        <div className="main-content">
          <div className="api-docs">
        <div className="api-header">
          <h1>API Documentation</h1>
          <p>Interactive documentation for Causeless Chaos API endpoints</p>
        </div>

        <div className="api-content">
          <div className="sidebar">
            <h3>Endpoints</h3>
            <nav className="endpoint-nav">
              {Object.entries(endpoints).map(([key, endpoint]) => (
                <button
                  key={key}
                  className={`endpoint-nav-item ${activeEndpoint === key ? 'active' : ''}`}
                  onClick={() => setActiveEndpoint(key)}
                >
                  {endpoint.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="endpoint-content">
            {activeEndpoint && endpoints[activeEndpoint] && (
              <div className="endpoint-details">
                <h2>{endpoints[activeEndpoint].name}</h2>
                <p className="description">{endpoints[activeEndpoint].description}</p>
                
                <div className="example">
                  <h4>Example Request</h4>
                  <code>{endpoints[activeEndpoint].example}</code>
                </div>

                <div className="parameters">
                  <h4>Parameters</h4>
                  <div className="params-list">
                    {endpoints[activeEndpoint].parameters.map((param, index) => (
                      <div key={index} className="param-item">
                        <div className="param-header">
                          <span className="param-name">{param.name}</span>
                          <span className={`param-type ${param.required ? 'required' : 'optional'}`}>
                            {param.type} {param.required ? '(required)' : '(optional)'}
                          </span>
                        </div>
                        <p className="param-description">{param.description}</p>
                        {param.default && (
                          <p className="param-default">Default: {param.default}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="test-section">
                  <h4>Test Endpoint</h4>
                  <div className="test-form">
                    {endpoints[activeEndpoint].parameters.map((param, index) => (
                      <div key={index} className="form-group">
                        <label htmlFor={`${activeEndpoint}-${param.name}`}>
                          {param.name} {param.required && <span className="required">*</span>}
                        </label>
                        <input
                          type={param.type === 'number' ? 'number' : 'text'}
                          id={`${activeEndpoint}-${param.name}`}
                          value={testParams[activeEndpoint][param.name] || ''}
                          onChange={(e) => setTestParams(prev => ({
                            ...prev,
                            [activeEndpoint]: {
                              ...prev[activeEndpoint],
                              [param.name]: e.target.value
                            }
                          }))}
                          placeholder={param.default ? `Default: ${param.default}` : param.name}
                        />
                      </div>
                    ))}
                    <button 
                      className="test-button"
                      onClick={() => testEndpoint(activeEndpoint)}
                    >
                      Test Endpoint
                    </button>
                  </div>

                  {testResults[activeEndpoint] && (
                    <div className="test-results">
                      <h5>Response</h5>
                      <div className="response-info">
                        <span className={`status ${testResults[activeEndpoint].status === 200 ? 'success' : 'error'}`}>
                          Status: {testResults[activeEndpoint].status}
                        </span>
                        <span className="url">URL: {testResults[activeEndpoint].url}</span>
                      </div>
                      <pre className="response-data">
                        {JSON.stringify(testResults[activeEndpoint].data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
        </div>
      </div>
    </>
  );
} 