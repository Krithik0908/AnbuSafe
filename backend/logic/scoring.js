const fs = require('fs').promises;
const path = require('path');
const {
  normalizeToHundred,
  calculateMaxPossibleScore,
  smoothFeedback,
  adjustForTimeOfDay
} = require('../utils/normalize');
const geminiService = require('../services/geminiService');

// Weight configuration
const WEIGHTS = {
  policeStation: 3,
  policeBooth: 2,
  cctv: 2,
  streetlight: 2,
  atm: 1
};

const MAX_SCORE = 100;
const DECAY_DAYS = 30;

class SafetyScoringEngine {
  constructor() {
    this.feedbackFile = path.join(__dirname, '../data/feedback.json');
    this.routesFile = path.join(__dirname, '../data/demoRoutes.json');
    this.aiEnabled = geminiService.enabled;
    console.log(`AI Features: ${this.aiEnabled ? '✅ Enabled' : '❌ Disabled'}`);
  }

  calculateBaseScore(infrastructure) {
    let rawScore = 0;
    
    Object.keys(infrastructure).forEach(key => {
      if (WEIGHTS[key]) {
        rawScore += infrastructure[key] * WEIGHTS[key];
      }
    });
    
    const maxRawScore = calculateMaxPossibleScore();
    return normalizeToHundred(rawScore, 0, maxRawScore);
  }

  getTimeDecayFactor(feedbackDate) {
    const now = new Date();
    const diffTime = Math.abs(now - new Date(feedbackDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays >= DECAY_DAYS) return 0;
    return 1 - (diffDays / DECAY_DAYS);
  }

  async calculateAdjustedScore(routeId, baseScore) {
    try {
      const feedbackData = JSON.parse(await fs.readFile(this.feedbackFile, 'utf8'));
      const routeFeedback = feedbackData.filter(fb => fb.routeId === routeId);
      
      if (routeFeedback.length === 0) return baseScore;
      
      const feedbackScores = routeFeedback.map(fb => fb.rating);
      const timestamps = routeFeedback.map(fb => fb.timestamp);
      
      const feedbackAdjustment = smoothFeedback(feedbackScores, timestamps);
      
      let adjustedScore = baseScore + feedbackAdjustment;
      adjustedScore = Math.max(0, Math.min(MAX_SCORE, adjustedScore));
      
      return Math.round(adjustedScore);
    } catch (error) {
      console.error('Error calculating adjusted score:', error);
      return baseScore;
    }
  }

  getSafetyCategory(score) {
    if (score >= 67) return { 
      level: 'safe', 
      color: 'green', 
      label: 'Safe',
      icon: 'check-circle'
    };
    
    if (score >= 34) return { 
      level: 'moderate', 
      color: 'yellow', 
      label: 'Moderate',
      icon: 'alert-circle'
    };
    
    return { 
      level: 'unsafe', 
      color: 'red', 
      label: 'Unsafe',
      icon: 'x-circle'
    };
  }

  // NEW: Get AI explanation for route
  async getRouteExplanation(route) {
    try {
      const explanation = await geminiService.generateSafetyExplanation(
        route,
        route.infrastructureDetails || route.infrastructure
      );
      
      return {
        ...explanation,
        safetyScore: route.safetyScore,
        safetyCategory: route.safetyCategory
      };
    } catch (error) {
      console.error('Error getting route explanation:', error);
      return geminiService.getFallbackExplanation(route, route.infrastructure);
    }
  }

  async getAllRoutes() {
    try {
      const routesData = JSON.parse(await fs.readFile(this.routesFile, 'utf8'));
      
      const routesWithScores = await Promise.all(
        routesData.map(async (route) => {
          const baseScore = this.calculateBaseScore(route.infrastructure);
          const finalScore = await this.calculateAdjustedScore(route.id, baseScore);
          const category = this.getSafetyCategory(finalScore);
          
          const timeAdjustedScore = adjustForTimeOfDay(finalScore);
          
          // Get AI explanation for each route
          const routeWithScore = {
            ...route,
            safetyScore: finalScore,
            timeAdjustedScore: timeAdjustedScore,
            safetyCategory: category,
            infrastructureDetails: route.infrastructure,
            lastUpdated: new Date().toISOString()
          };
          
          const explanation = await this.getRouteExplanation(routeWithScore);
          
          return {
            ...routeWithScore,
            aiExplanation: explanation
          };
        })
      );
      
      return routesWithScores.sort((a, b) => b.safetyScore - a.safetyScore);
    } catch (error) {
      console.error('Error loading routes:', error);
      return [];
    }
  }

  async addFeedback(feedback) {
    try {
      const feedbackData = JSON.parse(await fs.readFile(this.feedbackFile, 'utf8'));
      
      const newFeedback = {
        id: Date.now().toString(),
        ...feedback,
        timestamp: new Date().toISOString()
      };
      
      // Analyze feedback with AI if comments provided
      if (feedback.comments && this.aiEnabled) {
        try {
          const route = await this.getRouteById(feedback.routeId);
          const analysis = await geminiService.analyzeFeedback(feedback.comments, route);
          
          if (analysis.success) {
            newFeedback.aiAnalysis = {
              tags: analysis.tags,
              sentiment: analysis.sentiment,
              insights: analysis.insights,
              generatedBy: analysis.generatedBy
            };
          }
        } catch (aiError) {
          console.error('AI feedback analysis failed:', aiError);
        }
      }
      
      feedbackData.push(newFeedback);
      await fs.writeFile(this.feedbackFile, JSON.stringify(feedbackData, null, 2));
      
      return { 
        success: true, 
        feedbackId: newFeedback.id,
        aiAnalyzed: !!newFeedback.aiAnalysis
      };
    } catch (error) {
      console.error('Error saving feedback:', error);
      return { success: false, error: error.message };
    }
  }

  async getRouteById(routeId) {
    try {
      const routes = await this.getAllRoutes();
      return routes.find(r => r.id === routeId) || null;
    } catch (error) {
      console.error('Error getting route by ID:', error);
      return null;
    }
  }

  // NEW: Compare routes with AI insights
  async compareRoutesWithAI(routeIds) {
    try {
      const routes = await this.getAllRoutes();
      const selectedRoutes = routes.filter(r => routeIds.includes(r.id));
      
      if (selectedRoutes.length < 2) {
        return {
          success: false,
          error: 'Need at least 2 routes to compare'
        };
      }
      
      const comparison = await geminiService.compareRoutes(selectedRoutes);
      
      return {
        success: true,
        routes: selectedRoutes,
        comparison: comparison.comparison,
        generatedBy: comparison.generatedBy,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error comparing routes:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new SafetyScoringEngine();