import { useState, useEffect } from "react";
import API from "../services/api";
import { FaBell } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");

  const fetchAlerts = async () => {
    try {
      const res = await API.get(`/alerts?status=${filter}&limit=50`);
      setAlerts(res.data.alerts);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [filter]);

  const resolveAlert = async (id) => {
    try {
      await API.patch(`/alerts/${id}/resolve`);
      setAlerts((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const severityColor = (severity) =>
    severity === "critical" ? "border-red-500 bg-red-500/10" :
    severity === "warning"  ? "border-yellow-500 bg-yellow-500/10" :
    "border-blue-500 bg-blue-500/10";

  const priorityColor = (score) =>
    score >= 70 ? "text-red-400" :
    score >= 40 ? "text-yellow-400" :
    "text-green-400";

  return (
    <div className="p-8 text-white">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FaBell className="text-cyan-400 text-3xl" />
          <h1 className="text-3xl font-bold">Alerts Console</h1>
        </div>
        <div className="flex gap-2">
          {["active", "resolved"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                filter === f
                  ? "bg-cyan-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading alerts...</p>
      ) : alerts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-green-400 text-xl">
            {filter === "active" ? "No active alerts. All systems normal! ✅" : "No resolved alerts yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {alerts.map((alert, i) => (
              <motion.div
                key={alert._id}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 50 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className={`border rounded-2xl p-5 ${severityColor(alert.severity)} ${
                  alert.severity === "critical" ? "animate-pulse-slow" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${
                      alert.severity === "critical" ? "bg-red-500/30 text-red-300" :
                      alert.severity === "warning"  ? "bg-yellow-500/30 text-yellow-300" :
                      "bg-blue-500/30 text-blue-300"
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="text-xs text-slate-400 ml-2 capitalize">
                      {alert.type.replace("_", " ")}
                    </span>
                  </div>
                  {filter === "active" && (
                    <button
                      onClick={() => resolveAlert(alert._id)}
                      className="text-xs bg-slate-800 hover:bg-green-500/20 hover:text-green-400 text-slate-300 px-3 py-1 rounded-lg transition-all"
                    >
                      Resolve ✓
                    </button>
                  )}
                </div>

                <p className="text-white text-sm mb-3">{alert.message}</p>

                {alert.assignedDepartment && (
                  <div className="bg-slate-800/60 rounded-lg p-3 mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Auto-assigned to</p>
                      <p className="text-sm text-cyan-400 font-semibold capitalize">
                        {alert.assignedRole}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Priority score</p>
                      <p className={`text-lg font-bold ${priorityColor(alert.priorityScore)}`}>
                        {alert.priorityScore}/100
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between text-xs text-slate-400 mt-3">
                  <span>📍 {alert.location?.zone}</span>
                  <span>{new Date(alert.createdAt).toLocaleString()}</span>
                </div>
                {filter === "resolved" && alert.resolvedAt && (
                  <p className="text-green-400 text-xs mt-2">
                    Resolved at {new Date(alert.resolvedAt).toLocaleString()}
                  </p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default AlertsPage;