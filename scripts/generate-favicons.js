const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function generateFavicons() {
  try {
    const svgPath = path.join(__dirname, "../public/favicon.svg");
    const publicPath = path.join(__dirname, "../public");

    // Read the SVG file
    const svgBuffer = fs.readFileSync(svgPath);

    // Define favicon sizes and names
    const favicons = [
      { name: "apple-touch-icon.png", size: 180 },
      { name: "favicon-32x32.png", size: 32 },
      { name: "favicon-16x16.png", size: 16 },
    ];

    // Generate each favicon
    for (const favicon of favicons) {
      const outputPath = path.join(publicPath, favicon.name);

      await sharp(svgBuffer)
        .resize(favicon.size, favicon.size)
        .png()
        .toFile(outputPath);

      console.log(
        `✅ Generated ${favicon.name} (${favicon.size}x${favicon.size})`,
      );
    }

    console.log("🎉 All favicons generated successfully!");
  } catch (error) {
    console.error("❌ Error generating favicons:", error);
  }
}

generateFavicons();
