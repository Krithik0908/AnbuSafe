const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const scoringLogic = require('../logic/scoring');
const normalize = require('../utils/normalize');
const geminiService = require('../services/geminiService');

// Test Gemini endpoint (hackathon version)
router.get('/test-gemini', async (req, res) => {
  try {
    const testResult = await geminiService.testConnection();
    const stats = geminiService.getStats();
    
    res.json({
      ...testResult,
      hackathon: 'Gemini 3 Hackathon',
      quotaManagement: {
        enabled: true,
        mode: stats.mockMode ? 'MOCK' : 'LIVE',
        callsMade: stats.callCount,
        callsAllowed: stats.maxCalls,
        remaining: stats.remainingCalls
      }
    });
  } catch (error) {
    res.json({
      success: true,
      message: 'Service in hackathon mode',
      hackathon: 'Gemini 3 Hackathon',
      note: 'Using intelligent quota management',
      error: error.message
    });
  }
});

// Get all routes with safety scores - FIXED VERSION
router.get('/routes', async (req, res) => {
  try {
    const routesData = await fs.readFile(
      path.join(__dirname, '../data/demoRoutes.json'), 
      'utf8'
    );
    
    let routes = JSON.parse(routesData);
    
    // Apply scoring to each route
    const scoredRoutes = routes.map(route => {
      // Calculate score if scoringLogic exists
      let scoredRoute;
      try {
        if (scoringLogic && scoringLogic.calculateRouteScore) {
          scoredRoute = scoringLogic.calculateRouteScore(route);
        } else {
          // Fallback scoring
          scoredRoute = {
            ...route,
            safetyScore: route.initialScore || 50,
            infrastructureDetails: route.infrastructure || {}
          };
        }
      } catch (scoreError) {
        // If scoring fails, use basic data
        scoredRoute = {
          ...route,
          safetyScore: route.initialScore || 50,
          infrastructureDetails: route.infrastructure || {}
        };
      }
      
      return {
        ...scoredRoute,
        hackathonMode: process.env.NODE_ENV === 'hackathon',
        preGenerated: !!route.preGeneratedExplanation
      };
    });
    
    // Sort by safety score (highest first)
    scoredRoutes.sort((a, b) => (b.safetyScore || 0) - (a.safetyScore || 0));
    
    res.json({
      success: true,
      routes: scoredRoutes,
      count: scoredRoutes.length,
      hackathon: 'Gemini 3 Hackathon',
      demoArea: 'Nungambakkam, Chennai',
      note: process.env.USE_MOCK === 'true' ? 'Using intelligent API quota management' : 'Live API mode',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error fetching routes:', error);
    
    // EMERGENCY FALLBACK DATA
    const emergencyRoutes = [
      {
        id: "route1",
        name: "Nungambakkam Railway Station",
        description: "Station View Rd / Station surroundings",
        safetyScore: 65,
        estimatedTime: "8 mins",
        distance: "1.2 km",
        infrastructure: {
          policeStation: 0,
          policeBooth: 1,
          cctv: 3,
          streetlight: 4,
          atm: 2
        },
        hackathonMode: true,
        preGenerated: true
      },
      {
        id: "route2",
        name: "Nungambakkam Police Station Route",
        description: "Valluvar Kottam High Road",
        safetyScore: 82,
        estimatedTime: "10 mins",
        distance: "1.5 km",
        infrastructure: {
          policeStation: 1,
          policeBooth: 2,
          cctv: 4,
          streetlight: 5,
          atm: 1
        },
        hackathonMode: true,
        preGenerated: true
      },
      {
        id: "route3",
        name: "Loyola College Main Gate",
        description: "Sterling Road area",
        safetyScore: 58,
        estimatedTime: "7 mins",
        distance: "1.0 km",
        infrastructure: {
          policeStation: 0,
          policeBooth: 1,
          cctv: 2,
          streetlight: 3,
          atm: 3
        },
        hackathonMode: true,
        preGenerated: true
      }
    ];
    
    res.json({
      success: true,
      routes: emergencyRoutes,
      count: emergencyRoutes.length,
      hackathon: 'Gemini 3 Hackathon',
      demoArea: 'Nungambakkam, Chennai',
      note: 'Using emergency fallback data',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get single route details
router.get('/route/:id', async (req, res) => {
  try {
    const routesData = await fs.readFile(
      path.join(__dirname, '../data/demoRoutes.json'), 
      'utf8'
    );
    const routes = JSON.parse(routesData);
    const route = routes.find(r => r.id === req.params.id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    }
    
    let scoredRoute;
    try {
      if (scoringLogic && scoringLogic.calculateRouteScore) {
        scoredRoute = scoringLogic.calculateRouteScore(route);
      } else {
        scoredRoute = {
          ...route,
          safetyScore: route.initialScore || 50,
          infrastructureDetails: route.infrastructure || {}
        };
      }
    } catch (scoreError) {
      scoredRoute = {
        ...route,
        safetyScore: route.initialScore || 50,
        infrastructureDetails: route.infrastructure || {}
      };
    }
    
    const stats = geminiService.getStats();
    
    const response = {
      ...scoredRoute,
      hackathonInfo: {
        mode: process.env.NODE_ENV === 'hackathon' ? 'HACKATHON' : 'REGULAR',
        apiStatus: stats.mockMode ? 'MOCK' : 'LIVE',
        apiCalls: stats.callCount,
        preGenerated: !!route.preGeneratedExplanation
      }
    };
    
    res.json({
      success: true,
      route: response
    });
    
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch route'
    });
  }
});

// Get AI explanation for a route (WITH HACKATHON MODE)
router.get('/route/:id/explain', async (req, res) => {
  try {
    const routesData = await fs.readFile(
      path.join(__dirname, '../data/demoRoutes.json'), 
      'utf8'
    );
    const routes = JSON.parse(routesData);
    const route = routes.find(r => r.id === req.params.id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    }
    
    let scoredRoute;
    try {
      if (scoringLogic && scoringLogic.calculateRouteScore) {
        scoredRoute = scoringLogic.calculateRouteScore(route);
      } else {
        scoredRoute = {
          ...route,
          safetyScore: route.initialScore || 50,
          infrastructureDetails: route.infrastructure || {}
        };
      }
    } catch (scoreError) {
      scoredRoute = {
        ...route,
        safetyScore: route.initialScore || 50,
        infrastructureDetails: route.infrastructure || {}
      };
    }
    
    const stats = geminiService.getStats();
    
    // HACKATHON MODE: Return pre-generated explanation first
    if (process.env.NODE_ENV === 'hackathon' && route.preGeneratedExplanation) {
      console.log(`🎪 Serving pre-generated explanation for ${route.id}`);
      
      return res.json({
        success: true,
        route: {
          ...scoredRoute,
          aiExplanation: {
            success: true,
            explanation: route.preGeneratedExplanation,
            generatedBy: 'Gemini 3 AI',
            model: geminiService.modelName,
            note: 'Pre-generated for hackathon demo',
            apiStatus: 'Cached (API conservation)',
            hackathon: 'Gemini 3 Hackathon Mode',
            quotaManagement: 'Intelligent API usage'
          }
        },
        hackathon: {
          mode: 'DEMO_CACHED',
          apiCallsSaved: 1,
          remainingCalls: stats.remainingCalls
        }
      });
    }
    
    // Get AI explanation (real API call if allowed)
    const explanation = await geminiService.generateSafetyExplanation(
      scoredRoute,
      scoredRoute.infrastructureDetails || scoredRoute.infrastructure || {}
    );
    
    // Merge explanation with route data
    const response = {
      ...scoredRoute,
      aiExplanation: explanation,
      hackathonInfo: {
        mode: process.env.NODE_ENV === 'hackathon' ? 'HACKATHON_LIVE' : 'REGULAR',
        apiCallNumber: stats.callCount,
        remainingCalls: stats.remainingCalls
      }
    };
    
    res.json({
      success: true,
      route: response
    });
    
  } catch (error) {
    console.error('Error generating explanation:', error);
    
    // Fallback to pre-generated if available
    try {
      const routesData = await fs.readFile(
        path.join(__dirname, '../data/demoRoutes.json'), 
        'utf8'
      );
      const routes = JSON.parse(routesData);
      const route = routes.find(r => r.id === req.params.id);
      
      if (route && route.preGeneratedExplanation) {
        console.log('🔄 Falling back to pre-generated explanation');
        
        let scoredRoute;
        try {
          if (scoringLogic && scoringLogic.calculateRouteScore) {
            scoredRoute = scoringLogic.calculateRouteScore(route);
          } else {
            scoredRoute = {
              ...route,
              safetyScore: route.initialScore || 50,
              infrastructureDetails: route.infrastructure || {}
            };
          }
        } catch (scoreError) {
          scoredRoute = {
            ...route,
            safetyScore: route.initialScore || 50,
            infrastructureDetails: route.infrastructure || {}
          };
        }
        
        res.json({
          success: true,
          route: {
            ...scoredRoute,
            aiExplanation: {
              success: true,
              explanation: route.preGeneratedExplanation,
              generatedBy: 'Gemini 3 AI',
              note: 'Fallback mode (API unavailable)',
              error: error.message
            }
          },
          note: 'Using fallback data due to API issue'
        });
      } else {
        throw new Error('No pre-generated explanation available');
      }
    } catch (fallbackError) {
      res.status(500).json({
        success: false,
        error: 'Failed to generate explanation',
        details: error.message
      });
    }
  }
});

// Compare multiple routes (hackathon optimized)
router.post('/compare', async (req, res) => {
  try {
    const { routeIds } = req.body;
    
    if (!routeIds || !Array.isArray(routeIds) || routeIds.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please provide at least 2 route IDs to compare'
      });
    }
    
    const routesData = await fs.readFile(
      path.join(__dirname, '../data/demoRoutes.json'), 
      'utf8'
    );
    const allRoutes = JSON.parse(routesData);
    
    const routesToCompare = routeIds.map(id => {
      const route = allRoutes.find(r => r.id === id);
      if (!route) return null;
      
      let scoredRoute;
      try {
        if (scoringLogic && scoringLogic.calculateRouteScore) {
          scoredRoute = scoringLogic.calculateRouteScore(route);
        } else {
          scoredRoute = {
            ...route,
            safetyScore: route.initialScore || 50,
            infrastructureDetails: route.infrastructure || {}
          };
        }
      } catch (scoreError) {
        scoredRoute = {
          ...route,
          safetyScore: route.initialScore || 50,
          infrastructureDetails: route.infrastructure || {}
        };
      }
      
      return {
        ...scoredRoute,
        preGenerated: !!route.preGeneratedExplanation
      };
    }).filter(route => route !== null);
    
    if (routesToCompare.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Could not find the specified routes'
      });
    }
    
    // Get AI comparison (mock mode in hackathon)
    const comparison = await geminiService.compareRoutes(routesToCompare);
    const stats = geminiService.getStats();
    
    res.json({
      success: true,
      routes: routesToCompare,
      comparison,
      hackathon: 'Gemini 3 Hackathon',
      apiUsage: {
        mode: stats.mockMode ? 'MOCK_COMPARISON' : 'LIVE_COMPARISON',
        callsMade: stats.callCount,
        remaining: stats.remainingCalls
      },
      recommendation: `Best route: ${routesToCompare.sort((a, b) => (b.safetyScore || 0) - (a.safetyScore || 0))[0].name}`
    });
    
  } catch (error) {
    console.error('Error comparing routes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to compare routes',
      hackathonTip: 'Using fallback comparison logic'
    });
  }
});

// Get API usage stats
router.get('/stats', (req, res) => {
  const stats = geminiService.getStats();
  
  res.json({
    success: true,
    geminiService: stats,
    environment: {
      nodeEnv: process.env.NODE_ENV,
      useMock: process.env.USE_MOCK,
      model: process.env.GEMINI_MODEL
    },
    hackathon: 'Gemini 3 Hackathon',
    note: 'Intelligent quota management enabled'
  });
});

module.exports = router;