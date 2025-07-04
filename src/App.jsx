import React, { useState } from 'react';
import CorrelationChart from './components/CorrelationChart';
import { getRandomMetricsPair, getRandomCaption } from './data/metrics';
import { generateCorrelationData } from './utils/correlationUtils';
import './index.css';

function App() {
  const [correlationData, setCorrelationData] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [caption, setCaption] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateChaos = async () => {
    setIsGenerating(true);
    
    // Add a small delay for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate random metrics pair
    const newMetrics = getRandomMetricsPair();
    
    // Generate correlated data
    const newCorrelationData = generateCorrelationData();
    
    // Get random caption
    const newCaption = getRandomCaption();
    
    setMetrics(newMetrics);
    setCorrelationData(newCorrelationData);
    setCaption(newCaption);
    setIsGenerating(false);
  };

  return (
    <div className="app">
      <div className="header">
        <h1 className="title">Causeless Chaos</h1>
        <p className="subtitle">
          Generating spurious correlations in DevOps metrics since 2024
        </p>
      </div>

      <button 
        className="chaos-button" 
        onClick={generateChaos}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating Chaos...' : 'Show Me the Causeless Chaos'}
      </button>

      {isGenerating && (
        <div className="loading">
          <p>🔄 Artificially correlating unrelated metrics...</p>
        </div>
      )}

      {correlationData && metrics && !isGenerating && (
        <>
          <CorrelationChart
            data={correlationData.data}
            metrics={metrics}
            rSquared={correlationData.rSquared}
          />
          
          <div className="caption">
            <p className="caption-text">{caption}</p>
          </div>
        </>
      )}

      {!correlationData && !isGenerating && (
        <div className="caption">
          <p className="caption-text">
            Click the button above to discover the hidden connections between 
            your infrastructure metrics and the most important things in life.
          </p>
        </div>
      )}
    </div>
  );
}

export default App; 