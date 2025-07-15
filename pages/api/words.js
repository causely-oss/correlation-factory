import { SeededRandom, hashString } from "../../lib/utils/seededRandom.js";
import { adjectivesAM } from "../../lib/data/adjectives-a-m.js";
import { adjectivesNZ } from "../../lib/data/adjectives-n-z.js";
import { nouns } from "../../lib/data/nouns-a-z.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Generate a random seed for this request
    const seed = Date.now() + Math.random();
    const rng = new SeededRandom(hashString(seed.toString()));

    // Get random adjective from A-M (for metricA)
    const adjectiveAM = adjectivesAM[rng.nextInt(0, adjectivesAM.length - 1)];

    // Get random adjective from N-Z (for metricB)
    const adjectiveNZ = adjectivesNZ[rng.nextInt(0, adjectivesNZ.length - 1)];

    // Get random noun from A-Z (for correlationId)
    const noun = nouns[rng.nextInt(0, nouns.length - 1)];

    // Return the three words
    res.status(200).json({
      adjectiveAM,
      adjectiveNZ,
      noun,
      seed: seed.toString(),
    });
  } catch (error) {
    console.error("Error generating words:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
