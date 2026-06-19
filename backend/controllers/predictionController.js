const { predictTrend } = require("../services/prediction.service");

const getPrediction = async (req, res) => {
  try {
    const { type = "traffic" } = req.query;
    const result = await predictTrend(type);

    if (!result.hasEnoughData) {
      return res.status(200).json({
        type,
        hasEnoughData: false,
        message: "Not enough data yet to predict trend. Wait a few minutes for more readings.",
      });
    }

    res.status(200).json({ type, ...result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllPredictions = async (req, res) => {
  try {
    const types = ["traffic", "air_quality", "energy", "water", "waste"];
    const results = await Promise.all(types.map((t) => predictTrend(t)));

    const predictions = {};
    types.forEach((t, i) => {
      predictions[t] = results[i];
    });

    res.status(200).json({ predictions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getPrediction, getAllPredictions };