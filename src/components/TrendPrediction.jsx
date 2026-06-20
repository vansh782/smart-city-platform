import { useState, useEffect } from "react";
import API from "../services/api";
import { FaChartLine, FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa";

function TrendPrediction() {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await API.get("/analytics/predict/all");
        setPredictions(res.data.predictions);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPredictions();
    const interval = setInterval(fetchPredictions, 30000);
    return () => clearInterval(interval);
  }, []);

  const trendIcon = (direction) =>
    direction === "rising"  ? <FaArrowUp className="text-red-400" /> :
    direction === "falling" ? <FaArrowDown className="text-green-400" /> :
    <FaMinus className="text-slate-400" />;

  if (loading) {
    return (
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700">
        <p className="text-slate-400">Loading trend predictions...</p>
      </div>
    );
  }

  const types = ["traffic", "air_quality", "energy", "water", "waste"];

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <FaChartLine className="text-cyan-400 text-xl" />
        <h2 className="text-lg font-semibold text-white">Trend Predictions</h2>
        <span className="text-xs text-slate-500 ml-auto">Linear regression forecast</span>
      </div>

      <div className="space-y-3">
        {types.map((type) => {
          const pred = predictions?.[type];
          if (!pred?.hasEnoughData) {
            return (
              <div key={type} className="flex items-center justify-between text-sm py-2 border-b border-slate-800">
                <span className="text-slate-400 capitalize">{type.replace("_", " ")}</span>
                <span className="text-slate-500 text-xs">Gathering data...</span>
              </div>
            );
          }

          return (
            <div key={type} className="flex items-center justify-between text-sm py-2 border-b border-slate-800">
              <span className="text-slate-300 capitalize">{type.replace("_", " ")}</span>
              <div className="flex items-center gap-3">
                <span className="text-slate-500 text-xs">
                  now: {pred.currentValue}
                </span>
                <div className="flex items-center gap-1">
                  {trendIcon(pred.trendDirection)}
                  <span className="text-white font-semibold">
                    → {pred.predictedValue}
                  </span>
                </div>
                <span className={`text-xs capitalize px-2 py-1 rounded-full ${
                  pred.trendDirection === "rising"  ? "bg-red-500/20 text-red-400" :
                  pred.trendDirection === "falling" ? "bg-green-500/20 text-green-400" :
                  "bg-slate-700 text-slate-400"
                }`}>
                  {pred.trendDirection}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TrendPrediction;