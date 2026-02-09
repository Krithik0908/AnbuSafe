import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export function SafetyScore({ score, size = "lg" }) {
    const spring = useSpring(0, { duration: 2000, bounce: 0 });
    const displayScore = useTransform(spring, (current) => Math.round(current));

    useEffect(() => {
        spring.set(score);
    }, [score, spring]);

    const getColor = (s) => {
        if (s >= 80) return "text-safety-safe";
        if (s >= 50) return "text-safety-moderate";
        return "text-safety-risky";
    };

    const ringColor = (s) => {
        if (s >= 80) return "stroke-safety-safe";
        if (s >= 50) return "stroke-safety-moderate";
        return "stroke-safety-risky";
    };

    return (
        <div className="relative flex items-center justify-center">
            <svg className={size === "lg" ? "w-32 h-32" : "w-16 h-16"} viewBox="0 0 100 100">
                <circle
                    cx="50" cy="50" r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-slate-800"
                />
                <motion.circle
                    cx="50" cy="50" r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray="283"
                    strokeDashoffset="283"
                    strokeLinecap="round"
                    className={ringColor(score)}
                    initial={{ strokeDashoffset: 283 }}
                    animate={{ strokeDashoffset: 283 - (283 * score) / 100 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    transform="rotate(-90 50 50)"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span className={`font-bold ${size === "lg" ? "text-4xl" : "text-xl"} ${getColor(score)}`}>
                    <DisplayValue value={displayScore} />
                </motion.span>
                {size === "lg" && <span className="text-xs text-slate-400 uppercase tracking-wider">Safety</span>}
            </div>
        </div>
    );
}

function DisplayValue({ value }) {
    const [current, setCurrent] = useState(0);
    useEffect(() => {
        return value.on("change", (v) => setCurrent(Math.round(v)));
    }, [value]);
    return <>{current}</>;
}
