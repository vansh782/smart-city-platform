const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const { initSocket } = require("./config/socket");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/ai.routes");
const sensorRoutes = require("./routes/sensor.routes");
const alertRoutes = require("./routes/alert.routes");
const resourceRoutes = require("./routes/resource.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const { startSeedJob } = require("./jobs/dataSeed.job");
connectDB();
const app = express();
const server = http.createServer(app);
initSocket(server);
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://smart-city-platform-livid.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/analytics", analyticsRoutes);
app.get("/", (req, res) => res.send("Backend Running"));
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
  startSeedJob();
});