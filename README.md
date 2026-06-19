# 🏙 Smart City Management Platform

A real-time, full-stack smart city monitoring and management system. Tracks traffic, air quality, energy, water, and waste data live across city zones, auto-detects anomalies, generates alerts, and recommends optimized actions for city administrators.

**🔗 Live Demo:** [Add your Vercel URL here]
**🔗 Backend API:** [Add your Render URL here]

## Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@city.com | admin123 | Admin |

## Features

- Real-time dashboard with live sensor data (Socket.io)
- Automatic anomaly detection with configurable thresholds
- Role-based authentication (JWT)
- Alert management system with resolve workflow
- AI-style recommendation engine for resource optimization
- Live charts for traffic, air quality, and energy trends
- City zone monitoring across 5 sensor types

## Tech Stack

**Frontend:** React, Tailwind CSS, React Router, Axios, Socket.io-client, Recharts
**Backend:** Node.js, Express, MongoDB, Mongoose, Socket.io, JWT, bcrypt
**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Architecture

React Frontend → REST API + WebSocket → Express Backend → MongoDB Atlas

↓

Cron job (every 30s)

Anomaly detection

Alert generation


## Run Locally

### Backend
```bash
cd backend
npm install
npm start
```
Create `backend/.env` using `.env.example` as a template.

### Frontend
```bash
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|--------------|
| POST | /api/auth/register | Create new user |
| POST | /api/auth/login | Login and get JWT |
| GET | /api/auth/me | Get current user |
| GET | /api/sensors/latest | Latest reading per sensor type |
| GET | /api/sensors | List sensor readings with filters |
| POST | /api/sensors | Add new sensor reading |
| GET | /api/alerts | List alerts by status |
| PATCH | /api/alerts/:id/resolve | Resolve an alert |
| GET | /api/resources/recommendations | Get AI recommendations |
| GET | /api/analytics/summary | Dashboard summary stats |

## Team

- Backend, Database, Real-time Architecture: Vansh Goryan
- Frontend, UI/UX Design: Moni Gautam

## Hackathon Submission

Built for Bharat Academic CodeQuest — 2026