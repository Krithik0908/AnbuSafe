require('dotenv').config();
const fetch = require('node-fetch'); // You may need to install: npm install node-fetch

async function debugGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  console.log('🔍 DEBUGGING GEMINI 3 API ACCESS');
  console.log('='.repeat(50));
  
  if (!apiKey) {
    console.log('❌ ERROR: No GEMINI_API_KEY in .env');
    console.log('💡 Get API key from: https://makersuite.google.com/app/apikey');
    return;
  }
  
  console.log(`✅ API Key found: ${apiKey.substring(0, 10)}...`);
  console.log('⏳ Testing API access...\n');
  
  // Test 1: List available models
  console.log('1️⃣ Testing: List available models');
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ SUCCESS: Found ${data.models?.length || 0} models`);
      
      // Show Gemini models only
      const geminiModels = data.models?.filter(m => 
        m.name.includes('gemini') || m.name.includes('models/gemini')
      );
      
      if (geminiModels && geminiModels.length > 0) {
        console.log('\n   📋 Available Gemini Models:');
        geminiModels.forEach(model => {
          console.log(`   • ${model.name}`);
          console.log(`     Methods: ${model.supportedGenerationMethods?.join(', ') || 'none'}`);
          console.log(`     Version: ${model.version || 'N/A'}`);
        });
      } else {
        console.log('   ⚠️ No Gemini models found in your account');
      }
    } else {
      const errorText = await response.text();
      console.log(`   ❌ FAILED: ${errorText.substring(0, 200)}...`);
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
  }
  
  // Test 2: Try to generate content with different models
  console.log('\n2️⃣ Testing: Generate content with common models');
  
  const testModels = [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.0-pro',
    'gemini-pro'
  ];
  
  for (const modelName of testModels) {
    try {
      console.log(`   Testing: ${modelName}`);
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: "Say 'Hello' in one word"
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 10
            }
          })
        }
      );
      
      console.log(`     Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No text';
        console.log(`     ✅ SUCCESS: "${text}"`);
        console.log(`     💡 Use this in .env: GEMINI_MODEL=${modelName}`);
        break; // Stop at first successful model
      } else {
        const errorData = await response.json();
        console.log(`     ❌ ERROR: ${errorData.error?.message?.substring(0, 100) || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`     ❌ EXCEPTION: ${error.message}`);
    }
  }
  
  // Test 3: Check quota/access
  console.log('\n3️⃣ Testing: Check quota and access');
  console.log('   💡 Visit: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas');
  console.log('   💡 Check: https://ai.google.dev/gemini-api/docs/rate-limits');
  
  console.log('\n='.repeat(50));
  console.log('🎯 NEXT STEPS:');
  console.log('1. If no models work, get a NEW API key');
  console.log('2. Enable billing if required (free tier available)');
  console.log('3. Try different region/project in Google Cloud');
  console.log('4. Wait 1 hour if you hit rate limits');
}

debugGemini().catch(console.error);