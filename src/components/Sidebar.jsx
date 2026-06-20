import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHome, FaTrafficLight,
  FaCloud, FaBolt, FaBell,
} from "react-icons/fa";

const navItems = [
  { label: "Dashboard",   path: "/",            icon: <FaHome /> },
  { label: "Traffic",     path: "/traffic",     icon: <FaTrafficLight /> },
  { label: "Environment", path: "/environment", icon: <FaCloud /> },
  { label: "Energy",      path: "/energy",      icon: <FaBolt /> },
  { label: "Alerts",      path: "/alerts",      icon: <FaBell /> },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-64 bg-slate-900 p-6 min-h-screen">
      <motion.h2
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-bold mb-8"
      >
        🏙 Smart City
      </motion.h2>
      <ul className="space-y-4">
        {navItems.map((item, i) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.li
              key={item.path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(item.path)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg transition-colors
                ${isActive
                  ? "bg-cyan-500 text-white"
                  : "text-slate-300 hover:text-cyan-400 hover:bg-slate-800"
                }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;