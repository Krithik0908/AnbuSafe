import { motion } from "framer-motion";
import { Navigation, ShieldCheck, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { GlassCard } from "../components/GlassCard";
import { MapVisualizer } from "../components/MapVisualizer";

export default function JourneyView() {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return p + 1;
            });
        }, 100); // 10 seconds trip for demo
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-screen w-full overflow-hidden bg-slate-950">
            <div className="absolute inset-0 z-0">
                <MapVisualizer routeStatus="safe" showLive={true} />
            </div>

            {/* Status Top Bar */}
            <motion.div
                initial={{ y: -100 }} animate={{ y: 0 }}
                className="absolute top-8 left-4 right-4 z-20"
            >
                <GlassCard className="py-3 px-4 flex items-center gap-3 !bg-slate-900/80">
                    <div className="p-2 bg-lavender-500/20 rounded-full animate-pulse">
                        <Navigation className="w-5 h-5 text-lavender-400 fill-current" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-medium text-white">Journey in Progress</h3>
                        <p className="text-xs text-lavender-300">Stick to Main Rd</p>
                    </div>
                    <div className="text-emerald-400 font-mono font-bold">
                        ETA 4m
                    </div>
                </GlassCard>
            </motion.div>

            {/* Floating Safety FAB */}
            <div className="absolute right-4 bottom-32 z-20">
                <Button variant="danger" className="rounded-full w-14 h-14 flex items-center justify-center shadow-red-500/40">
                    <ShieldCheck className="w-6 h-6" />
                </Button>
            </div>

            {/* Arrival Overlay (Conditional) */}
            {progress >= 100 && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 space-y-6"
                >
                    <motion.div
                        initial={{ scale: 0.5 }} animate={{ scale: 1 }}
                        className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500"
                    >
                        <Check className="w-10 h-10 text-emerald-500" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-white">You've Arrived!</h2>
                    <Button onClick={() => navigate("/feedback")} className="w-full max-w-sm">
                        End & Rate Route
                    </Button>
                </motion.div>
            )}
        </div>
    );
}

