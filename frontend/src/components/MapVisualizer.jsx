import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export function MapVisualizer({ routeStatus = "safe", showLive = false }) {
    const colors = {
        safe: "#34d399",
        moderate: "#fbbf24",
        risky: "#f87171",
    };

    const pathColor = colors[routeStatus] || colors.safe;

    return (
        <div className="relative w-full h-full bg-slate-900 overflow-hidden rounded-3xl">
            {/* Abstract Map Background */}
            <div className="absolute inset-0 opacity-20">
                <svg w="100%" h="100%" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-500" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Buildings / Blocks (Decorative) */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-slate-800/50 rounded-lg blur-sm" />
            <div className="absolute bottom-1/3 right-1/4 w-48 h-24 bg-slate-800/50 rounded-lg blur-sm" />

            {/* Route Path */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.path
                    d="M 50,450 C 150,400 200,300 350,250 S 550,150 750,100" // Simple curve
                    fill="none"
                    stroke={pathColor}
                    strokeWidth="6"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                />

                {/* Pulsing Start/End Points */}
                <circle cx="50" cy="450" r="8" fill={pathColor} className="animate-pulse" />
                <circle cx="750" cy="100" r="8" fill={pathColor} className="animate-pulse" />

                {/* Live User Marker */}
                {showLive && (
                    <motion.circle
                        r="12"
                        fill={colors.safe}
                        initial={{ offsetDistance: "0%" }}
                        animate={{ offsetDistance: "100%" }}
                        transition={{ duration: 10, ease: "linear", repeat: Infinity }}
                        style={{ offsetPath: 'path("M 50,450 C 150,400 200,300 350,250 S 550,150 750,100")' }}
                    >
                        <circle r="20" fill={colors.safe} opacity="0.3" className="animate-ping" />
                    </motion.circle>
                )}
            </svg>
        </div>
    );
}
