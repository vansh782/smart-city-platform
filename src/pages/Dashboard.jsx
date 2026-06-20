import { useEffect } from "react";
import { toast } from "react-toastify";
import TrendPrediction from "../components/TrendPrediction";
import Navbar from "../components/Navbar";
import TrafficChart from "../components/TrafficChart";
import HealthScore from "../components/HealthScore";
import CityMap from "../components/CityMap";
import ActivityFeed from "../components/ActivityFeed";
import CityAI from "../components/CityAI";
import { useSensorData, useAlerts, useRecommendations } from "../hooks/useSensorData";
import {
  FaTrafficLight, FaTrash, FaBolt, FaCloud, FaWater,
} from "react-icons/fa";

function StatCard({ title, value, icon, status }) {
  const statusColor =
    status === "critical" ? "border-red-500" :
    status === "warning"  ? "border-yellow-500" :
    "border-slate-700";

  return (
    <div className={`bg-slate-900 rounded-2xl p-5 border ${statusColor}`}>
      <div className="text-cyan-400 text-2xl mb-2">{icon}</div>
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-white text-3xl font-bold mt-1">{value ?? "—"}</p>
    </div>
  );
}

function AlertCard({ alert, onResolve }) {
  const color =
    alert.severity === "critical" ? "border-red-500 bg-red-500/10" :
    alert.severity === "warning"  ? "border-yellow-500 bg-yellow-500/10" :
    "border-blue-500 bg-blue-500/10";

  return (
    <div className={`border rounded-xl p-4 flex justify-between items-start ${color}`}>
      <div>
        <p className="text-white font-semibold capitalize">
          {alert.type.replace("_", " ")} — {alert.severity.toUpperCase()}
        </p>
        <p className="text-slate-300 text-sm mt-1">{alert.message}</p>
        <p className="text-slate-500 text-xs mt-1">{alert.location?.zone}</p>
      </div>
      <button
        onClick={() => onResolve(alert._id)}
        className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded-lg ml-4 shrink-0"
      >
        Resolve
      </button>
    </div>
  );
}

function RecommendationCard({ rec }) {
  const color =
    rec.priority === "critical" ? "border-red-500" :
    rec.priority === "warning"  ? "border-yellow-500" :
    "border-slate-700";

  return (
    <div className={`border rounded-xl p-4 bg-slate-900 ${color}`}>
      <p className="text-white font-semibold capitalize">
        {rec.type.replace("_", " ")}
      </p>
      <p className="text-slate-300 text-sm mt-1">{rec.message}</p>
      <p className="text-cyan-400 text-sm mt-2">→ {rec.action}</p>
    </div>
  );
}

function Dashboard() {
  const { latest, loading: sensorLoading } = useSensorData();
  const { alerts, loading: alertLoading, resolveAlert } = useAlerts();
  const { recommendations } = useRecommendations();

  useEffect(() => {
    if (alerts.length > 0) {
      const critical = alerts.find((a) => a.severity === "critical");
      if (critical) {
        setTimeout(() => {
          toast.error(`🚨 Critical: ${critical.message}`);
        }, 2000);
      }
    }
  }, [alerts]);

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <Navbar />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-8">
        <StatCard
          title="Traffic"
          value={latest?.traffic ? `${latest.traffic.value} ${latest.traffic.unit}` : "—"}
          icon={<FaTrafficLight />}
          status={latest?.traffic?.status}
        />
        <StatCard
          title="Air Quality (AQI)"
          value={latest?.air_quality?.value ?? "—"}
          icon={<FaCloud />}
          status={latest?.air_quality?.status}
        />
        <StatCard
          title="Energy"
          value={latest?.energy ? `${latest.energy.value} kWh` : "—"}
          icon={<FaBolt />}
          status={latest?.energy?.status}
        />
        <StatCard
          title="Water"
          value={latest?.water ? `${latest.water.value} L/hr` : "—"}
          icon={<FaWater />}
          status={latest?.water?.status}
        />
        <StatCard
          title="Waste"
          value={latest?.waste ? `${latest.waste.value}%` : "—"}
          icon={<FaTrash />}
          status={latest?.waste?.status}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        <div className="xl:col-span-2"><TrafficChart /></div>
        <HealthScore />
      </div>

      {/* Active Alerts */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Active Alerts
          {alerts.length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {alerts.length}
            </span>
          )}
        </h2>
        {alertLoading ? (
          <p className="text-slate-400">Loading alerts...</p>
        ) : alerts.length === 0 ? (
          <p className="text-green-400">No active alerts. All systems normal.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map((alert) => (
              <AlertCard key={alert._id} alert={alert} onResolve={resolveAlert} />
            ))}
          </div>
        )}
      </div>

{/* Trend Predictions */}
<div className="mt-8">
  <TrendPrediction />
</div>

      {/* AI Recommendations */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4">
          AI Recommendations
        </h2>
        {recommendations.length === 0 ? (
          <p className="text-green-400">All city systems operating normally.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, i) => (
              <RecommendationCard key={i} rec={rec} />
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="mt-8"><CityMap /></div>

      <div className="mt-8"><ActivityFeed /></div>
      <CityAI />
    </div>
  );
}

export default Dashboard;