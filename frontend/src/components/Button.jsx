import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export function Button({ children, className, variant = "primary", ...props }) {
    const variants = {
        primary: "bg-lavender-600 hover:bg-lavender-500 text-white shadow-lg shadow-lavender-500/25",
        secondary: "bg-slate-700/50 hover:bg-slate-700 text-slate-200",
        danger: "bg-safety-risky hover:bg-red-500 text-white shadow-lg shadow-red-500/25",
        success: "bg-safety-safe hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25",
        ghost: "hover:bg-white/10 text-slate-300 hover:text-white",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "px-6 py-3 rounded-xl font-medium transition-colors relative overflow-hidden",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
}
