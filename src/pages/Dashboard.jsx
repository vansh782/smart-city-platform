import { useEffect } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import TrendPrediction from "../components/TrendPrediction";
import Navbar from "../components/Navbar";
import TrafficChart from "../components/TrafficChart";
import HealthScore from "../components/HealthScore";
import CityMap from "../components/CityMap";
import ActivityFeed from "../components/ActivityFeed";
import CityAI from "../components/CityAI";
import AnimatedNumber from "../components/AnimatedNumber";
import { useSensorData, useAlerts, useRecommendations } from "../hooks/useSensorData";
import {
  FaTrafficLight, FaTrash, FaBolt, FaCloud, FaWater,
} from "react-icons/fa";

function StatCard({ title, numericValue, unit, icon, status, index }) {
  const statusColor =
    status === "critical" ? "border-red-500" :
    status === "warning"  ? "border-yellow-500" :
    "border-slate-700";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      className={`bg-slate-900 rounded-2xl p-5 border ${statusColor} cursor-default glow-card ${
  status === "critical" ? "glow-critical" : status === "warning" ? "glow-warning" : ""
}`}
    >
      <motion.div
        className="text-cyan-400 text-2xl mb-2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.08 + 0.2, type: "spring", stiffness: 200 }}
      >
        {icon}
      </motion.div>
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-white text-3xl font-bold mt-1">
        {numericValue !== undefined && numericValue !== null ? (
          <>
            <AnimatedNumber value={numericValue} /> {unit}
          </>
        ) : (
          "—"
        )}
      </p>
    </motion.div>
  );
}

function AlertCard({ alert, onResolve, index }) {
  const color =
    alert.severity === "critical" ? "border-red-500 bg-red-500/10" :
    alert.severity === "warning"  ? "border-yellow-500 bg-yellow-500/10" :
    "border-blue-500 bg-blue-500/10";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: 50 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`border rounded-xl p-4 flex justify-between items-start ${color} ${
        alert.severity === "critical" ? "animate-pulse-slow" : ""
      }`}
    >
      <div>
        <p className="text-white font-semibold capitalize">
          {alert.type.replace("_", " ")} — {alert.severity.toUpperCase()}
        </p>
        <p className="text-slate-300 text-sm mt-1">{alert.message}</p>
        <p className="text-slate-500 text-xs mt-1">{alert.location?.zone}</p>
      </div>
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => onResolve(alert._id)}
        className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded-lg ml-4 shrink-0"
      >
        Resolve
      </motion.button>
    </motion.div>
  );
}

function RecommendationCard({ rec, index }) {
  const color =
    rec.priority === "critical" ? "border-red-500" :
    rec.priority === "warning"  ? "border-yellow-500" :
    "border-slate-700";

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      whileHover={{ scale: 1.015 }}
      className={`border rounded-xl p-4 bg-slate-900 ${color}`}
    >
      <p className="text-white font-semibold capitalize">
        {rec.type.replace("_", " ")}
      </p>
      <p className="text-slate-300 text-sm mt-1">{rec.message}</p>
      <p className="text-cyan-400 text-sm mt-2">→ {rec.action}</p>
    </motion.div>
  );
}

function SectionHeading({ children }) {
  return (
    <motion.h2
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="text-xl font-bold text-white mb-4 flex items-center"
    >
      {children}
    </motion.h2>
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
          index={0}
          title="Traffic"
          numericValue={latest?.traffic?.value}
          unit={latest?.traffic?.unit ?? ""}
          icon={<FaTrafficLight />}
          status={latest?.traffic?.status}
        />
        <StatCard
          index={1}
          title="Air Quality (AQI)"
          numericValue={latest?.air_quality?.value}
          unit=""
          icon={<FaCloud />}
          status={latest?.air_quality?.status}
        />
        <StatCard
          index={2}
          title="Energy"
          numericValue={latest?.energy?.value}
          unit="kWh"
          icon={<FaBolt />}
          status={latest?.energy?.status}
        />
        <StatCard
          index={3}
          title="Water"
          numericValue={latest?.water?.value}
          unit="L/hr"
          icon={<FaWater />}
          status={latest?.water?.status}
        />
        <StatCard
          index={4}
          title="Waste"
          numericValue={latest?.waste?.value}
          unit="%"
          icon={<FaTrash />}
          status={latest?.waste?.status}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2"
        >
          <TrafficChart />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <HealthScore />
        </motion.div>
      </div>

      {/* Active Alerts */}
      <div className="mt-8">
        <SectionHeading>
          Active Alerts
          {alerts.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
            >
              {alerts.length}
            </motion.span>
          )}
        </SectionHeading>
        {alertLoading ? (
          <p className="text-slate-400">Loading alerts...</p>
        ) : alerts.length === 0 ? (
          <p className="text-green-400">No active alerts. All systems normal.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {alerts.map((alert, i) => (
                <AlertCard key={alert._id} alert={alert} onResolve={resolveAlert} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Trend Predictions */}
      <div className="mt-8">
        <TrendPrediction />
      </div>

      {/* AI Recommendations */}
      <div className="mt-8">
        <SectionHeading>AI Recommendations</SectionHeading>
        {recommendations.length === 0 ? (
          <p className="text-green-400">All city systems operating normally.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, i) => (
              <RecommendationCard key={i} rec={rec} index={i} />
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