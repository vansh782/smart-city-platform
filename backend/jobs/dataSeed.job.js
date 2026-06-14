const cron = require("node-cron");
const Sensor = require("../models/Sensor.model");
const Alert = require("../models/Alert.model");

const SENSORS = [
  { sensorId: "TRAFFIC-001", type: "traffic", unit: "vehicles/min", zone: "Varanasi Central", lat: 25.3176, lng: 82.9739, min: 30, max: 220 },
  { sensorId: "AQI-001", type: "air_quality", unit: "AQI", zone: "Lanka", lat: 25.2677, lng: 82.9913, min: 40, max: 200 },
  { sensorId: "ENERGY-001", type: "energy", unit: "kWh", zone: "Orderly Bazar", lat: 25.3213, lng: 82.9944, min: 200, max: 550 },
  { sensorId: "WATER-001", type: "water", unit: "L/hr", zone: "Assi Ghat", lat: 25.2837, lng: 82.9977, min: 300, max: 1100 },
  { sensorId: "WASTE-001", type: "waste", unit: "%", zone: "Godowlia", lat: 25.3082, lng: 82.9993, min: 10, max: 95 },
];

const THRESHOLDS = {
  traffic:     { warning: 150, critical: 200 },
  air_quality: { warning: 100, critical: 150 },
  energy:      { warning: 400, critical: 500 },
  water:       { warning: 800, critical: 1000 },
  waste:       { warning: 75,  critical: 90 },
};

const randomValue = (min, max) =>
  Math.round((Math.random() * (max - min) + min) * 10) / 10;

const seedData = async () => {
  for (const s of SENSORS) {
    const value = randomValue(s.min, s.max);
    const limits = THRESHOLDS[s.type];
    const status =
      value >= limits.critical ? "critical" :
      value >= limits.warning  ? "warning"  : "normal";

    await Sensor.create({
      sensorId: s.sensorId,
      type: s.type,
      value,
      unit: s.unit,
      location: { lat: s.lat, lng: s.lng, zone: s.zone },
      status,
    });

    if (status !== "normal") {
      const existing = await Alert.findOne({
        sensorId: s.sensorId, status: "active"
      });
      if (!existing) {
        await Alert.create({
          type: s.type,
          severity: status,
          message: `${s.type.replace("_", " ")} level ${value} exceeded ${status} threshold at ${s.zone}`,
          value,
          threshold: status === "critical" ? limits.critical : limits.warning,
          location: { lat: s.lat, lng: s.lng, zone: s.zone },
          sensorId: s.sensorId,
          status: "active",
        });
        console.log(`Alert created: ${status} ${s.type} at ${s.zone}`);
      }
    }
  }
  console.log(`Sensor data seeded at ${new Date().toLocaleTimeString()}`);
};

const startSeedJob = () => {
  seedData();
  cron.schedule("*/30 * * * * *", seedData);
  console.log("Seed job started - running every 30 seconds");
};

module.exports = { startSeedJob };