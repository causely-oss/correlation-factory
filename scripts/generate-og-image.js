const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function generateOGImage() {
  try {
    const svgPath = path.join(__dirname, "../public/favicon.svg");
    const outputPath = path.join(__dirname, "../public/og-image.png");

    // Read the SVG file
    const svgBuffer = fs.readFileSync(svgPath);

    // Create a larger version for Open Graph (1200x630 is the recommended size)
    await sharp(svgBuffer)
      .resize(1200, 630, {
        fit: "contain",
        background: { r: 67, g: 56, b: 166, alpha: 1 }, // #4338A6 background
      })
      .png()
      .toFile(outputPath);

    console.log("✅ Generated og-image.png successfully (1200x630)");
  } catch (error) {
    console.error("❌ Error generating og-image.png:", error);
  }
}

generateOGImage();
