import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/Button";
import { GlassCard } from "../components/GlassCard";
import GradientText from "../components/GradientText";
import { useUser } from "../context/UserContext";

export default function LoginView() {
    const navigate = useNavigate();
    const { login } = useUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        // Extract username from email (before @)
        const username = email.split('@')[0];
        // Store user data
        login({ email, name: username });
        navigate("/dashboard");
    };

    return (
        <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
            {/* Content Layer */}
            <div className="relative z-10 w-full max-w-md p-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <GradientText
                        colors={["#00d4ff", "#a78bfa", "#00d4ff"]}
                        animationSpeed={3}
                        className="!text-4xl md:!text-5xl !font-black !mb-2 !text-center"
                    >
                        Welcome to AnbuSafe Route
                    </GradientText>
                    <p className="text-white/60 text-sm mt-4">
                        Sign in to access your dashboard
                    </p>
                </motion.div>

                <GlassCard className="w-full space-y-6 !bg-black/40 !backdrop-blur-xl !border-white/10 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 text-cyan-300 w-5 h-5 group-focus-within:text-white transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                required
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-slate-900/80 transition-all font-medium"
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 text-cyan-300 w-5 h-5 group-focus-within:text-white transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-slate-900/80 transition-all font-medium"
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-white/10 bg-slate-900/60 text-cyan-500 focus:ring-cyan-500/50 focus:ring-2"
                                />
                                <span className="text-white/60 group-hover:text-white/80 transition-colors">
                                    Remember me
                                </span>
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full flex items-center justify-center gap-2 group !bg-cyan-500 hover:!bg-cyan-400 !text-black shadow-lg shadow-cyan-500/20"
                        >
                            <span className="font-bold text-lg">Sign In</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-black/40 text-white/40">OR</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-white/60 text-sm">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </GlassCard>

                <div className="text-center mt-6">
                    <Link
                        to="/"
                        className="text-white/40 hover:text-white/60 text-sm transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
