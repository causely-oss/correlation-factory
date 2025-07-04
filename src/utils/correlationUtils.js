import { subDays, format } from 'date-fns';

// Generate 10 recent dates for the x-axis
export function generateDateRange() {
  const dates = [];
  const today = new Date();
  
  for (let i = 9; i >= 0; i--) {
    const date = subDays(today, i);
    dates.push({
      date: format(date, 'MMM dd'),
      fullDate: date
    });
  }
  
  return dates;
}

// Generate correlated data points
export function generateCorrelatedData(correlationStrength = 0.8) {
  const dates = generateDateRange();
  const data = [];
  
  // Generate base values for metric A
  const baseValueA = Math.random() * 100 + 50; // Random base between 50-150
  const rangeA = Math.random() * 40 + 20; // Random range between 20-60
  
  // Generate base values for metric B
  const baseValueB = Math.random() * 500 + 100; // Random base between 100-600
  const rangeB = Math.random() * 200 + 50; // Random range between 50-250
  
  // Generate random trend direction
  const trendDirection = Math.random() > 0.5 ? 1 : -1;
  
  // Generate correlated data points
  for (let i = 0; i < dates.length; i++) {
    // Generate a base sine wave with some randomness
    const basePattern = Math.sin(i * 0.8) + Math.random() * 0.5 - 0.25;
    
    // Add trend
    const trendComponent = (i / dates.length) * trendDirection * 0.5;
    
    // Calculate metric A value
    const metricAValue = baseValueA + (basePattern + trendComponent) * rangeA;
    
    // Calculate metric B value with correlation
    const correlatedComponent = basePattern * correlationStrength;
    const randomComponent = (Math.random() - 0.5) * (1 - correlationStrength);
    const metricBValue = baseValueB + (correlatedComponent + randomComponent + trendComponent) * rangeB;
    
    data.push({
      date: dates[i].date,
      metricA: Math.max(0, Math.round(metricAValue * 100) / 100), // Round to 2 decimal places, ensure positive
      metricB: Math.max(0, Math.round(metricBValue * 100) / 100)
    });
  }
  
  return data;
}

// Calculate correlation coefficient (R²)
export function calculateRSquared(data) {
  const n = data.length;
  const xValues = data.map(d => d.metricA);
  const yValues = data.map(d => d.metricB);
  
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
  
  // Ensure we always return a believable R² value (between 0.7 and 0.95)
  // This is fake data after all, so we want it to look convincing
  const fakeRSquared = Math.max(0.7, Math.min(0.95, Math.abs(rSquared)));
  
  return Math.round(fakeRSquared * 1000) / 1000; // Round to 3 decimal places
}

// Generate a complete correlation dataset
export function generateCorrelationData() {
  // Generate random correlation strength that will look impressive
  const correlationStrength = Math.random() * 0.3 + 0.7; // Between 0.7 and 1.0
  
  const data = generateCorrelatedData(correlationStrength);
  const rSquared = calculateRSquared(data);
  
  return {
    data,
    rSquared,
    correlationStrength
  };
}

// Generate fake statistical significance
export function generateStatisticalSignificance() {
  // Generate a fake p-value that looks impressive
  const pValue = Math.random() * 0.04 + 0.001; // Between 0.001 and 0.041
  return Math.round(pValue * 10000) / 10000; // Round to 4 decimal places
}

// Generate additional fake statistics to make it look more scientific
export function generateFakeStatistics() {
  return {
    sampleSize: 10,
    pValue: generateStatisticalSignificance(),
    confidenceInterval: "95%",
    standardError: Math.round((Math.random() * 0.1 + 0.05) * 1000) / 1000,
    tStatistic: Math.round((Math.random() * 4 + 2) * 100) / 100,
    degreesOfFreedom: 8
  };
} 