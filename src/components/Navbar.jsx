import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaBell, FaSignOutAlt, FaUserCircle, FaEnvelope, FaIdBadge } from "react-icons/fa";
import { useAlerts } from "../hooks/useSensorData";

function Navbar() {
  const { user, logout } = useAuth();
  const { alerts, resolveAlert } = useAlerts();
  const navigate = useNavigate();

  const [bellOpen, setBellOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const bellRef = useRef(null);
  const userRef = useRef(null);

  // Close either dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const severityColor = (severity) =>
    severity === "critical" ? "text-red-400" :
    severity === "warning"  ? "text-yellow-400" :
    "text-blue-400";

  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h1 className="text-2xl font-bold text-white">
          🏙 Smart City Command Center
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Welcome back, {user?.name ?? "Admin"}
        </p>
      </div>
      <div className="flex items-center gap-4">

        {/* Bell dropdown */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={() => { setBellOpen(!bellOpen); setUserOpen(false); }}
            className="relative"
          >
            <FaBell className="text-slate-400 text-xl cursor-pointer hover:text-cyan-400" />
            {alerts.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {alerts.length}
              </span>
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
              <div className="p-3 border-b border-slate-700">
                <p className="text-white font-semibold text-sm">
                  Active Alerts ({alerts.length})
                </p>
              </div>
              {alerts.length === 0 ? (
                <p className="text-green-400 text-sm p-4">No active alerts. All clear.</p>
              ) : (
                alerts.slice(0, 6).map((alert) => (
                  <div key={alert._id} className="p-3 border-b border-slate-700/50 hover:bg-slate-700/40">
                    <p className={`text-xs font-semibold uppercase ${severityColor(alert.severity)}`}>
                      {alert.severity} · {alert.type.replace("_", " ")}
                    </p>
                    <p className="text-slate-300 text-xs mt-1">{alert.message}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-slate-500 text-xs">{alert.location?.zone}</span>
                      <button
                        onClick={() => resolveAlert(alert._id)}
                        className="text-xs text-cyan-400 hover:text-cyan-300"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                ))
              )}
              <button
                onClick={() => { setBellOpen(false); navigate("/alerts"); }}
                className="w-full text-center text-cyan-400 text-xs p-3 hover:bg-slate-700/40"
              >
                View all alerts →
              </button>
            </div>
          )}
        </div>

        {/* User dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => { setUserOpen(!userOpen); setBellOpen(false); }}
            className="flex items-center gap-2 text-slate-300 hover:text-white"
          >
            <FaUserCircle className="text-xl text-cyan-400" />
            <span className="text-sm capitalize">{user?.role}</span>
          </button>

          {userOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <FaUserCircle className="text-3xl text-cyan-400" />
                  <div>
                    <p className="text-white font-semibold text-sm">{user?.name}</p>
                    <p className="text-slate-400 text-xs capitalize">{user?.role} account</p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <FaEnvelope className="text-slate-500" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <FaIdBadge className="text-slate-500" />
                  <span className="capitalize">{user?.role} privileges</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 justify-center bg-slate-700/50 hover:bg-red-500/20 hover:text-red-400 text-slate-300 px-3 py-3 rounded-b-xl text-sm transition-all"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Navbar;