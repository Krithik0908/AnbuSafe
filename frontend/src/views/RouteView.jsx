import { motion } from "framer-motion";
import { AlertTriangle, Check, Shield, Video, Zap, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { GlassCard } from "../components/GlassCard";
import { MapVisualizer } from "../components/MapVisualizer";
import { SafetyScore } from "../components/SafetyScore";

export default function RouteView() {
    const navigate = useNavigate();

    return (
        <div className="relative h-screen w-full overflow-hidden bg-slate-950">
            {/* Background Map */}
            <div className="absolute inset-0 z-0">
                <MapVisualizer routeStatus="safe" />
            </div>

            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start bg-gradient-to-b from-slate-900/80 to-transparent">
                <Button variant="ghost" onClick={() => navigate("/")} className="p-2">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
            </div>

            {/* POI Markers (Animated) */}
            {[
                { top: '30%', left: '40%', icon: Shield, color: 'text-blue-400', label: 'Police Station' },
                { top: '50%', left: '60%', icon: Video, color: 'text-purple-400', label: 'CCTV Zone' },
                { top: '20%', left: '70%', icon: Zap, color: 'text-yellow-400', label: 'Good Lighting' },
            ].map((poi, i) => (
                <motion.div
                    key={i}
                    className="absolute z-10"
                    style={{ top: poi.top, left: poi.left }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1 + i * 0.2 }}
                >
                    <div className={`p-2 rounded-full bg-slate-900/80 backdrop-blur border border-white/10 ${poi.color} shadow-lg shadow-${poi.color.split('-')[1]}-500/20`}>
                        <poi.icon className="w-5 h-5" />
                    </div>
                </motion.div>
            ))}

            {/* Bottom Card */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <GlassCard className="w-full max-w-md mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-safety-safe to-emerald-200">
                                Safe Route
                            </h2>
                            <p className="text-slate-400 text-sm">Via Main Rd • 12 mins</p>
                        </div>
                        <SafetyScore score={92} size="sm" />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-slate-800/30 rounded-lg p-2 text-center">
                            <div className="text-emerald-400 font-bold">98%</div>
                            <div className="text-[10px] text-slate-500 uppercase">Lighting</div>
                        </div>
                        <div className="bg-slate-800/30 rounded-lg p-2 text-center">
                            <div className="text-emerald-400 font-bold">High</div>
                            <div className="text-[10px] text-slate-500 uppercase">Police</div>
                        </div>
                        <div className="bg-slate-800/30 rounded-lg p-2 text-center">
                            <div className="text-amber-400 font-bold">Avg</div>
                            <div className="text-[10px] text-slate-500 uppercase">Traffic</div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button
                            className="w-full text-lg font-bold py-4 shadow-xl shadow-lavender-500/20"
                            onClick={() => navigate("/journey")}
                        >
                            Start Journey
                        </Button>
                        <p className="text-xs text-center text-slate-500">
                            Location shared only during trip • Anonymous
                        </p>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
