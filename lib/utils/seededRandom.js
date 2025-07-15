// Simple seeded random number generator
export class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }

  // Generate next random number (0-1)
  next() {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  // Generate random integer between min and max (inclusive)
  nextInt(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  // Generate random float between min and max
  nextFloat(min, max) {
    return this.next() * (max - min) + min;
  }

  // Generate random element from array
  nextElement(array) {
    return array[this.nextInt(0, array.length - 1)];
  }
}

// Hash string to number (for consistent seed generation)
export function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Generate correlation parameters from correlationId
export function generateCorrelationParams(correlationId) {
  const correlationSeed = hashString(correlationId);
  const rng = new SeededRandom(correlationSeed);

  return {
    correlationStrength: rng.nextFloat(0.77, 0.95), // Ensure R² > 0.6 (since R² = correlation²)
    metricPairIndex: rng.nextInt(0, 999999), // Used to select which metrics pair together
    captionIndex: rng.nextInt(0, 999999),
    rSquared: rng.nextFloat(0.6, 0.9), // Ensure R² always above 0.6
    baseValueA: rng.nextFloat(50, 150),
    rangeA: rng.nextFloat(20, 60),
    baseValueB: rng.nextFloat(100, 600),
    rangeB: rng.nextFloat(50, 250),
    trendDirection: rng.next() > 0.5 ? 1 : -1,
  };
}
