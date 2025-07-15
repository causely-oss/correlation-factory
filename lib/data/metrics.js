// Categorized metrics with appropriate units
export const devopsMetricsWithUnits = [
  {
    metric: "Kubernetes pod restart frequency",
    units: ["per hour", "per day", "restarts"],
  },
  { metric: "Redis cache hit rate", units: ["%", "hits/requests"] },
  {
    metric: "Database connection pool utilization",
    units: ["%", "connections/pool"],
  },
  { metric: "API response time (95th percentile)", units: ["ms", "s"] },
  { metric: "Docker image build duration", units: ["minutes", "seconds", "s"] },
  {
    metric: "Prometheus alert firing rate",
    units: ["per hour", "per day", "alerts"],
  },
  { metric: "Git commit frequency", units: ["per day", "per hour", "commits"] },
  { metric: "CI/CD pipeline success rate", units: ["%", "successful/total"] },
  {
    metric: "Memory leak detection events",
    units: ["events", "per day", "detections"],
  },
  {
    metric: "Load balancer request distribution",
    units: ["req/s", "requests/min", "%"],
  },
  { metric: "Service mesh latency", units: ["ms", "μs", "s"] },
  {
    metric: "Elasticsearch cluster health score",
    units: ["score", "points", "%"],
  },
  {
    metric: "CDN cache invalidation frequency",
    units: ["per hour", "per day", "invalidations"],
  },
  {
    metric: "Microservice dependency graph complexity",
    units: ["score", "points", "connections"],
  },
  {
    metric: "Container resource limit breaches",
    units: ["breaches", "per day", "events"],
  },
  {
    metric: "Database query optimization ratio",
    units: ["%", "optimized/total"],
  },
  {
    metric: "SSL certificate expiration warnings",
    units: ["warnings", "per day", "alerts"],
  },
  {
    metric: "Backup verification success rate",
    units: ["%", "successful/total"],
  },
  { metric: "Log aggregation processing delay", units: ["ms", "s", "minutes"] },
  {
    metric: "Auto-scaling trigger frequency",
    units: ["per hour", "per day", "triggers"],
  },
  { metric: "Network packet loss percentage", units: ["%", "lost/total"] },
  {
    metric: "Service discovery health checks",
    units: ["per minute", "per hour", "checks"],
  },
  {
    metric: "Database index fragmentation level",
    units: ["%", "fragmented/total"],
  },
  {
    metric: "API gateway throttling incidents",
    units: ["incidents", "per day", "events"],
  },
  {
    metric: "Container orchestration overhead",
    units: ["%", "ms", "overhead/total"],
  },
  {
    metric: "Distributed tracing span count",
    units: ["spans", "per request", "per trace"],
  },
  {
    metric: "Message queue processing throughput",
    units: ["msg/s", "messages/min", "per hour"],
  },
  {
    metric: "Infrastructure provisioning time",
    units: ["minutes", "seconds", "s"],
  },
  {
    metric: "Security vulnerability scan results",
    units: ["vulnerabilities", "per day", "findings"],
  },
  { metric: "Database replication lag", units: ["ms", "s", "minutes"] },
  {
    metric: "Load testing failure scenarios",
    units: ["scenarios", "per test", "failures"],
  },
  {
    metric: "Chaos engineering blast radius",
    units: ["services", "components", "affected"],
  },
  {
    metric: "Observability dashboard refresh rate",
    units: ["per minute", "Hz", "updates/s"],
  },
  {
    metric: "Resource utilization anomaly detection",
    units: ["anomalies", "per hour", "detections"],
  },
  {
    metric: "Service level indicator violations",
    units: ["violations", "per day", "breaches"],
  },
];

export const absurdMetricsWithUnits = [
  {
    metric: "Engineers wearing Crocs to work",
    units: ["people", "engineers", "individuals"],
  },
  {
    metric: "Coffee shop visits per developer",
    units: ["visits/day", "per week", "visits"],
  },
  {
    metric: "Rubber duck debugging sessions",
    units: ["sessions", "per day", "interactions"],
  },
  {
    metric: "Number of houseplants in the office",
    units: ["plants", "items", "specimens"],
  },
  {
    metric: "Slack emoji reactions per day",
    units: ["reactions", "per hour", "emojis"],
  },
  {
    metric: "Standing desk usage duration",
    units: ["hours", "minutes", "per day"],
  },
  {
    metric: "Mechanical keyboard click frequency",
    units: ["clicks/min", "per hour", "keystrokes"],
  },
  {
    metric: "Open browser tabs per engineer",
    units: ["tabs", "per person", "windows"],
  },
  {
    metric: "Hoodie-wearing developers count",
    units: ["people", "developers", "individuals"],
  },
  {
    metric: "Ping pong tournament participation",
    units: ["participants", "people", "players"],
  },
  {
    metric: "Spotify playlist shuffles during work",
    units: ["shuffles", "per day", "changes"],
  },
  {
    metric: "Energy drink consumption volume",
    units: ["cans", "liters", "ml"],
  },
  {
    metric: "Nerf gun office battles",
    units: ["battles", "per week", "skirmishes"],
  },
  {
    metric: "Sourdough starter maintenance logs",
    units: ["entries", "per day", "updates"],
  },
  {
    metric: "Cat videos watched during builds",
    units: ["videos", "per build", "views"],
  },
  {
    metric: "Meditation app session completions",
    units: ["sessions", "per day", "completions"],
  },
  {
    metric: "Avocado toast consumption rate",
    units: ["slices", "per day", "servings"],
  },
  {
    metric: "Fidget spinner usage frequency",
    units: ["spins/min", "per hour", "uses"],
  },
  {
    metric: "Beanbag chair occupancy time",
    units: ["hours", "minutes", "per day"],
  },
  {
    metric: "Succulent plant watering reminders",
    units: ["reminders", "per week", "notifications"],
  },
  {
    metric: "Developers with beard grooming kits",
    units: ["people", "developers", "individuals"],
  },
  {
    metric: "Artisanal coffee brewing attempts",
    units: ["attempts", "per day", "brews"],
  },
  {
    metric: "Yoga mat storage violations",
    units: ["violations", "per week", "infractions"],
  },
  {
    metric: "Noise-canceling headphone battery life",
    units: ["hours", "minutes", "per charge"],
  },
  {
    metric: "Ergonomic mouse pad replacements",
    units: ["replacements", "per month", "swaps"],
  },
  {
    metric: "Blue light blocking glasses adoption",
    units: ["people", "developers", "%"],
  },
  {
    metric: "Kombucha fermentation experiments",
    units: ["experiments", "per month", "batches"],
  },
  {
    metric: "Desk lamp brightness adjustments",
    units: ["adjustments", "per day", "changes"],
  },
  {
    metric: "Pomodoro timer completion rate",
    units: ["%", "completed/started", "per day"],
  },
  {
    metric: "Whiteboard marker ink depletion",
    units: ["markers", "per week", "depleted"],
  },
  {
    metric: "Stress ball squeeze frequency",
    units: ["squeezes/min", "per hour", "uses"],
  },
  {
    metric: "Foam roller usage in break rooms",
    units: ["sessions", "per day", "uses"],
  },
  {
    metric: "Cryptocurrency price check count",
    units: ["checks", "per day", "lookups"],
  },
  {
    metric: "Meme sharing velocity",
    units: ["memes/hour", "per day", "shares"],
  },
  {
    metric: "Procrastination via social media",
    units: ["minutes", "per day", "hours"],
  },
  {
    metric: "Snack cupboard raiding incidents",
    units: ["incidents", "per day", "raids"],
  },
  {
    metric: "Ambient office temperature complaints",
    units: ["complaints", "per day", "reports"],
  },
  {
    metric: "Bluetooth speaker pairing failures",
    units: ["failures", "per day", "attempts"],
  },
  {
    metric: "Shoe untying incidents per day",
    units: ["incidents", "mishaps", "occurrences"],
  },
  {
    metric: "Developers eating lunch at their desk",
    units: ["people", "developers", "individuals"],
  },
];

// Keep the old arrays for backwards compatibility (if needed elsewhere)
export const devopsMetrics = devopsMetricsWithUnits.map((item) => item.metric);
export const absurdMetrics = absurdMetricsWithUnits.map((item) => item.metric);

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
  "Brought to you by the Committee for Misleading Data Visualization.",
];
