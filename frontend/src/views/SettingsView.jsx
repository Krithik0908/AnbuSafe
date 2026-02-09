import { motion } from "framer-motion";
import { User, Bell, Shield, Lock, Palette, Globe, Save } from "lucide-react";
import { useState } from "react";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/Button";
import GradientText from "../components/GradientText";
import { useUser } from "../context/UserContext";

export default function SettingsView() {
    const { user, updateUser } = useUser();
    const [settings, setSettings] = useState({
        name: user?.name || "User Name",
        email: user?.email || "user@example.com",
        notifications: true,
        darkMode: true,
        language: "en",
        autoSave: true
    });

    const handleChange = (key, value) => {
        setSettings({ ...settings, [key]: value });
    };

    const handleSave = () => {
        // Update user data in context
        updateUser({ name: settings.name, email: settings.email });
        alert("Settings saved!");
    };

    return (
        <div className="space-y-6 max-w-4xl">
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
                    Settings
                </GradientText>
                <p className="text-white/60">Customize your experience</p>
            </motion.div>

            {/* Profile Settings */}
            <GlassCard className="!bg-black/40 !backdrop-blur-xl !border-white/10 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <User className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-xl font-bold text-white">Profile Information</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-white/60 text-sm mb-2">Full Name</label>
                        <input
                            type="text"
                            value={settings.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-white/60 text-sm mb-2">Email Address</label>
                        <input
                            type="email"
                            value={settings.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        />
                    </div>
                </div>
            </GlassCard>

            {/* Preferences */}
            <GlassCard className="!bg-black/40 !backdrop-blur-xl !border-white/10 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Palette className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-xl font-bold text-white">Preferences</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                        <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-white/60" />
                            <div>
                                <p className="text-white font-medium">Notifications</p>
                                <p className="text-white/60 text-sm">Receive alerts and updates</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.notifications}
                                onChange={(e) => handleChange('notifications', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                        <div className="flex items-center gap-3">
                            <Save className="w-5 h-5 text-white/60" />
                            <div>
                                <p className="text-white font-medium">Auto Save</p>
                                <p className="text-white/60 text-sm">Automatically save your routes</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.autoSave}
                                onChange={(e) => handleChange('autoSave', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                        </label>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5">
                        <div className="flex items-center gap-3 mb-3">
                            <Globe className="w-5 h-5 text-white/60" />
                            <p className="text-white font-medium">Language</p>
                        </div>
                        <select
                            value={settings.language}
                            onChange={(e) => handleChange('language', e.target.value)}
                            className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        >
                            <option value="en">English</option>
                            <option value="ta">Tamil</option>
                            <option value="hi">Hindi</option>
                        </select>
                    </div>
                </div>
            </GlassCard>

            {/* Security */}
            <GlassCard className="!bg-black/40 !backdrop-blur-xl !border-white/10 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-xl font-bold text-white">Security</h3>
                </div>
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        className="w-full justify-start !text-white hover:!bg-white/5 !border-white/10"
                    >
                        <Lock className="w-5 h-5 mr-3" />
                        Change Password
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start !text-white hover:!bg-white/5 !border-white/10"
                    >
                        <Shield className="w-5 h-5 mr-3" />
                        Two-Factor Authentication
                    </Button>
                </div>
            </GlassCard>

            {/* Save Button */}
            <Button
                onClick={handleSave}
                variant="primary"
                className="w-full !bg-cyan-500 hover:!bg-cyan-400 !text-black"
            >
                Save Changes
            </Button>
        </div>
    );
}
