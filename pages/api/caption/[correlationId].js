import { generateCorrelationParams } from "../../../lib/utils/seededRandom.js";
import { sarcasticCaptions } from "../../../lib/data/metrics.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { correlationId } = req.query;

  if (!correlationId) {
    return res.status(400).json({
      error: "correlationId is required",
    });
  }

  try {
    // Generate correlation parameters from correlationId
    const correlationParams = generateCorrelationParams(correlationId);

    // Use caption index from correlation parameters to select caption
    const captionIndex =
      correlationParams.captionIndex % sarcasticCaptions.length;
    const caption = sarcasticCaptions[captionIndex];

    // Return the caption
    res.status(200).json({
      caption,
      correlationId,
      captionIndex,
    });
  } catch (error) {
    console.error("Error generating caption:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
