import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Traffic from "./pages/Traffic";
import Environment from "./pages/Environment";
import Energy from "./pages/Energy";
import AlertsPage from "./pages/AlertsPage";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      Loading...
    </div>
  );
  return user ? children : <Navigate to="/login" />;
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function Layout() {
  return (
    <div className="flex min-h-screen animated-bg text-white">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<PrivateRoute><PageWrapper><Dashboard /></PageWrapper></PrivateRoute>} />
          <Route path="/traffic" element={<PrivateRoute><PageWrapper><Traffic /></PageWrapper></PrivateRoute>} />
          <Route path="/environment" element={<PrivateRoute><PageWrapper><Environment /></PageWrapper></PrivateRoute>} />
          <Route path="/energy" element={<PrivateRoute><PageWrapper><Energy /></PageWrapper></PrivateRoute>} />
          <Route path="/alerts" element={<PrivateRoute><PageWrapper><AlertsPage /></PageWrapper></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" theme="dark" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Layout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;