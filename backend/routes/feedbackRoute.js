const express = require('express');
const router = express.Router();
const scoringEngine = require('../logic/scoring');

// Submit feedback with AI analysis
router.post('/submit', async (req, res) => {
  try {
    const { routeId, rating, issues, comments } = req.body;
    
    if (!routeId || rating === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Route ID and rating are required' 
      });
    }
    
    const validRatings = [-2, 0, 1];
    if (!validRatings.includes(Number(rating))) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid rating. Must be -2, 0, or 1' 
      });
    }
    
    const feedback = {
      routeId,
      rating: Number(rating),
      issues: issues || [],
      comments: comments || ''
    };
    
    const result = await scoringEngine.addFeedback(feedback);
    
    if (result.success) {
      const routes = await scoringEngine.getAllRoutes();
      const updatedRoute = routes.find(r => r.id === routeId);
      
      res.json({
        success: true,
        feedbackId: result.feedbackId,
        message: 'Feedback submitted successfully',
        aiAnalyzed: result.aiAnalyzed || false,
        updatedRoute
      });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ success: false, error: 'Failed to submit feedback' });
  }
});

// Get feedback with AI insights
router.get('/route/:routeId', async (req, res) => {
  try {
    const fs = require('fs').promises;
    const path = require('path');
    
    const feedbackFile = path.join(__dirname, '../data/feedback.json');
    const feedbackData = JSON.parse(await fs.readFile(feedbackFile, 'utf8'));
    
    const routeFeedback = feedbackData.filter(fb => fb.routeId === req.params.routeId);
    
    res.json({
      success: true,
      feedback: routeFeedback,
      count: routeFeedback.length,
      aiEnabled: scoringEngine.aiEnabled
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch feedback' });
  }
});

// NEW: Analyze feedback trends with AI
router.get('/analyze/:routeId', async (req, res) => {
  try {
    const fs = require('fs').promises;
    const path = require('path');
    const geminiService = require('../services/geminiService');
    
    const feedbackFile = path.join(__dirname, '../data/feedback.json');
    const feedbackData = JSON.parse(await fs.readFile(feedbackFile, 'utf8'));
    
    const routeFeedback = feedbackData.filter(fb => fb.routeId === req.params.routeId);
    
    if (routeFeedback.length === 0) {
      return res.json({
        success: true,
        analysis: 'No feedback available for analysis',
        count: 0
      });
    }
    
    // Combine all comments for AI analysis
    const allComments = routeFeedback
      .map(fb => fb.comments)
      .filter(comment => comment && comment.trim())
      .join('. ');
    
    const routes = await scoringEngine.getAllRoutes();
    const route = routes.find(r => r.id === req.params.routeId);
    
    let aiAnalysis = null;
    if (allComments && geminiService.enabled) {
      aiAnalysis = await geminiService.analyzeFeedback(allComments, route || {});
    }
    
    // Calculate statistics
    const safeCount = routeFeedback.filter(fb => fb.rating === 1).length;
    const okayCount = routeFeedback.filter(fb => fb.rating === 0).length;
    const unsafeCount = routeFeedback.filter(fb => fb.rating === -2).length;
    
    res.json({
      success: true,
      count: routeFeedback.length,
      statistics: {
        safe: Math.round((safeCount / routeFeedback.length) * 100),
        okay: Math.round((okayCount / routeFeedback.length) * 100),
        unsafe: Math.round((unsafeCount / routeFeedback.length) * 100)
      },
      aiAnalysis: aiAnalysis || { 
        message: 'AI analysis unavailable or no comments to analyze' 
      },
      recentFeedback: routeFeedback.slice(-5) // Last 5 feedbacks
    });
  } catch (error) {
    console.error('Error analyzing feedback:', error);
    res.status(500).json({ success: false, error: 'Failed to analyze feedback' });
  }
});

module.exports = router;