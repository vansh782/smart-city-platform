import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useState, useEffect } from "react";
import API from "../services/api";
import socket from "../services/socket";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ICON_COLORS = {
  traffic: "yellow",
  waste: "green",
  air_quality: "violet",
  energy: "blue",
  water: "grey",
};

const STATUS_COLORS = {
  normal: "green",
  warning: "yellow",
  critical: "red",
};

const buildIcon = (status) => {
  const color = STATUS_COLORS[status] || "blue";
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
};

const TYPE_LABELS = {
  traffic: { emoji: "🚦", label: "Traffic" },
  waste: { emoji: "🗑", label: "Waste" },
  air_quality: { emoji: "🌫", label: "Air Quality" },
  energy: { emoji: "⚡", label: "Energy" },
  water: { emoji: "💧", label: "Water" },
};

function CityMap() {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    traffic: true,
    waste: true,
    air_quality: true,
    energy: true,
    water: true,
  });

  const fetchSensors = async () => {
    try {
      // Get latest reading per type — gives us one marker per sensor location
      const res = await API.get("/sensors/latest");
      const latest = res.data.latest;
      const sensorList = Object.values(latest).filter(Boolean);
      setSensors(sensorList);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();

    socket.on("sensor:update", () => {
      fetchSensors();
    });

    const interval = setInterval(fetchSensors, 30000);
    return () => {
      socket.off("sensor:update");
      clearInterval(interval);
    };
  }, []);

  const toggleFilter = (type) => {
    setFilters((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-4 mt-8">
      <div className="flex items-center justify-between mb-4">
  <h2 className="text-2xl font-bold text-white">Live City Map</h2>
  <span className="text-xs text-slate-400">Use +/− or double-click to zoom</span>
</div>

      <div className="flex gap-6 mb-4 flex-wrap text-white">
        {Object.entries(TYPE_LABELS).map(([type, { emoji, label }]) => (
          <label key={type} className="cursor-pointer">
            <input
              type="checkbox"
              checked={filters[type]}
              onChange={() => toggleFilter(type)}
              className="mr-1"
            />
            {emoji} {label}
          </label>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-400 p-8">Loading map data...</p>
      ) : (
        <MapContainer
  center={[25.3176, 82.9739]}
  zoom={13}
  scrollWheelZoom={false}
  style={{ height: "450px", width: "100%", borderRadius: "15px" }}
>
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {sensors
            .filter((s) => filters[s.type])
            .map((s) => {
              const info = TYPE_LABELS[s.type];
              return (
                <Marker
                  key={s._id}
                  position={[s.location.lat, s.location.lng]}
                  icon={buildIcon(s.status)}
                >
                  <Popup>
                    <div>
                      <h3><b>{info.emoji} {info.label}</b></h3>
                      <p>Location: {s.location.zone}</p>
                      <p>Value: {s.value} {s.unit}</p>
                      <p>Status: <b style={{
                        color: s.status === "critical" ? "red" :
                               s.status === "warning"  ? "orange" : "green"
                      }}>{s.status.toUpperCase()}</b></p>
                      <p style={{ fontSize: "11px", color: "#666" }}>
                        Updated: {new Date(s.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      )}
    </div>
  );
}

export default CityMap;