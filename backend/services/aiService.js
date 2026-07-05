const axios = require('axios');

/*
 * Works with ANY OpenAI-compatible /chat/completions endpoint.
 * Just change these three env vars — no code changes needed:
 *
 * NVIDIA NIM:
 *   AI_BASE_URL=https://integrate.api.nvidia.com/v1
 *   AI_MODEL_NAME=meta/llama-3.1-70b-instruct
 *
 * Groq:
 *   AI_BASE_URL=https://api.groq.com/openai/v1
 *   AI_MODEL_NAME=llama-3.3-70b-versatile
 *
 * OpenRouter:
 *   AI_BASE_URL=https://openrouter.ai/api/v1
 *   AI_MODEL_NAME=meta-llama/llama-3.1-8b-instruct:free
 *
 * Gemini (OpenAI-compatible):
 *   AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
 *   AI_MODEL_NAME=gemini-1.5-flash
 */

const cache = new Map(); // simple in-memory cache for identical requests

function buildPrompt(businessType, businessName, description) {
  if (businessType === 'landing-page') {
    return `You are a professional copywriter. Create landing page content for a product/service called "${businessName}".
Description: ${description}

Respond with ONLY valid JSON (no markdown, no code fences, no explanation) in exactly this shape:
{
  "heroHeading": "string, punchy headline",
  "heroSubheading": "string, clear value proposition",
  "features": [
    {"title": "string", "description": "string"},
    {"title": "string", "description": "string"},
    {"title": "string", "description": "string"},
    {"title": "string", "description": "string"}
  ],
  "testimonial": {"quote": "string", "name": "string", "role": "string"},
  "ctaText": "string, short action phrase for a button",
  "footerText": "string, short copyright/footer line"
}`;
  }

  return `You are a professional copywriter. Create website content for a ${businessType} called "${businessName}".
Description: ${description}

Respond with ONLY valid JSON (no markdown, no code fences, no explanation) in exactly this shape:
{
  "heroHeading": "string",
  "heroSubheading": "string",
  "aboutText": "string, 2-3 sentences",
  "services": [
    {"title": "string", "description": "string"},
    {"title": "string", "description": "string"},
    {"title": "string", "description": "string"}
  ],
  "footerText": "string, short copyright/footer line"
}`;
}

function stripFences(text) {
  return text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
}

function fallbackContent(businessType, businessName) {
  if (businessType === 'landing-page') {
    return {
      heroHeading: `${businessName} — Built for results`,
      heroSubheading: 'A solution designed around what you actually need.',
      features: [
        { title: 'Fast', description: 'Get up and running in minutes.' },
        { title: 'Reliable', description: 'Built to work every time, no surprises.' },
        { title: 'Simple', description: 'No clutter, just what matters.' },
        { title: 'Supported', description: "We're here whenever you need help." }
      ],
      testimonial: { quote: 'This changed how we work.', name: 'A. Sharma', role: 'Customer' },
      ctaText: 'Get Started',
      footerText: `© ${new Date().getFullYear()} ${businessName}. All rights reserved.`
    };
  }
  return {
    heroHeading: businessName,
    heroSubheading: 'Quality you can trust.',
    aboutText: `${businessName} is committed to delivering excellent service to every customer, every time.`,
    services: [
      { title: 'Service One', description: 'Description of the first offering.' },
      { title: 'Service Two', description: 'Description of the second offering.' },
      { title: 'Service Three', description: 'Description of the third offering.' }
    ],
    footerText: `© ${new Date().getFullYear()} ${businessName}. All rights reserved.`
  };
}

async function callChatCompletion(prompt) {
  const { AI_API_KEY, AI_BASE_URL, AI_MODEL_NAME } = process.env;
  if (!AI_API_KEY || !AI_BASE_URL || !AI_MODEL_NAME) {
    throw new Error('AI provider env vars missing (AI_API_KEY, AI_BASE_URL, AI_MODEL_NAME)');
  }

  const response = await axios.post(
    `${AI_BASE_URL.replace(/\/$/, '')}/chat/completions`,
    {
      model: AI_MODEL_NAME,
      messages: [
        { role: 'system', content: 'You respond with strictly valid JSON only. No prose, no markdown fences.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8
    },
    {
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 25000
    }
  );

  const text = response?.data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty response from AI provider');
  return text;
}

async function generateWebsiteContent(businessType, businessName, description) {
  const cacheKey = `${businessType}::${businessName}::${description}`.toLowerCase();
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const prompt = buildPrompt(businessType, businessName, description);
  let lastError = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await callChatCompletion(prompt);
      const cleaned = stripFences(raw);
      const parsed = JSON.parse(cleaned);
      cache.set(cacheKey, parsed);
      return parsed;
    } catch (err) {
      lastError = err;
      console.error(`[aiService] attempt ${attempt + 1} failed:`, err.message);
    }
  }

  // Graceful fallback so the demo never hard-fails if the AI key isn't set yet
  console.warn('[aiService] falling back to template content:', lastError?.message);
  return fallbackContent(businessType, businessName);
}

module.exports = { generateWebsiteContent };
