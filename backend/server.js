require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Debug: Check if .env loaded
console.log('='.repeat(60));
console.log('🔍 ENVIRONMENT CHECK:');
console.log('   PORT:', process.env.PORT || 'Not set (using 3000)');
console.log('   GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✓ Present' : '✗ MISSING');
console.log('   GEMINI_MODEL:', process.env.GEMINI_MODEL || 'Not set');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'Not set');
console.log('   USE_MOCK:', process.env.USE_MOCK || 'Not set');
console.log('='.repeat(60));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Import routes
const scoreRoutes = require('./routes/scoreRoute');
const feedbackRoutes = require('./routes/feedbackRoute');

// API Routes
app.use('/api/score', scoreRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check
app.get('/api/health', (req, res) => {
  let aiEnabled = false;
  let modelName = 'Not configured';
  let mockMode = false;
  let callCount = 0;
  
  try {
    const geminiService = require('./services/geminiService');
    aiEnabled = geminiService.enabled;
    modelName = geminiService.modelName || 'Unknown';
    mockMode = geminiService.mockMode || false;
    callCount = geminiService.callCount || 0;
  } catch (error) {
    // Service might not be loaded yet
  }
  
  res.json({
    success: true,
    status: 'ok',
    message: 'AnbuSafe API Server',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    features: {
      aiEnabled: aiEnabled,
      aiMode: mockMode ? 'MOCK' : 'LIVE',
      apiCalls: callCount,
      routeScoring: true,
      feedbackSystem: true,
      safetyExplanations: true
    },
    hackathon: {
      name: 'Gemini 3 Hackathon Submission',
      mode: process.env.NODE_ENV === 'hackathon' ? 'HACKATHON' : 'REGULAR',
      quotaManagement: 'Intelligent API usage enabled',
      demoArea: 'Nungambakkam, Chennai'
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  let aiEnabled = false;
  let modelName = 'Not configured';
  let mockMode = false;
  let callCount = 0;
  let remainingCalls = 0;
  
  try {
    const geminiService = require('./services/geminiService');
    aiEnabled = geminiService.enabled;
    modelName = geminiService.modelName || 'Unknown';
    mockMode = geminiService.mockMode || false;
    callCount = geminiService.callCount || 0;
    const maxCalls = geminiService.maxCallsPerDemo || 2;
    remainingCalls = Math.max(0, maxCalls - callCount);
  } catch (error) {
    // Ignore if service not ready
  }
  
  res.json({
    success: true,
    message: "🚀 AnbuSafe Women Safety Route API",
    version: "3.0.0",
    description: "AI-powered route safety recommendation for women",
    aiStatus: aiEnabled ? (mockMode ? 'Mock Mode' : 'Active') : 'Disabled',
    aiModel: modelName,
    apiUsage: {
      callsMade: callCount,
      remainingCalls: remainingCalls,
      mode: mockMode ? 'CACHED_RESPONSES' : 'LIVE_API'
    },
    endpoints: {
      health: "GET /api/health",
      routes: "GET /api/score/routes",
      routeDetail: "GET /api/score/route/:id",
      routeExplain: "GET /api/score/route/:id/explain",
      compareRoutes: "POST /api/score/compare",
      submitFeedback: "POST /api/feedback/submit",
      analyzeFeedback: "GET /api/feedback/analyze/:routeId",
      apiStats: "GET /api/score/stats",
      testAI: "GET /api/score/test-gemini"
    },
    hackathon: {
      name: "Gemini 3 Hackathon",
      mode: process.env.NODE_ENV === 'hackathon' ? 'ACTIVE' : 'INACTIVE',
      feature: "Intelligent API Quota Management",
      demoArea: "Nungambakkam, Chennai"
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message,
    hackathonTip: 'Check the AI service status at /api/score/stats'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    requestedUrl: req.originalUrl,
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'GET /api/score/routes',
      'GET /api/score/route/:id',
      'GET /api/score/route/:id/explain',
      'POST /api/score/compare',
      'GET /api/score/stats',
      'GET /api/score/test-gemini',
      'POST /api/feedback/submit'
    ],
    note: 'Gemini 3 Hackathon Project - AnbuSafe Route API'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server started on http://localhost:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔧 Mock Mode: ${process.env.USE_MOCK === 'true' ? 'ENABLED' : 'DISABLED'}`);
  
  // Check Gemini service after server starts
  setTimeout(() => {
    try {
      const geminiService = require('./services/geminiService');
      const status = geminiService.enabled ? 
        (geminiService.mockMode ? '✅ MOCK MODE' : '✅ LIVE API') : 
        '❌ DISABLED';
      
      console.log(`🤖 AI Service: ${status}`);
      
      if (geminiService.enabled) {
        console.log(`   Model: ${geminiService.modelName || 'Unknown'}`);
        console.log(`   Mode: ${geminiService.isHackathon ? 'HACKATHON' : 'REGULAR'}`);
        console.log(`   API Calls Allowed: ${geminiService.maxCallsPerDemo || 2}`);
        
        if (geminiService.mockMode) {
          console.log(`   Note: Using intelligent quota management for hackathon`);
        }
      } else {
        console.log(`   Reason: ${!process.env.GEMINI_API_KEY ? 'Missing API key in .env' : 'API initialization failed'}`);
        console.log(`   Hackathon Mode: Using cached responses for demo`);
      }
    } catch (error) {
      console.log(`🤖 AI Service: ❌ FAILED TO LOAD - ${error.message}`);
      console.log(`   Note: Server will run with fallback responses`);
    }
  }, 500);
  
  console.log(`\n📋 Available Endpoints:`);
  console.log(`   http://localhost:${PORT}/`);
  console.log(`   http://localhost:${PORT}/api/health`);
  console.log(`   http://localhost:${PORT}/api/score/routes`);
  console.log(`   http://localhost:${PORT}/api/score/route/route2/explain`);
  console.log(`   http://localhost:${PORT}/api/score/stats`);
  console.log(`\n📍 Demo Area: Nungambakkam, Chennai`);
  console.log('🎪 Hackathon Mode: INTELLIGENT QUOTA MANAGEMENT ENABLED');
  console.log('='.repeat(60));
  console.log('\n💡 Demo Tips:');
  console.log('   1. First, visit /api/score/routes to see all routes');
  console.log('   2. Try /api/score/route/route2/explain for AI explanation');
  console.log('   3. Check /api/score/stats for API usage info');
  console.log('   4. If API quota hits, system auto-switches to cached responses');
  console.log('='.repeat(60));
});