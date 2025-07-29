# Contributing to Correlation Factory

Thank you for your interest in contributing to Correlation Factory! This project is designed to be fun and educational, demonstrating the dangers of spurious correlations in data science.

## How to Contribute

### Types of Contributions We Welcome

1. **New Metrics**: Add more absurd DevOps metrics to make the correlations even more entertaining
2. **UI/UX Improvements**: Enhance the user interface and user experience
3. **Correlation Algorithms**: Improve the fake correlation generation algorithms
4. **Humorous Captions**: Add more sarcastic and funny captions
5. **Documentation**: Improve README, API docs, or add new documentation
6. **Bug Fixes**: Report and fix any issues you find
7. **Performance**: Optimize the application for better performance

### Getting Started

1. **Fork the repository**

   ```bash
   git clone https://github.com/causely-oss/correlation-factory
   cd correlation-factory
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Adding New Metrics

To add new metrics, edit the `lib/data/metrics.js` file:

```javascript
// Add to devopsMetrics array for legitimate DevOps metrics
const devopsMetrics = [
  // ... existing metrics
  {
    metric: "Your new DevOps metric",
    unit: "units",
    minValue: 0,
    maxValue: 100,
  },
];

// Add to absurdMetrics array for funny/absurd metrics
const absurdMetrics = [
  // ... existing metrics
  {
    metric: "Your new absurd metric",
    unit: "units",
    minValue: 0,
    maxValue: 100,
  },
];
```

### Adding New Captions

Add new sarcastic captions to the `sarcasticCaptions` array in `lib/data/metrics.js`:

```javascript
const sarcasticCaptions = [
  // ... existing captions
  "Your new sarcastic caption here",
];
```

### Code Style Guidelines

- Use consistent formatting (the project uses ESLint)
- Write clear, descriptive commit messages
- Keep functions small and focused
- Add comments for complex logic
- Follow the existing code structure

### Testing Your Changes

1. **Run the development server** and test your changes manually
2. **Check the build** to ensure everything compiles correctly:

   ```bash
   npm run build
   ```

3. **Test the API endpoints** if you've modified them

### Submitting Your Contribution

1. **Commit your changes** with a clear, descriptive message:

   ```bash
   git commit -m "Add new DevOps metric: Kubernetes pod restart frequency"
   ```

2. **Push to your fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request** on GitHub with:
   - A clear title describing your changes
   - A detailed description of what you've added/changed
   - Any relevant screenshots or examples

### Pull Request Guidelines

- **Title**: Use a clear, descriptive title (e.g., "Add new absurd metric: Rubber duck debugging sessions")
- **Description**: Explain what you've changed and why
- **Testing**: Mention how you tested your changes
- **Screenshots**: Include screenshots for UI changes

### Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Remember this is a fun, educational project
- Keep contributions appropriate for all audiences

### Questions or Need Help?

- Open an issue on GitHub for bugs or feature requests
- Join discussions in existing issues
- Reach out to the maintainers if you need clarification

## License

By contributing to Correlation Factory, you agree that your contributions will be licensed under the Apache License 2.0.

---

Thank you for contributing to making Correlation Factory more entertaining and educational! 🎉
