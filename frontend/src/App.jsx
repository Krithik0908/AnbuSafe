import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import RouteView from './views/RouteView';
import JourneyView from './views/JourneyView';
import FeedbackView from './views/FeedbackView';
import LoginView from './views/LoginView';
import SignupView from './views/SignupView';
import DashboardView from './views/DashboardView';
import SOSView from './views/SOSView';
import SettingsView from './views/SettingsView';
import DashboardLayout from './layouts/DashboardLayout';
import Hyperspeed from './components/Hyperspeed';
import CustomCursor from './components/CustomCursor';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const location = useLocation();

    const hyperspeedOptions = {
        onSpeedUp: () => { },
        onSlowDown: () => { },
        distortion: 'turbulentDistortion',
        length: 400,
        roadWidth: 10,
        islandWidth: 2,
        lanesPerRoad: 3,
        fov: 90,
        fovSpeedUp: 150,
        speedUp: 2,
        carLightsFade: 0.4,
        totalSideLightSticks: 20,
        lightPairsPerRoadWay: 40,
        shoulderLinesWidthPercentage: 0.05,
        brokenLinesWidthPercentage: 0.1,
        brokenLinesLengthPercentage: 0.5,
        lightStickWidth: [0.12, 0.5],
        lightStickHeight: [1.3, 1.7],
        movingAwaySpeed: [60, 80],
        movingCloserSpeed: [-120, -160],
        carLightsLength: [400 * 0.03, 400 * 0.2],
        carLightsRadius: [0.05, 0.14],
        carWidthPercentage: [0.3, 0.5],
        carShiftX: [-0.8, 0.8],
        carFloorSeparation: [0, 5],
        colors: {
            roadColor: 0x080808,
            islandColor: 0x0a0a0a,
            background: 0x000000,
            shoulderLines: 0x131318,
            brokenLines: 0x131318,
            leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
            rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
            sticks: 0x03b3c3
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-cyan-500/30 overflow-hidden relative">
            {/* Custom Cursor */}
            <CustomCursor />

            {/* Hyperspeed Background - Global */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
                <Hyperspeed effectOptions={hyperspeedOptions} />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 w-full h-full">
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/login" element={<LoginView />} />
                        <Route path="/signup" element={<SignupView />} />
                        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><DashboardView /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/dashboard/routes" element={<ProtectedRoute><DashboardLayout><RouteView /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/dashboard/journey" element={<ProtectedRoute><DashboardLayout><JourneyView /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/dashboard/sos" element={<ProtectedRoute><DashboardLayout><SOSView /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/dashboard/feedback" element={<ProtectedRoute><DashboardLayout><FeedbackView /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/dashboard/settings" element={<ProtectedRoute><DashboardLayout><SettingsView /></DashboardLayout></ProtectedRoute>} />
                    </Routes>
                </AnimatePresence>
            </div>
        </div>
    );
}

export default App;
