import { motion } from "framer-motion";
import { Activity, MapPin, TrendingUp, Clock, Navigation, Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/Button";
import GradientText from "../components/GradientText";
import { useUser } from "../context/UserContext";

export default function DashboardView() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [useCurrentLocation, setUseCurrentLocation] = useState(false);

    const stats = [
        { icon: MapPin, label: "Total Routes", value: "24", color: "cyan" },
        { icon: Activity, label: "Safe Journeys", value: "22", color: "green" },
        { icon: TrendingUp, label: "Safety Score", value: "94%", color: "purple" },
        { icon: Clock, label: "Hours Saved", value: "12.5", color: "orange" }
    ];

    const handleGetCurrentLocation = () => {
        setUseCurrentLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setSource(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
                },
                (error) => {
                    alert("Unable to get current location. Please enter manually.");
                    setUseCurrentLocation(false);
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
            setUseCurrentLocation(false);
        }
    };

    const handlePlanRoute = () => {
        if (!source || !destination) {
            alert("Please enter both source and destination!");
            return;
        }
        // Navigate to routes page with query params
        navigate(`/dashboard/routes?from=${encodeURIComponent(source)}&to=${encodeURIComponent(destination)}`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <GradientText
                    colors={["#00d4ff", "#a78bfa", "#00d4ff"]}
                    animationSpeed={3}
                    className="!text-4xl !font-black !mb-2"
                >
                    Dashboard
                </GradientText>
                <p className="text-white/60">Welcome back, {user?.name || 'User'}! Plan your safe journey</p>
            </motion.div>

            {/* Route Planning Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <GlassCard className="!bg-black/40 !backdrop-blur-xl !border-white/10 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Navigation className="w-6 h-6 text-cyan-400" />
                        <h3 className="text-2xl font-bold text-white">Plan Your Route</h3>
                    </div>

                    <div className="space-y-4">
                        {/* Source Input */}
                        <div>
                            <label className="block text-white/60 text-sm mb-2">From (Source)</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                                    <input
                                        type="text"
                                        value={source}
                                        onChange={(e) => setSource(e.target.value)}
                                        placeholder="Enter starting location"
                                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                    />
                                </div>
                                <Button
                                    onClick={handleGetCurrentLocation}
                                    variant="ghost"
                                    className="!text-cyan-400 hover:!bg-cyan-500/10 !border-cyan-500/30 whitespace-nowrap"
                                >
                                    <Navigation className="w-5 h-5 mr-2" />
                                    Use Current
                                </Button>
                            </div>
                        </div>

                        {/* Destination Input */}
                        <div>
                            <label className="block text-white/60 text-sm mb-2">To (Destination)</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                                <input
                                    type="text"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="Enter destination"
                                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                />
                            </div>
                        </div>

                        {/* Search Button */}
                        <Button
                            onClick={handlePlanRoute}
                            variant="primary"
                            className="w-full !bg-gradient-to-r !from-cyan-500 !to-purple-500 hover:!from-cyan-400 hover:!to-purple-400 !text-white !text-lg !py-4"
                        >
                            <Search className="w-5 h-5 mr-2" />
                            Find Safe Routes
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                        >
                            <GlassCard className="!bg-black/40 !backdrop-blur-xl !border-white/10 p-6 hover:!border-cyan-500/30 transition-all">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white/60 text-sm mb-1">{stat.label}</p>
                                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl bg-${stat.color}-500/20`}>
                                        <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <GlassCard className="!bg-black/40 !backdrop-blur-xl !border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">Route to Anna Nagar</p>
                                    <p className="text-white/60 text-sm">Safety Score: 9{i}%</p>
                                </div>
                            </div>
                            <span className="text-white/40 text-sm">2 hours ago</span>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
}
