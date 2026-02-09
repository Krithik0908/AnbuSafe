/**
 * Utility functions for normalizing safety scores and data
 */

/**
 * Normalize a value to a 0-100 scale
 * @param {number} value - The raw value to normalize
 * @param {number} min - Minimum possible value
 * @param {number} max - Maximum possible value
 * @returns {number} Normalized score (0-100)
 */
const normalizeToHundred = (value, min, max) => {
  if (max === min) return 50; // Default middle value if no range
  
  const normalized = ((value - min) / (max - min)) * 100;
  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, Math.round(normalized)));
};

/**
 * Calculate maximum possible infrastructure score
 * @returns {number} Maximum possible raw score
 */
const calculateMaxPossibleScore = () => {
  // Define maximum possible counts for each infrastructure type
  const maxCounts = {
    policeStation: 3,    // Maximum 3 police stations on a route
    policeBooth: 4,      // Maximum 4 police booths
    cctv: 8,             // Maximum 8 CCTV cameras
    streetlight: 10,     // Maximum 10 streetlights
    atm: 8               // Maximum 8 ATMs/Banks
  };

  const weights = {
    policeStation: 3,
    policeBooth: 2,
    cctv: 2,
    streetlight: 2,
    atm: 1
  };

  let maxScore = 0;
  Object.keys(maxCounts).forEach(key => {
    maxScore += maxCounts[key] * weights[key];
  });

  return maxScore;
};

/**
 * Normalize infrastructure counts to a standardized scale
 * @param {Object} infrastructure - Raw infrastructure counts
 * @returns {Object} Normalized infrastructure percentages
 */
const normalizeInfrastructure = (infrastructure) => {
  const maxCounts = {
    policeStation: 3,
    policeBooth: 4,
    cctv: 8,
    streetlight: 10,
    atm: 8
  };

  const normalized = {};
  Object.keys(infrastructure).forEach(key => {
    if (maxCounts[key]) {
      normalized[key] = Math.round((infrastructure[key] / maxCounts[key]) * 100);
    }
  });

  return normalized;
};

/**
 * Smooth feedback scores using weighted moving average
 * @param {Array} feedbackScores - Array of feedback scores
 * @param {Array} timestamps - Corresponding timestamps
 * @returns {number} Smoothed score
 */
const smoothFeedback = (feedbackScores, timestamps) => {
  if (feedbackScores.length === 0) return 0;

  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  
  let totalWeight = 0;
  let weightedSum = 0;

  feedbackScores.forEach((score, index) => {
    const timestamp = new Date(timestamps[index]).getTime();
    const daysAgo = (now - timestamp) / oneDay;
    
    // Weight decays linearly over 30 days
    const weight = Math.max(0, 1 - (daysAgo / 30));
    
    weightedSum += score * weight;
    totalWeight += weight;
  });

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
};

/**
 * Adjust score based on time of day
 * @param {number} baseScore - Original safety score
 * @param {Date} travelTime - Time of travel
 * @returns {number} Time-adjusted score
 */
const adjustForTimeOfDay = (baseScore, travelTime = new Date()) => {
  const hour = travelTime.getHours();
  
  // Penalty factor for nighttime (10 PM to 5 AM)
  if (hour >= 22 || hour < 5) {
    // Reduce score by 15% during night
    return Math.round(baseScore * 0.85);
  }
  
  // Bonus for daytime (8 AM to 6 PM)
  if (hour >= 8 && hour < 18) {
    // Increase score by 5% during day
    return Math.round(Math.min(100, baseScore * 1.05));
  }
  
  return baseScore;
};

/**
 * Normalize route comparison scores for ranking
 * @param {Array} routes - Array of route objects
 * @param {string} criteria - 'safety', 'time', or 'distance'
 * @returns {Array} Routes with normalized scores for the criteria
 */
const normalizeForComparison = (routes, criteria = 'safety') => {
  if (routes.length === 0) return routes;
  
  // Extract values for normalization
  const values = routes.map(route => {
    switch (criteria) {
      case 'time':
        // Extract minutes from "8 mins" string
        return parseInt(route.estimatedTime) || 0;
      case 'distance':
        // Extract km from "1.2 km" string
        return parseFloat(route.distance) || 0;
      case 'safety':
      default:
        return route.safetyScore || 0;
    }
  });
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  // Normalize each route
  return routes.map((route, index) => {
    const value = values[index];
    const normalizedScore = normalizeToHundred(value, min, max);
    
    return {
      ...route,
      [`${criteria}Normalized`]: normalizedScore
    };
  });
};

/**
 * Calculate composite score from multiple normalized scores
 * @param {Object} scores - Object with different normalized scores
 * @param {Object} weights - Weights for each score (must sum to 1)
 * @returns {number} Composite score (0-100)
 */
const calculateCompositeScore = (scores, weights = {
  safety: 0.7,
  time: 0.2,
  distance: 0.1
}) => {
  let composite = 0;
  let totalWeight = 0;
  
  Object.keys(weights).forEach(key => {
    if (scores[key] !== undefined) {
      composite += scores[key] * weights[key];
      totalWeight += weights[key];
    }
  });
  
  // If weights don't sum to 1, adjust
  if (totalWeight > 0 && totalWeight !== 1) {
    composite /= totalWeight;
  }
  
  return Math.round(composite);
};

module.exports = {
  normalizeToHundred,
  calculateMaxPossibleScore,
  normalizeInfrastructure,
  smoothFeedback,
  adjustForTimeOfDay,
  normalizeForComparison,
  calculateCompositeScore
};