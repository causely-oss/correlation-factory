// DevOps/SRE metrics that sound professional and technical
export const devopsMetrics = [
  "Kubernetes pod restart frequency",
  "Redis cache hit rate",
  "Database connection pool utilization",
  "API response time (95th percentile)",
  "Docker image build duration",
  "Prometheus alert firing rate",
  "Git commit frequency",
  "CI/CD pipeline success rate",
  "Memory leak detection events",
  "Load balancer request distribution",
  "Service mesh latency",
  "Elasticsearch cluster health score",
  "CDN cache invalidation frequency",
  "Microservice dependency graph complexity",
  "Container resource limit breaches",
  "Database query optimization ratio",
  "SSL certificate expiration warnings",
  "Backup verification success rate",
  "Log aggregation processing delay",
  "Auto-scaling trigger frequency",
  "Network packet loss percentage",
  "Service discovery health checks",
  "Database index fragmentation level",
  "API gateway throttling incidents",
  "Container orchestration overhead",
  "Distributed tracing span count",
  "Message queue processing throughput",
  "Infrastructure provisioning time",
  "Security vulnerability scan results",
  "Database replication lag",
  "Load testing failure scenarios",
  "Chaos engineering blast radius",
  "Observability dashboard refresh rate",
  "Resource utilization anomaly detection",
  "Service level indicator violations"
];

// Absurd, unrelated metrics that could theoretically be measured
export const absurdMetrics = [
  "Engineers wearing Crocs to work",
  "Coffee shop visits per developer",
  "Rubber duck debugging sessions",
  "Number of houseplants in the office",
  "Slack emoji reactions per day",
  "Standing desk usage duration",
  "Mechanical keyboard click frequency",
  "Open browser tabs per engineer",
  "Hoodie-wearing developers count",
  "Ping pong tournament participation",
  "Spotify playlist shuffles during work",
  "Energy drink consumption volume",
  "Nerf gun office battles",
  "Sourdough starter maintenance logs",
  "Cat videos watched during builds",
  "Meditation app session completions",
  "Avocado toast consumption rate",
  "Fidget spinner usage frequency",
  "Beanbag chair occupancy time",
  "Succulent plant watering reminders",
  "Developers with beard grooming kits",
  "Artisanal coffee brewing attempts",
  "Yoga mat storage violations",
  "Noise-canceling headphone battery life",
  "Ergonomic mouse pad replacements",
  "Blue light blocking glasses adoption",
  "Kombucha fermentation experiments",
  "Desk lamp brightness adjustments",
  "Pomodoro timer completion rate",
  "Whiteboard marker ink depletion",
  "Stress ball squeeze frequency",
  "Foam roller usage in break rooms",
  "Cryptocurrency price check count",
  "Meme sharing velocity",
  "Procrastination via social media",
  "Snack cupboard raiding incidents",
  "Ambient office temperature complaints",
  "Bluetooth speaker pairing failures",
  "Shoe untying incidents per day",
  "Developers eating lunch at their desk"
];

// Sarcastic captions to display below charts
export const sarcasticCaptions = [
  "Everything graphs together if you squint hard enough.",
  "Correlation does not imply causation, but it does imply clickbait.",
  "Scientists hate this one weird correlation trick!",
  "Breaking: Local data proves that statistics can prove anything.",
  "Remember: 73% of statistics are made up on the spot.",
  "This chart was sponsored by the Department of Spurious Relationships.",
  "Warning: May cause excessive confidence in data interpretation.",
  "Certified by the Institute of Questionable Analytics.",
  "Results may vary. Side effects include false conclusions.",
  "Perfect correlation achieved through careful data massage.",
  "Your data scientist will hate this simple graphing trick.",
  "Evidence suggests that graphs can be very persuasive.",
  "Causation is just correlation with better marketing.",
  "This correlation brought to you by selective data filtering.",
  "Remember: If it trends together, it must be connected... right?",
  "Advisory: This chart may cause spontaneous PowerPoint presentations.",
  "Proof that any two things can be mathematically related.",
  "Disclaimer: No actual insights were harmed in making this chart.",
  "The universe is basically just one big correlation engine.",
  "This correlation is definitely not a coincidence. Trust us.",
  "Mathematics: Making the impossible seem inevitable since forever.",
  "Your confirmation bias is showing, but that's okay.",
  "Results guaranteed to be statistically significant (p < 0.05).",
  "This graph contains 0% actual causation, 100% pure speculation.",
  "Brought to you by the Committee for Misleading Data Visualization."
];

// Units for the metrics to make them more believable
export const metricUnits = {
  // DevOps metric units
  "percentage": "%",
  "milliseconds": "ms",
  "count": "count",
  "ratio": "ratio",
  "seconds": "s",
  "frequency": "Hz",
  "bytes": "MB",
  "requests": "req/s",
  "errors": "errors/min",
  "score": "score"
};

// Function to get a random unit for a metric
export function getRandomUnit() {
  const units = Object.values(metricUnits);
  return units[Math.floor(Math.random() * units.length)];
}

// Function to get random metrics pair
export function getRandomMetricsPair() {
  const devopsMetric = devopsMetrics[Math.floor(Math.random() * devopsMetrics.length)];
  const absurdMetric = absurdMetrics[Math.floor(Math.random() * absurdMetrics.length)];
  
  return {
    metricA: devopsMetric,
    metricB: absurdMetric,
    unitA: getRandomUnit(),
    unitB: getRandomUnit()
  };
}

// Function to get a random sarcastic caption
export function getRandomCaption() {
  return sarcasticCaptions[Math.floor(Math.random() * sarcasticCaptions.length)];
} 