import { motion } from "framer-motion";
import { Check, ThumbsDown, ThumbsUp, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { GlassCard } from "../components/GlassCard";

export default function FeedbackView() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(null);

    const handleSubmit = () => {
        // Navigate back to home after a delay
        setTimeout(() => {
            navigate("/");
        }, 1500);
    };

    return (
        <div className="relative min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-lavender-900/20 via-slate-950 to-slate-950" />

            <GlassCard className="w-full max-w-md space-y-8 text-center z-10">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lavender-300 to-primary-soft">
                        How was the route?
                    </h2>
                    <p className="text-slate-400 mt-2">Your feedback helps 2,000+ users.</p>
                </motion.div>

                <div className="flex justify-center gap-4">
                    {[
                        { id: 'safe', icon: ThumbsUp, label: 'Safe', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                        { id: 'okay', icon: Check, label: 'Okay', color: 'text-amber-400', bg: 'bg-amber-500/10' },
                        { id: 'risky', icon: ThumbsDown, label: 'Risky', color: 'text-red-400', bg: 'bg-red-500/10' },
                    ].map((option) => (
                        <motion.button
                            key={option.id}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelected(option.id)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${selected === option.id
                                    ? 'bg-lavender-600 shadow-lg shadow-lavender-500/25 scale-110'
                                    : 'bg-slate-800/50 hover:bg-slate-800'
                                }`}
                        >
                            <option.icon className={`w-8 h-8 ${selected === option.id ? 'text-white' : option.color}`} />
                            <span className={`text-xs font-medium ${selected === option.id ? 'text-white' : 'text-slate-400'}`}>
                                {option.label}
                            </span>
                        </motion.button>
                    ))}
                </div>

                {selected && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4"
                    >
                        <div className="flex flex-wrap gap-2 justify-center">
                            {['Streetlight Off', 'Crowded', 'Police Present', 'Isolated'].map(tag => (
                                <span key={tag} className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300 border border-white/5 cursor-pointer hover:border-lavender-500/50 transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <Button onClick={handleSubmit} className="w-full">
                            Submit Feedback
                        </Button>
                    </motion.div>
                )}
            </GlassCard>
        </div>
    );
}
