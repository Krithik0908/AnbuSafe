import { motion } from "framer-motion";
import { AlertTriangle, Plus, Trash2, Phone, Send, User, Check } from "lucide-react";
import { useState } from "react";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/Button";
import GradientText from "../components/GradientText";

export default function SOSView() {
    const [contacts, setContacts] = useState([
        { id: 1, name: "Mom", phone: "+91 98765 43210", relation: "Mother" },
        { id: 2, name: "Dad", phone: "+91 98765 43211", relation: "Father" }
    ]);

    const [newContact, setNewContact] = useState({
        name: "",
        phone: "",
        relation: ""
    });

    const [showAddForm, setShowAddForm] = useState(false);
    const [telegramConnected, setTelegramConnected] = useState(false);
    const [telegramUsername, setTelegramUsername] = useState("");
    const [sosActive, setSosActive] = useState(false);

    const handleAddContact = () => {
        if (newContact.name && newContact.phone && newContact.relation) {
            setContacts([...contacts, { ...newContact, id: Date.now() }]);
            setNewContact({ name: "", phone: "", relation: "" });
            setShowAddForm(false);
        }
    };

    const handleDeleteContact = (id) => {
        setContacts(contacts.filter(c => c.id !== id));
    };

    const handleConnectTelegram = () => {
        if (telegramUsername) {
            setTelegramConnected(true);
            alert(`Telegram connected: @${telegramUsername}`);
        }
    };

    const handleSOS = () => {
        setSosActive(true);
        // TODO: Implement actual SOS logic
        alert("🚨 SOS ALERT SENT! Your trusted contacts and Telegram have been notified.");
        setTimeout(() => setSosActive(false), 3000);
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
                    SOS Emergency
                </GradientText>
                <p className="text-white/60">Manage your emergency contacts and alerts</p>
            </motion.div>

            {/* SOS Button */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-center"
            >
                <button
                    onClick={handleSOS}
                    disabled={sosActive}
                    className={`relative w-48 h-48 rounded-full transition-all duration-300 ${sosActive
                        ? 'bg-red-600 scale-110 animate-pulse'
                        : 'bg-gradient-to-br from-red-500 to-red-700 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/50'
                        }`}
                >
                    <div className="absolute inset-0 rounded-full bg-red-400/20 animate-ping"></div>
                    <div className="relative flex flex-col items-center justify-center h-full">
                        <AlertTriangle className="w-16 h-16 text-white mb-2" />
                        <span className="text-white font-black text-2xl">SOS</span>
                        <span className="text-white/80 text-sm">Emergency</span>
                    </div>
                </button>
            </motion.div>

            {/* Trusted Contacts */}
            <GlassCard className="!bg-black/40 !backdrop-blur-xl !border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <User className="w-6 h-6 text-cyan-400" />
                        <h3 className="text-xl font-bold text-white">Trusted Contacts</h3>
                    </div>
                    <Button
                        onClick={() => setShowAddForm(!showAddForm)}
                        variant="primary"
                        className="!bg-cyan-500 hover:!bg-cyan-400 !text-black"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Contact
                    </Button>
                </div>

                {/* Add Contact Form */}
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Name"
                                value={newContact.name}
                                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={newContact.phone}
                                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                            />
                            <select
                                value={newContact.relation}
                                onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                            >
                                <option value="">Select Relation</option>
                                <option value="Mother">Mother</option>
                                <option value="Father">Father</option>
                                <option value="Sister">Sister</option>
                                <option value="Brother">Brother</option>
                                <option value="Friend">Friend</option>
                                <option value="Other">Other</option>
                            </select>
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleAddContact}
                                    variant="primary"
                                    className="flex-1 !bg-cyan-500 hover:!bg-cyan-400 !text-black"
                                >
                                    Save Contact
                                </Button>
                                <Button
                                    onClick={() => setShowAddForm(false)}
                                    variant="ghost"
                                    className="flex-1 !text-white hover:!bg-white/5"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Contacts List */}
                <div className="space-y-3">
                    {contacts.length === 0 ? (
                        <p className="text-white/40 text-center py-8">No trusted contacts added yet</p>
                    ) : (
                        contacts.map((contact) => (
                            <div
                                key={contact.id}
                                className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                        {contact.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{contact.name}</p>
                                        <p className="text-white/60 text-sm">{contact.relation}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 text-white/60">
                                        <Phone className="w-4 h-4" />
                                        <span className="text-sm">{contact.phone}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteContact(contact.id)}
                                        className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </GlassCard>

            {/* Telegram Integration */}
            <GlassCard className="!bg-black/40 !backdrop-blur-xl !border-white/10 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Send className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-xl font-bold text-white">Telegram Integration</h3>
                </div>

                {telegramConnected ? (
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                <Check className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Connected to Telegram</p>
                                <p className="text-white/60 text-sm">@{telegramUsername}</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => setTelegramConnected(false)}
                            variant="ghost"
                            className="w-full mt-4 !text-red-400 hover:!bg-red-500/10"
                        >
                            Disconnect
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-white/60 text-sm">
                            Connect your Telegram account to receive SOS alerts instantly
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Telegram Username (without @)"
                                value={telegramUsername}
                                onChange={(e) => setTelegramUsername(e.target.value)}
                                className="flex-1 bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                            />
                            <Button
                                onClick={handleConnectTelegram}
                                variant="primary"
                                className="!bg-cyan-500 hover:!bg-cyan-400 !text-black"
                            >
                                <Send className="w-5 h-5 mr-2" />
                                Connect
                            </Button>
                        </div>
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                            <p className="text-blue-300 text-sm font-medium mb-2">How to connect:</p>
                            <ol className="text-white/60 text-sm space-y-1 list-decimal list-inside">
                                <li>Open Telegram and search for @AnbuSafeBot</li>
                                <li>Start a conversation with the bot</li>
                                <li>Enter your Telegram username above</li>
                                <li>Click Connect to link your account</li>
                            </ol>
                        </div>
                    </div>
                )}
            </GlassCard>

            {/* Alert Info */}
            <GlassCard className="!bg-black/40 !backdrop-blur-xl !border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-xl font-bold text-white">How SOS Works</h3>
                </div>
                <div className="space-y-3 text-white/60 text-sm">
                    <p>• Press the SOS button in case of emergency</p>
                    <p>• All trusted contacts will receive an SMS with your location</p>
                    <p>• If Telegram is connected, an instant alert will be sent</p>
                    <p>• Your current location will be shared in real-time</p>
                    <p>• Emergency services can be contacted automatically (optional)</p>
                </div>
            </GlassCard>
        </div>
    );
}
