import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Always-loaded Components (needed immediately)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/chatbot/Chatbot';
import DbStatus from './components/DbStatus';
import BackendStatus from './components/BackendStatus';
import SkeletonLoader from './components/SkeletonLoader';

// Lazy-loaded Pages (code-split for performance)
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Community = React.lazy(() => import('./pages/Community'));
const CropRecommendation = React.lazy(() => import('./pages/CropRecommendation'));
const DiseasePrediction = React.lazy(() => import('./pages/DiseasePrediction'));
const YieldPrediction = React.lazy(() => import('./pages/YieldPrediction'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const UserDashboard = React.lazy(() => import('./pages/UserDashboard'));
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const FarmMap = React.lazy(() => import('./pages/FarmMap'));
const SatelliteMonitor = React.lazy(() => import('./pages/SatelliteMonitor'));
const MarketPrediction = React.lazy(() => import('./pages/MarketPrediction'));
const FarmCalendar = React.lazy(() => import('./pages/FarmCalendar'));

// Page loading fallback
const PageLoader = () => (
  <div className="max-w-7xl mx-auto px-4 py-12">
    <SkeletonLoader type="card" count={3} />
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen transition-colors duration-300">
            <Navbar />
            <main className="flex-grow">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/user-dashboard" element={<UserDashboard />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/crop-recommendation" element={<CropRecommendation />} />
                  <Route path="/disease-prediction" element={<DiseasePrediction />} />
                  <Route path="/yield-prediction" element={<YieldPrediction />} />
                  <Route path="/farm-map" element={<FarmMap />} />
                  <Route path="/satellite-monitor" element={<SatelliteMonitor />} />
                  <Route path="/market-prediction" element={<MarketPrediction />} />
                  <Route path="/farm-calendar" element={<FarmCalendar />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <DbStatus />
            <BackendStatus />
            <Chatbot />
            <ToastContainer position="bottom-right" theme="colored" />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
