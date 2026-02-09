require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function listAvailableModels() {
  try {
    console.log('🔍 Fetching available models...');
    
    // Try to list all models first
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`,
      { 
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    
    const data = await response.json();
    console.log('✅ Available models:');
    
    data.models.forEach(model => {
      console.log(`- ${model.name}`);
      console.log(`  Supported methods: ${model.supportedGenerationMethods?.join(', ') || 'None'}`);
    });
    
    // Try common models
    console.log('\n🔧 Testing common models:');
    const commonModels = [
      'gemini-pro',
      'gemini-1.0-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro-latest',
      'gemini-2.0-flash',
      'gemini-2.0-pro',
      'models/gemini-pro',
      'models/gemini-1.0-pro'
    ];
    
    for (const modelName of commonModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say "test"');
        const response = await result.response;
        console.log(`✅ ${modelName}: WORKS - "${response.text()}"`);
      } catch (error) {
        console.log(`❌ ${modelName}: ${error.message.split('\n')[0]}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listAvailableModels();