const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["traffic", "air_quality", "energy", "water", "waste"],
    },
    severity: {
      type: String,
      required: true,
      enum: ["info", "warning", "critical"],
    },
    message: { type: String, required: true },
    value: { type: Number },
    threshold: { type: Number },
    location: {
      zone: { type: String },
      lat: { type: Number },
      lng: { type: Number },
    },
    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active",
    },
    resolvedAt: { type: Date, default: null },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    sensorId: { type: String },

    assignedDepartment: {
      type: String,
      enum: ["traffic", "environment", "energy", "utility", "admin"],
      default: null,
    },
    assignedRole: {
      type: String,
      default: null,
    },
    priorityScore: {
      type: Number,
      default: 0,
    },
    isPredicted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

alertSchema.index({ status: 1, createdAt: -1 });
alertSchema.index({ assignedDepartment: 1, status: 1 });

module.exports = mongoose.model("Alert", alertSchema);