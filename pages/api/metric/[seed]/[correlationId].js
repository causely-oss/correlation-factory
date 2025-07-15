import {
  SeededRandom,
  hashString,
  generateCorrelationParams,
} from "../../../../lib/utils/seededRandom.js";
import {
  devopsMetricsWithUnits,
  absurdMetricsWithUnits,
  sarcasticCaptions,
} from "../../../../lib/data/metrics.js";

// Generate date range for the x-axis with configurable number of points
function generateDateRange(points = 10) {
  const dates = [];
  const today = new Date();

  for (let i = points - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      fullDate: date,
    });
  }

  return dates;
}

// Generate correlated data points for a specific metric
function generateMetricData(seed, correlationParams, isMetricA, points = 10) {
  const dates = generateDateRange(points);
  const data = [];

  // Create seeded random generator from the individual seed
  const seedNum = hashString(seed);
  const rng = new SeededRandom(seedNum);

  const {
    correlationStrength,
    baseValueA,
    rangeA,
    baseValueB,
    rangeB,
    trendDirection,
  } = correlationParams;

  // Choose which correlation parameters to use for this metric
  const baseValue = isMetricA ? baseValueA : baseValueB;
  const range = isMetricA ? rangeA : rangeB;

  // Generate correlated data points
  for (let i = 0; i < dates.length; i++) {
    // Generate a base pattern (same for both metrics when using same correlationId)
    const correlationSeed = hashString(
      `${correlationParams.correlationId}_${i}`,
    );
    const correlationRng = new SeededRandom(correlationSeed);
    const basePattern = Math.sin(i * 0.8) + (correlationRng.next() - 0.5) * 0.5;

    // Add trend (scale with number of points to maintain similar trend slope)
    const trendComponent = (i / dates.length) * trendDirection * 0.3;

    // Add more realistic noise - increase metric-specific randomness
    const metricRandomness =
      (rng.next() - 0.5) * (1 - correlationStrength) * 0.6;

    // Add additional independent noise to make correlations less perfect
    const independentNoise = (rng.next() - 0.5) * 0.4;

    // Calculate final value with more realistic noise
    const finalValue =
      baseValue +
      (basePattern * correlationStrength +
        metricRandomness +
        trendComponent +
        independentNoise) *
        range;

    data.push({
      date: dates[i].date,
      value: Math.max(0, Math.round(finalValue * 100) / 100), // Round to 2 decimal places, ensure positive
      fullDate: dates[i].fullDate,
    });
  }

  return data;
}

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { seed, correlationId } = req.query;
  const pointsParam = req.query.points;

  if (!seed || !correlationId) {
    return res.status(400).json({
      error: "Both seed and correlationId are required",
    });
  }

  // Parse points parameter with validation
  let points = 10; // default
  if (pointsParam) {
    const parsedPoints = parseInt(pointsParam, 10);
    if (isNaN(parsedPoints) || parsedPoints < 5 || parsedPoints > 100) {
      return res.status(400).json({
        error: "Points parameter must be a number between 5 and 100",
      });
    }
    points = parsedPoints;
  }

  try {
    // Generate correlation parameters from correlationId (computed on backend)
    const correlationParams = generateCorrelationParams(correlationId);
    // Add correlationId to params for data generation
    correlationParams.correlationId = correlationId;

    // Create seeded random generator from the individual seed
    const seedNum = hashString(seed);
    const rng = new SeededRandom(seedNum);

    // Determine if this is metric A or B based on the first letter of the seed
    // A-M adjectives → metricA (DevOps), N-Z adjectives → metricB (absurd)
    const firstLetter = seed.charAt(0).toLowerCase();
    const isMetricA = firstLetter >= "a" && firstLetter <= "m";

    // Use correlation parameters to determine which metrics to pair
    const devopsMetricIndex =
      correlationParams.metricPairIndex % devopsMetricsWithUnits.length;
    const absurdMetricIndex =
      correlationParams.metricPairIndex % absurdMetricsWithUnits.length;

    // Select the appropriate metric based on seed
    const metricData = isMetricA
      ? devopsMetricsWithUnits[devopsMetricIndex]
      : absurdMetricsWithUnits[absurdMetricIndex];
    const metric = metricData.metric;
    const metricType = isMetricA ? "devops" : "absurd";

    // Generate appropriate unit for this specific metric
    const unit = metricData.units[rng.nextInt(0, metricData.units.length - 1)];

    // Generate the actual data points for this metric with specified number of points
    const data = generateMetricData(seed, correlationParams, isMetricA, points);

    // Return the metric info with actual data points
    res.status(200).json({
      metric,
      metricType,
      unit,
      data, // This is the key addition - actual data points!
      seed,
      correlationId,
      isMetricA,
      points, // Include the number of points used
    });
  } catch (error) {
    console.error("Error generating metric:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
