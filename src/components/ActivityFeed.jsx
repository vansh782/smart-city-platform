import { useState, useEffect } from "react";
import API from "../services/api";
import socket from "../services/socket";

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours} hr${hours !== 1 ? "s" : ""} ago`;
}

function ActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecent = async () => {
    try {
      const res = await API.get("/alerts?limit=8");
      setActivities(res.data.alerts);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecent();

    socket.on("alert:new", (alert) => {
      setActivities((prev) => [alert, ...prev].slice(0, 8));
    });

    const interval = setInterval(fetchRecent, 30000);
    return () => {
      socket.off("alert:new");
      clearInterval(interval);
    };
  }, []);

  const dotColor = (severity) =>
    severity === "critical" ? "bg-red-500" :
    severity === "warning"  ? "bg-yellow-500" :
    "bg-blue-500";

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700">
      <h2 className="text-lg font-semibold text-white mb-4">Live Activity Feed</h2>
      {loading ? (
        <p className="text-slate-400">Loading activity...</p>
      ) : activities.length === 0 ? (
        <p className="text-green-400">No recent activity. All quiet.</p>
      ) : (
        <div className="space-y-3">
          {activities.map((a) => (
            <div key={a._id} className="bg-slate-800 rounded-xl p-4 flex items-start gap-3">
              <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${dotColor(a.severity)}`} />
              <div className="flex-1">
                <p className="text-white text-sm">{a.message}</p>
                <p className="text-slate-500 text-xs mt-1">
                  {timeAgo(a.createdAt)}
                  {a.status === "resolved" && (
                    <span className="text-green-400 ml-2">· Resolved</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityFeed;