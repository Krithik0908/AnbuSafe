import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export function GlassCard({ children, className, ...props }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={cn(
                "glass-card rounded-3xl p-6 relative overflow-hidden",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-lavender-500/10 to-transparent pointer-events-none" />
            {children}
        </motion.div>
    );
}
