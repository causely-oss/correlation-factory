# Causeless Chaos 🔄

A humorous web app that generates fake but visually convincing correlations between absurd pairs of metrics from the world of DevOps, SRE, and software observability.

Inspired by [Tyler Vigen's Spurious Correlations](https://tylervigen.com/), this app demonstrates how easy it is to create misleading statistical relationships between completely unrelated metrics.

## Features

- 🎯 **Random Metric Pairing**: Combines professional DevOps/SRE metrics with absurd office-related measurements
- 📊 **Dual-Axis Charts**: Beautiful, interactive line charts using Recharts library
- 📈 **Fake Correlation Statistics**: Generates convincing R² values and statistical significance markers
- 😂 **Sarcastic Commentary**: Random humorous captions that highlight the absurdity
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Modern UI**: Clean, gradient-based design with smooth animations

## Example Correlations

- "Kubernetes pod restart frequency" vs "Engineers wearing Crocs to work"
- "Redis cache hit rate" vs "Rubber duck debugging sessions"
- "API response time (95th percentile)" vs "Avocado toast consumption rate"

## How It Works

1. Click "Show Me the Causeless Chaos"
2. The app randomly selects one metric from each list:
   - **DevOps Metrics**: Professional-sounding infrastructure and monitoring metrics
   - **Absurd Metrics**: Silly office and lifestyle measurements
3. Generates artificially correlated time series data over 10 recent dates
4. Displays the data in a dual-axis line chart with:
   - Left Y-axis: DevOps metric
   - Right Y-axis: Absurd metric
   - X-axis: Recent dates
5. Shows a fake correlation coefficient (R²) and statistical significance
6. Displays a random sarcastic caption

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
- **date-fns**: Date manipulation utilities
- **CSS3**: Custom styling with gradients and animations

## Project Structure

```
src/
├── components/
│   └── CorrelationChart.jsx    # Dual-axis line chart component
├── data/
│   └── metrics.js              # Lists of metrics and captions
├── utils/
│   └── correlationUtils.js     # Data generation and correlation logic
├── App.jsx                     # Main application component
├── main.jsx                    # React entry point
└── index.css                   # Global styles
```

## Customization

### Adding New Metrics

Edit `src/data/metrics.js` to add new metrics to either the `devopsMetrics` or `absurdMetrics` arrays.

### Adding New Captions

Add new sarcastic captions to the `sarcasticCaptions` array in `src/data/metrics.js`.

### Styling

Modify `src/index.css` to customize the appearance, colors, and layout.

## Contributing

This is a fun project! Feel free to:
- Add more ridiculous metric combinations
- Improve the chart visualizations
- Add new sarcastic captions
- Enhance the statistical "credibility" of the fake data

## Disclaimer

⚠️ **Important**: This app is for entertainment and educational purposes only. The correlations generated are completely fake and should not be used for any actual analysis or decision-making. The purpose is to demonstrate how misleading statistical relationships can be created between unrelated data points.

## License

MIT License - feel free to use this for educational purposes, presentations, or just for fun!

---

*"Remember: 73% of statistics are made up on the spot."* - This app, probably 