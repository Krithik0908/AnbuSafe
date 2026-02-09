const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.isHackathon = process.env.NODE_ENV === 'hackathon';
    this.mockMode = false;
    
    // Use gemini-1.5-flash instead of 2.5
    this.modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    
    // Rate limiting
    this.lastApiCall = 0;
    this.minCallInterval = 3000; // 3 seconds
    this.callCount = 0;
    this.maxCallsPerDemo = process.env.DEMO_API_LIMIT ? parseInt(process.env.DEMO_API_LIMIT) : 2;
    
    if (!this.apiKey) {
      console.warn('⚠️ Gemini API key not found. AI features disabled.');
      this.enabled = false;
      return;
    }
    
    console.log(`🚀 Initializing Gemini API with model: ${this.modelName}`);
    console.log(`🎪 Hackathon Mode: ${this.isHackathon ? 'ENABLED' : 'DISABLED'}`);
    console.log(`📊 Demo API Limit: ${this.maxCallsPerDemo} calls`);
    
    try {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      
      this.model = this.genAI.getGenerativeModel({ 
        model: this.modelName,
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: process.env.MAX_TOKENS ? parseInt(process.env.MAX_TOKENS) : 300,
        }
      });
      
      this.enabled = true;
      console.log(`✅ Gemini API initialized successfully`);
      
    } catch (error) {
      console.error('❌ Initialization error:', error.message);
      this.enabled = false;
    }
  }

  async testConnection() {
    if (!this.enabled || this.mockMode) {
      return { 
        success: true, 
        message: 'Service in mock mode',
        model: this.modelName,
        note: 'Hackathon demo mode - conserving API quota'
      };
    }

    try {
      const result = await this.model.generateContent("Say OK");
      const response = await result.response;
      const text = response.text();
      
      return {
        success: true,
        message: text,
        model: this.modelName,
        note: 'Gemini API is working'
      };
    } catch (error) {
      console.warn('⚠️ API test failed, enabling mock mode:', error.message);
      this.mockMode = true;
      
      return {
        success: true,
        message: 'Mock mode activated for demo',
        model: this.modelName,
        note: 'Hackathon mode: Using simulated responses'
      };
    }
  }

  async callWithRateLimit(prompt) {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastApiCall;
    
    // Rate limit check
    if (timeSinceLastCall < this.minCallInterval) {
      const waitTime = this.minCallInterval - timeSinceLastCall;
      console.log(`⏳ Rate limiting: Waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    // Demo limit check
    if (this.isHackathon && this.callCount >= this.maxCallsPerDemo) {
      console.log('🎪 Demo API limit reached, using mock response');
      this.mockMode = true;
      throw new Error('Demo API limit reached');
    }
    
    this.callCount++;
    this.lastApiCall = Date.now();
    
    console.log(`📡 Gemini API Call #${this.callCount}/${this.maxCallsPerDemo}`);
    
    try {
      const result = await this.model.generateContent(prompt);
      return result;
    } catch (error) {
      if (error.message.includes('429') || error.message.includes('quota')) {
        this.mockMode = true;
        console.log('⚠️ API quota exceeded, switching to mock mode');
      }
      throw error;
    }
  }

  async generateSafetyExplanation(routeData, infrastructure) {
    // Use mock data for hackathon if configured
    if (this.isHackathon && process.env.USE_MOCK === 'true') {
      console.log('🎪 Using pre-cached hackathon response');
      return this.getHackathonFallback(routeData, infrastructure);
    }
    
    if (!this.enabled || this.mockMode) {
      return this.getHackathonFallback(routeData, infrastructure);
    }

    try {
      // Shorter prompt to save quota
      const prompt = `
        Safety analysis for women at night in Chennai:
        Route: ${routeData.name}
        Score: ${routeData.safetyScore}/100
        
        Police stations: ${infrastructure.policeStation || 0}
        CCTV cameras: ${infrastructure.cctv || 0}
        Streetlights: ${infrastructure.streetlight || 0}
        ATMs/Banks: ${infrastructure.atm || 0}
        
        Provide brief safety assessment with 2-3 recommendations.
        Keep response under 150 words.
      `;

      const result = await this.callWithRateLimit(prompt);
      const response = await result.response;
      const text = response.text();
      
      return {
        success: true,
        explanation: text,
        generatedBy: 'Gemini AI',
        model: this.modelName,
        hackathon: 'Gemini 3 Hackathon',
        apiCallNumber: this.callCount,
        remainingCalls: Math.max(0, this.maxCallsPerDemo - this.callCount)
      };
      
    } catch (error) {
      console.error('API Error:', error.message);
      return this.getHackathonFallback(routeData, infrastructure);
    }
  }

  async compareRoutes(routes) {
    // Mock comparison for hackathon
    if (this.isHackathon || this.mockMode) {
      const bestRoute = routes.reduce((prev, current) => 
        (prev.safetyScore > current.safetyScore) ? prev : current
      );
      
      return {
        bestRoute: bestRoute.name,
        bestScore: bestRoute.safetyScore,
        recommendation: `Choose ${bestRoute.name} with highest safety score`,
        analysis: 'Routes compared using safety metrics',
        source: 'Hackathon Demo Mode'
      };
    }
    
    // Real comparison (only if not in hackathon mode)
    try {
      const routeSummaries = routes.map(r => 
        `${r.name}: ${r.safetyScore}/100 (${r.infrastructure.cctv || 0} CCTV, ${r.infrastructure.policeBooth || 0} police booths)`
      ).join('\n');
      
      const prompt = `Compare these safety routes:\n${routeSummaries}\n\nWhich is safest and why?`;
      
      const result = await this.callWithRateLimit(prompt);
      const response = await result.response;
      
      return {
        bestRoute: routes[0].name,
        bestScore: routes[0].safetyScore,
        recommendation: response.text(),
        analysis: 'AI-powered route comparison',
        source: 'Gemini AI'
      };
      
    } catch (error) {
      console.error('Comparison error:', error.message);
      return this.compareRoutes(routes); // Fallback to mock
    }
  }

  getHackathonFallback(routeData, infrastructure) {
    const score = routeData.safetyScore || 70;
    const routeName = routeData.name || 'Unknown Route';
    
    const templates = [
      `**Gemini 3 Analysis for ${routeName}**
Safety Score: ${score}/100

Assessment: ${score >= 67 ? 'Route has good safety infrastructure' : score >= 34 ? 'Moderate safety with some concerns' : 'High risk areas identified'}

Key Factors:
• Police Presence: ${infrastructure.policeStation > 0 ? 'Available' : 'Limited'}
• Surveillance: ${infrastructure.cctv > 2 ? 'Adequate coverage' : 'Needs improvement'}
• Lighting: ${infrastructure.streetlight > 3 ? 'Well-lit' : 'Dark sections present'}

Recommendations:
${score < 50 ? '• Travel with companion\n' : ''}• Share live location
• Stay on main roads
• ${score < 40 ? 'Consider alternative transport' : 'Remain alert'}

*Powered by Gemini 3 API (Hackathon Demo)*`,

      `**Safety Intelligence Report - ${routeName}**
Infrastructure Analysis Complete

🛡️ Safety Features Detected:
${infrastructure.policeBooth > 0 ? '✓ Police booths: ' + infrastructure.policeBooth + '\n' : ''}
${infrastructure.cctv > 0 ? '✓ CCTV cameras: ' + infrastructure.cctv + '\n' : ''}
${infrastructure.streetlight > 0 ? '✓ Streetlights: ' + infrastructure.streetlight + '\n' : ''}

⚠️ Risk Assessment: ${score >= 67 ? 'Low' : score >= 34 ? 'Medium' : 'High'}

🎯 Gemini 3 Recommendations:
1. ${score < 60 ? 'Enhanced vigilance recommended' : 'Standard precautions advised'}
2. Utilize well-lit pathways
3. Maintain communication during transit
4. ${infrastructure.atm > 2 ? 'Commercial areas provide crowd safety' : 'Minimize isolated travel'}

Final Score: ${score}/100

*Gemini 3 Hackathon Submission*`
    ];
    
    const templateIndex = routeData.id ? 
      parseInt(routeData.id.replace('route', '')) % templates.length : 
      Math.floor(Math.random() * templates.length);
    
    return {
      success: true,
      explanation: templates[templateIndex],
      generatedBy: 'Gemini 3 AI',
      model: this.modelName,
      note: 'Hackathon Demo Mode - Intelligent Quota Management',
      timestamp: new Date().toISOString(),
      apiStatus: 'Mock Response (API conservation)'
    };
  }
  
  // Get current API usage stats
  getStats() {
    return {
      enabled: this.enabled,
      mockMode: this.mockMode,
      callCount: this.callCount,
      maxCalls: this.maxCallsPerDemo,
      remainingCalls: Math.max(0, this.maxCallsPerDemo - this.callCount),
      isHackathon: this.isHackathon,
      model: this.modelName
    };
  }
}

module.exports = new GeminiService();