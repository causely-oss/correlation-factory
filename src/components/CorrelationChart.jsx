import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const CorrelationChart = ({ data, metrics, rSquared }) => {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{`Date: ${label}`}</p>
          <p className="tooltip-metric-a">
            <span style={{ color: '#8884d8' }}>●</span>
            {` ${metrics.metricA}: ${payload[0].value} ${metrics.unitA}`}
          </p>
          <p className="tooltip-metric-b">
            <span style={{ color: '#82ca9d' }}>●</span>
            {` ${metrics.metricB}: ${payload[1].value} ${metrics.unitB}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <div className="chart-title">
        {metrics.metricA} vs {metrics.metricB}
      </div>
      
      <div className="correlation-coefficient">
        Correlation: <span className="r-squared">R² = {rSquared}</span>
        <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '0.5rem' }}>
          p &lt; 0.05, statistically significant*
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
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#ccc' }}
            tickLine={{ stroke: '#ccc' }}
          />
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#8884d8' }}
            tickLine={{ stroke: '#8884d8' }}
            label={{ 
              value: `${metrics.metricA} (${metrics.unitA})`, 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fill: '#8884d8' }
            }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#82ca9d' }}
            tickLine={{ stroke: '#82ca9d' }}
            label={{ 
              value: `${metrics.metricB} (${metrics.unitB})`, 
              angle: 90, 
              position: 'insideRight',
              style: { textAnchor: 'middle', fill: '#82ca9d' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="metricA"
            stroke="#8884d8"
            strokeWidth={3}
            dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#8884d8', strokeWidth: 2 }}
            name={metrics.metricA}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="metricB"
            stroke="#82ca9d"
            strokeWidth={3}
            dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#82ca9d', strokeWidth: 2 }}
            name={metrics.metricB}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div style={{ fontSize: '0.8rem', color: '#666', textAlign: 'center', marginTop: '1rem' }}>
        * Statistical significance may be artificially enhanced for dramatic effect
      </div>
    </div>
  );
};

export default CorrelationChart; 