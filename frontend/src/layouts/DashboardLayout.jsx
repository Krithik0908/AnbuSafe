import { motion } from "framer-motion";
import { Home, Map, MessageSquare, Route, Settings, LogOut, Menu, X, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GradientText from "../components/GradientText";
import { useUser } from "../context/UserContext";

const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Route, label: "My Routes", path: "/dashboard/routes" },
    { icon: Map, label: "Journey History", path: "/dashboard/journey" },
    { icon: AlertTriangle, label: "SOS Emergency", path: "/dashboard/sos" },
    { icon: MessageSquare, label: "Feedback", path: "/dashboard/feedback" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" }
];

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useUser();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="relative w-full min-h-screen overflow-hidden flex">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: sidebarOpen ? 0 : -300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed left-0 top-0 h-full w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col"
            >
                {/* Logo */}
                <div className="p-6 border-b border-white/10">
                    <GradientText
                        colors={["#00d4ff", "#a78bfa", "#00d4ff"]}
                        animationSpeed={3}
                        className="!text-2xl !font-black"
                    >
                        AnbuSafe
                    </GradientText>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                                    : "text-white/60 hover:bg-white/5 hover:text-white border border-transparent"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-all w-full border border-transparent hover:border-red-500/30"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                {/* Top Bar */}
                <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-white/10">
                    <div className="flex items-center justify-between px-6 py-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            {sidebarOpen ? (
                                <X className="w-6 h-6 text-white" />
                            ) : (
                                <Menu className="w-6 h-6 text-white" />
                            )}
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-white">Welcome back!</p>
                                <p className="text-xs text-white/60">{user?.name || 'User'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                {user?.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="relative z-10 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
