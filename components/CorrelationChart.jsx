import React, { useEffect, useState, forwardRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CorrelationChart = forwardRef(
  ({ data, metrics, rSquared, pValue }, ref) => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Detect current theme
    useEffect(() => {
      const updateTheme = () => {
        const appElement = document.querySelector(".app");
        if (appElement) {
          const hasLightClass = appElement.classList.contains("light");
          setIsDarkMode(!hasLightClass);
        }
      };

      // Initial theme detection
      updateTheme();

      // Listen for theme changes via observer
      const observer = new MutationObserver(updateTheme);
      const appElement = document.querySelector(".app");
      if (appElement) {
        observer.observe(appElement, {
          attributes: true,
          attributeFilter: ["class"],
        });
      }

      return () => observer.disconnect();
    }, []);

    // Theme-based colors
    const getThemeColors = () => {
      if (isDarkMode) {
        return {
          grid: "#4a5568",
          text: "#e2e8f0",
          axis: "#a0aec0",
          metricA: "#8884d8",
          metricB: "#82ca9d",
          tooltipBg: "#2d3748",
          tooltipText: "#e2e8f0",
          pValueText: "#a0aec0",
        };
      } else {
        return {
          grid: "#e2e8f0",
          text: "#1a202c",
          axis: "#4a5568",
          metricA: "#6366f1",
          metricB: "#10b981",
          tooltipBg: "#ffffff",
          tooltipText: "#1a202c",
          pValueText: "#4a5568",
        };
      }
    };

    const themeColors = getThemeColors();

    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="chart-tooltip">
            <p className="tooltip-label">{`Date: ${label}`}</p>
            <p className="tooltip-metric-a">
              <span style={{ color: themeColors.metricA }}>●</span>
              {` ${metrics.metricA}: ${payload[0].value} ${metrics.unitA}`}
            </p>
            <p className="tooltip-metric-b">
              <span style={{ color: themeColors.metricB }}>●</span>
              {` ${metrics.metricB}: ${payload[1].value} ${metrics.unitB}`}
            </p>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="chart-container" ref={ref}>
        <div className="chart-header">
          <div className="chart-title">
            {metrics.metricA} vs {metrics.metricB}
          </div>
        </div>

        <div className="correlation-coefficient">
          Correlation: <span className="r-squared">R² = {rSquared}</span>
          <div
            style={{
              fontSize: "0.9rem",
              color: themeColors.pValueText,
              marginTop: "0.5rem",
            }}
          >
            p = {pValue},{" "}
            {pValue <= 0.05
              ? "statistically significant*"
              : "not statistically significant*"}
          </div>
        </div>

        <div className="metric-labels">
          <div className="metric-label metric-a">
            {metrics.metricA} ({metrics.unitA})
          </div>
          <div className="metric-label metric-b">
            {metrics.metricB} ({metrics.unitB})
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: themeColors.text }}
              axisLine={{ stroke: themeColors.axis }}
              tickLine={{ stroke: themeColors.axis }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12, fill: themeColors.text }}
              axisLine={{ stroke: themeColors.metricA }}
              tickLine={{ stroke: themeColors.metricA }}
              label={{
                value: `${metrics.metricA} (${metrics.unitA})`,
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: themeColors.metricA },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12, fill: themeColors.text }}
              axisLine={{ stroke: themeColors.metricB }}
              tickLine={{ stroke: themeColors.metricB }}
              label={{
                value: `${metrics.metricB} (${metrics.unitB})`,
                angle: 90,
                position: "insideRight",
                style: { textAnchor: "middle", fill: themeColors.metricB },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="metricA"
              stroke={themeColors.metricA}
              strokeWidth={3}
              dot={{ fill: themeColors.metricA, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: themeColors.metricA, strokeWidth: 2 }}
              name={metrics.metricA}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="metricB"
              stroke={themeColors.metricB}
              strokeWidth={3}
              dot={{ fill: themeColors.metricB, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: themeColors.metricB, strokeWidth: 2 }}
              name={metrics.metricB}
            />
          </LineChart>
        </ResponsiveContainer>

        <div
          style={{
            fontSize: "0.8rem",
            color: themeColors.pValueText,
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          * Statistical significance may be artificially enhanced for dramatic
          effect
        </div>
      </div>
    );
  },
);

CorrelationChart.displayName = "CorrelationChart";

export default CorrelationChart;
