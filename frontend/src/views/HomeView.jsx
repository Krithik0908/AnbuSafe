import { motion } from "framer-motion";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { GlassCard } from "../components/GlassCard";
import GlitchText from "../components/GlitchText";

export default function HomeView() {
    const navigate = useNavigate();
    const [from, setFrom] = useState("Nungambakkam");
    const [to, setTo] = useState("Anna Nagar");

    const handleSearch = () => {
        navigate("/route");
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Auth Buttons */}
            <div className="absolute top-6 right-6 z-20 flex gap-3">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/login")}
                    className="!text-white hover:!bg-white/10 !border-white/20"
                >
                    Login
                </Button>
                <Button
                    variant="primary"
                    onClick={() => navigate("/signup")}
                    className="!bg-cyan-500 hover:!bg-cyan-400 !text-black"
                >
                    Sign Up
                </Button>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6 mb-12"
                >
                    <GradientText
                        colors={["#00d4ff", "#a78bfa", "#00d4ff"]}
                        animationSpeed={3}
                        className="!text-6xl md:!text-8xl !font-black !drop-shadow-2xl !tracking-tighter"
                    >
                        AnbuSafe Route
                    </GradientText>
                    <p className="text-white/80 text-xl md:text-2xl font-light tracking-wide max-w-lg mx-auto drop-shadow-md">
                        Anbu-oda Paathai, Nambikkai-oda Payanam
                    </p>
                </motion.div>

                <GlassCard className="w-full max-w-md space-y-6 !bg-black/40 !backdrop-blur-xl !border-white/10 shadow-2xl">
                    <div className="space-y-4">
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-3.5 text-cyan-300 w-5 h-5 group-focus-within:text-white transition-colors" />
                            <input
                                type="text"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                placeholder="Start Location"
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-slate-900/80 transition-all font-medium"
                            />
                        </div>

                        <div className="relative group">
                            <MapPin className="absolute left-4 top-3.5 text-cyan-300 w-5 h-5 group-focus-within:text-white transition-colors" />
                            <input
                                type="text"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                placeholder="Destination"
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-slate-900/80 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        className="w-full flex items-center justify-center gap-2 group !bg-cyan-500 hover:!bg-cyan-400 !text-black shadow-lg shadow-cyan-500/20"
                        onClick={handleSearch}
                    >
                        <span className="font-bold text-lg">Check Safety</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <div className="text-center">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold animate-pulse">
                            Secure • Anonymous • Realtime
                        </p>
                    </div>
                </GlassCard>

                <div className="mt-12 space-y-4">
                    <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest text-center">Recent Routes</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide w-full max-w-2xl px-4 justify-center">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="min-w-[140px] p-4 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md hover:bg-white/5 transition-colors cursor-pointer flex flex-col gap-1 items-center">
                                <span className="text-cyan-400 font-bold text-xl">9{i}%</span>
                                <span className="text-white/60 text-xs">Safe Score</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
