# Causeless Chaos 🔄

A humorous web app that generates fake but visually convincing correlations between absurd pairs of metrics from the world of DevOps, SRE, and software observability.

Inspired by [Tyler Vigen's Spurious Correlations](https://tylervigen.com/), this app demonstrates how easy it is to create misleading statistical relationships between completely unrelated metrics.

## Features

- 🎯 **API-Driven Architecture**: Separate API calls for each metric with seeded randomness
- 📊 **Dual-Axis Charts**: Beautiful, interactive line charts using Recharts library
- 📈 **Reproducible Correlations**: Seeded random generation for consistent results
- 😂 **Sarcastic Commentary**: Random humorous captions that highlight the absurdity
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Modern UI**: Clean, gradient-based design with smooth animations

## API Architecture

The app uses a unique API design where:

- **MetricA** and **MetricB** are generated from separate API calls with different seeds
- Both metrics share the same **correlation parameters** to ensure they correlate
- Each metric is independently deterministic based on its seed
- The correlation is driven by shared parameters, not the individual seeds

### API Endpoints

#### Get Metric

```
GET /api/metric/[seed]/[correlationId]
```

Returns a single metric (DevOps or absurd) based on the seed, correlated via correlationId.

**Example Response:**

```json
{
  "metric": "Kubernetes pod restart frequency",
  "metricType": "devops",
  "unit": "Hz",
  "seed": "seed_a_123",
  "correlationId": "correlation_456",
  "isMetricA": true
}
```

#### Get Correlation Data

```
GET /api/correlation/[correlationId]
```

Returns time series data points that are correlated based on the correlationId.

**Example Response:**

```json
{
  "data": [
    { "date": "Dec 15", "metricA": 45.67, "metricB": 123.45 },
    { "date": "Dec 16", "metricA": 48.23, "metricB": 127.89 }
  ],
  "rSquared": 0.834,
  "correlationId": "correlation_456"
}
```

#### Get Caption

```
GET /api/caption/[correlationId]
```

Returns a sarcastic caption based on the correlationId.

**Example Response:**

```json
{
  "caption": "Everything graphs together if you squint hard enough.",
  "correlationId": "correlation_456"
}
```

## Example Correlations

- "Kubernetes pod restart frequency" vs "Engineers wearing Crocs to work"
- "Redis cache hit rate" vs "Rubber duck debugging sessions"
- "API response time (95th percentile)" vs "Avocado toast consumption rate"

## How It Works

1. Click "Show Me the Causeless Chaos"
2. The app generates:
   - A unique **correlationId** for shared correlation parameters
   - Two different **seeds** for the individual metrics
3. Makes 4 parallel API calls:
   - `/api/metric/[seed1]/[correlationId]` - Gets first metric
   - `/api/metric/[seed2]/[correlationId]` - Gets second metric
   - `/api/correlation/[correlationId]` - Gets correlated time series data
   - `/api/caption/[correlationId]` - Gets sarcastic caption
4. Displays the data in a dual-axis line chart with:
   - Left Y-axis: DevOps metric
   - Right Y-axis: Absurd metric
   - X-axis: Recent dates
5. Shows a fake correlation coefficient (R²) and statistical significance
6. Displays the sarcastic caption

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd causeless-chaos
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technologies Used

- **React 18**: Modern React with hooks
- **Recharts**: Beautiful, responsive charts
- **Vite**: Fast development build tool
- **Vercel Functions**: Serverless API endpoints
- **Seeded Random**: Deterministic random number generation
- **CSS3**: Custom styling with gradients and animations

## Project Structure

```
├── api/
│   ├── utils/
│   │   └── seededRandom.js        # Seeded random number generator
│   ├── data/
│   │   └── metrics.js             # Metrics and captions data
│   ├── metric/
│   │   └── [seed]/
│   │       └── [correlationId].js # Individual metric endpoint
│   ├── correlation/
│   │   └── [correlationId].js     # Correlation data endpoint
│   └── caption/
│       └── [correlationId].js     # Caption endpoint
├── src/
│   ├── components/
│   │   └── CorrelationChart.jsx   # Dual-axis line chart component
│   ├── App.jsx                    # Main application component
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Seeded Random Architecture

The app uses a sophisticated seeded random system:

1. **Individual Seeds**: Each metric gets its own seed for independent randomness
2. **Correlation Parameters**: Shared parameters ensure metrics correlate properly
3. **Deterministic Results**: Same seeds always produce the same results
4. **Mutual Exclusivity**: Different seeds ensure different metrics are selected

### How Correlation Works

```javascript
// Each API call uses the same correlationId but different seeds
/api/metric/seed_a_123/correlation_456  // Returns DevOps metric
/api/metric/seed_b_789/correlation_456  // Returns absurd metric
/api/correlation/correlation_456        // Returns correlated data for both
```

The `correlationId` generates shared parameters like:

- Correlation strength (0.7-0.95)
- Base values and ranges for both metrics
- Trend direction
- R² value

## Deployment

This app is designed to run on Vercel with:

- **Static frontend**: React SPA
- **Serverless functions**: API endpoints in `/api` directory
- **Automatic deployment**: Push to deploy

## Customization

### Adding New Metrics

Edit `api/data/metrics.js` to add new metrics to either the `devopsMetrics` or `absurdMetrics` arrays.

### Adding New Captions

Add new sarcastic captions to the `sarcasticCaptions` array in `api/data/metrics.js`.

### Styling

Modify `src/index.css` to customize the appearance, colors, and layout.

## Contributing

This is a fun project! Feel free to:

- Add more ridiculous metric combinations
- Improve the seeded random algorithms
- Add new API endpoints
- Enhance the statistical "credibility" of the fake data

## Disclaimer

⚠️ **Important**: This app is for entertainment and educational purposes only. The correlations generated are completely fake and should not be used for any actual analysis or decision-making. The purpose is to demonstrate how misleading statistical relationships can be created between unrelated data points.

## License

MIT License - feel free to use this for educational purposes, presentations, or just for fun!

---

_"Remember: 73% of statistics are made up on the spot."_ - This app, probably
