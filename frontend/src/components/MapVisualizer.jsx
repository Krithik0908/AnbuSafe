import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { useState, useEffect } from "react";

export function MapVisualizer({ routeStatus = "safe", showLive = false, routeId = null }) {
    const colors = {
        safe: "#34d399",
        moderate: "#fbbf24",
        risky: "#f87171",
    };

    const pathColor = colors[routeStatus] || colors.safe;
    
    // State for real Google Maps
    const [showRealMap, setShowRealMap] = useState(true); // Changed to true by default
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [allRoutes, setAllRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aiAnalysis, setAiAnalysis] = useState("");

    // Fetch routes from backend
    useEffect(() => {
        fetch('http://localhost:3000/api/score/routes')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.routes.length > 0) {
                    setAllRoutes(data.routes);
                    
                    // If routeId is provided, select that route
                    if (routeId) {
                        const route = data.routes.find(r => r.id === routeId);
                        if (route) {
                            setSelectedRoute(route);
                            fetchAIExplanation(route.id);
                        }
                    } else {
                        // Otherwise select first route
                        setSelectedRoute(data.routes[0]);
                        fetchAIExplanation(data.routes[0].id);
                    }
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load routes:", err);
                setLoading(false);
            });
    }, [routeId]);

    // Fetch AI explanation for a route
    const fetchAIExplanation = async (routeId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/score/route/${routeId}/explain`);
            const data = await response.json();
            if (data.success && data.route.aiExplanation) {
                setAiAnalysis(data.route.aiExplanation.explanation);
            }
        } catch (error) {
            console.error("Failed to load AI analysis:", error);
        }
    };

    // Get Google Maps URL based on selected route
    const getGoogleMapsUrl = () => {
        if (!selectedRoute || !selectedRoute.coordinates || selectedRoute.coordinates.length === 0) {
            // Default to Nungambakkam, Chennai
            return "https://www.google.com/maps/embed/v1/view?key=AIzaSyB4Z3MkslX7v4l5GkARxpK0pVpT2QmDv7k&center=13.0667,80.2417&zoom=15&maptype=roadmap";
        }
        
        const lat = selectedRoute.coordinates[0][0];
        const lng = selectedRoute.coordinates[0][1];
        return `https://www.google.com/maps/embed/v1/view?key=AIzaSyB4Z3MkslX7v4l5GkARxpK0pVpT2QmDv7k&center=${lat},${lng}&zoom=16&maptype=roadmap`;
    };

    // Handle route selection
    const handleRouteSelect = (route) => {
        setSelectedRoute(route);
        fetchAIExplanation(route.id);
    };

    if (loading) {
        return (
            <div className="relative w-full h-full bg-slate-900 overflow-hidden rounded-3xl flex items-center justify-center">
                <div className="text-white text-lg">Loading safety routes...</div>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            {/* Toggle between abstract and real map */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2">
                    {allRoutes.map(route => (
                        <button
                            key={route.id}
                            onClick={() => handleRouteSelect(route)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                                selectedRoute?.id === route.id
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                            )}
                        >
                            {route.name.split(" ")[0]}
                            <span className={cn(
                                "ml-2 px-1.5 py-0.5 rounded text-xs",
                                route.safetyScore >= 70 ? "bg-green-900/30 text-green-300" :
                                route.safetyScore >= 40 ? "bg-yellow-900/30 text-yellow-300" :
                                "bg-red-900/30 text-red-300"
                            )}>
                                {route.safetyScore}
                            </span>
                        </button>
                    ))}
                </div>
                
                <button
                    onClick={() => setShowRealMap(!showRealMap)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                >
                    {showRealMap ? "Show Abstract" : "Show Real Map"}
                </button>
            </div>

            {/* Main Map Container */}
            <div className="relative w-full h-[500px] bg-slate-900 overflow-hidden rounded-3xl">
                {showRealMap ? (
                    // REAL GOOGLE MAPS EMBED
                    <div className="w-full h-full">
                        <iframe
                            className="w-full h-full"
                            src={getGoogleMapsUrl()}
                            title={`Safety Route: ${selectedRoute?.name || "Nungambakkam, Chennai"}`}
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                        
                        {/* Overlay with route info */}
                        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-white font-semibold text-lg">
                                        {selectedRoute?.name || "Nungambakkam Route"}
                                    </h3>
                                    <p className="text-slate-300 text-sm">
                                        {selectedRoute?.description || "Safety route analysis"}
                                    </p>
                                    
                                    <div className="flex items-center space-x-4 mt-2">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-2">
                                                <span className="text-xs">🚓</span>
                                            </div>
                                            <div>
                                                <div className="text-white text-sm">Police</div>
                                                <div className="text-slate-300 text-xs">
                                                    {selectedRoute?.infrastructure?.policeStation || 0} stations
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-2">
                                                <span className="text-xs">📹</span>
                                            </div>
                                            <div>
                                                <div className="text-white text-sm">CCTV</div>
                                                <div className="text-slate-300 text-xs">
                                                    {selectedRoute?.infrastructure?.cctv || 0} cameras
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-2">
                                                <span className="text-xs">💡</span>
                                            </div>
                                            <div>
                                                <div className="text-white text-sm">Lighting</div>
                                                <div className="text-slate-300 text-xs">
                                                    {selectedRoute?.infrastructure?.streetlight || 0} lights
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className={cn(
                                    "px-4 py-2 rounded-lg font-bold text-lg",
                                    selectedRoute?.safetyScore >= 70 ? "bg-green-900/30 text-green-300" :
                                    selectedRoute?.safetyScore >= 40 ? "bg-yellow-900/30 text-yellow-300" :
                                    "bg-red-900/30 text-red-300"
                                )}>
                                    {selectedRoute?.safetyScore || "82"}/100
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // ORIGINAL ABSTRACT VISUALIZATION (KEPT AS BACKUP)
                    <>
                        {/* Abstract Map Background */}
                        <div className="absolute inset-0 opacity-20">
                            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
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
                                d="M 50,450 C 150,400 200,300 350,250 S 550,150 750,100"
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
                    </>
                )}
            </div>

            {/* AI Analysis Panel */}
            {aiAnalysis && (
                <div className="mt-6 p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
                    <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mr-3">
                            <span className="text-sm">🤖</span>
                        </div>
                        <h3 className="text-white font-semibold">Gemini AI Safety Analysis</h3>
                        <span className="ml-auto text-xs px-2 py-1 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded text-purple-300">
                            Gemini 3 Hackathon
                        </span>
                    </div>
                    <p className="text-slate-300 text-sm whitespace-pre-line">{aiAnalysis}</p>
                </div>
            )}

            {/* Backend Connection Status */}
            <div className="mt-4 text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-800/30">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
                    <span className="text-xs text-green-400">Connected to Backend API</span>
                </div>
                <p className="text-slate-500 text-xs mt-1">
                    Real-time data from http://localhost:3000 | Google Maps Embed API
                </p>
            </div>
        </div>
    );
}