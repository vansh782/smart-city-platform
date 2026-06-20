import { useState, useEffect } from "react";
import API from "../services/api";

function HealthScore() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await API.get("/analytics/health-score");
        setData(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
    const interval = setInterval(fetchScore, 30000);
    return () => clearInterval(interval);
  }, []);

  const ringColor =
    !data ? "#475569" :
    data.score >= 80 ? "#22c55e" :
    data.score >= 60 ? "#eab308" :
    data.score >= 40 ? "#f97316" :
    "#ef4444";

  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700 flex flex-col items-center justify-center h-full">
      <h2 className="text-lg font-semibold text-white mb-6">City Health Score</h2>
      {loading ? (
        <p className="text-slate-400">Calculating...</p>
      ) : (
        <>
          <div
            className="w-40 h-40 rounded-full flex items-center justify-center"
            style={{ border: `6px solid ${ringColor}` }}
          >
            <span className="text-5xl font-bold text-white">{data.score}</span>
          </div>
          <p className="mt-4 font-semibold" style={{ color: ringColor }}>
            {data.label}
          </p>
          <p className="text-slate-500 text-xs mt-2">
            {data.activeAlertCount} active alert{data.activeAlertCount !== 1 ? "s" : ""}
            {data.criticalCount > 0 && ` · ${data.criticalCount} critical`}
          </p>
        </>
      )}
    </div>
  );
}

export default HealthScore;