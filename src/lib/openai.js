const { OpenAI } = require('openai');

// Initialize the OpenAI client if API key is available
let openai;
try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
} catch (error) {
  console.error('Error initializing OpenAI client:', error);
}

/**
 * Generate marketing insights for a LinkedIn lead
 * @param {Object} lead - The LinkedIn lead data
 * @returns {Promise<{ insights: Array, error: string|null }>}
 */
async function generateInsightsForLead(lead) {
  // Return mock insights if OpenAI is not available or we're in mock mode
  if (!openai || process.env.USE_MOCK_DATA === 'true') {
    return {
      insights: generateMockInsights(lead),
      error: null
    };
  }

  try {
    // Prepare system prompt for better quality insights
    const systemPrompt = `
      You are an expert marketing consultant specialized in LinkedIn lead analysis.
      Your task is to generate specific, actionable, and personalized marketing insights 
      for a LinkedIn lead. Focus on the lead's industry, role, company, and background.
      
      Each insight should include:
      - type: One of "industry_trend", "connection_opportunity", or "skill_analysis"
      - title: A concise, specific title for the insight
      - content: 2-3 sentences explaining the insight
      - confidenceScore: A number between 0.1 and 1.0 indicating confidence
      - actionPoints: An array of 1-3 specific actions to take

      Make your insights specific to the lead, not generic.
      Return the insights as a valid JSON array.
    `;

    // Prepare user prompt with lead information
    const userPrompt = `
      Generate 3 marketing insights for the following LinkedIn lead:
      
      Name: ${lead.name}
      Title: ${lead.title}
      Company: ${lead.company}
      Location: ${lead.location}
      ${lead.summary ? `Summary: ${lead.summary}` : ''}
      ${lead.skills && lead.skills.length > 0 ? `Skills: ${lead.skills.join(', ')}` : ''}
      ${lead.connections ? `Connections: ${lead.connections}` : ''}
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    // Parse the result
    const content = response.choices[0].message.content;
    const parsed = JSON.parse(content);
    
    if (!parsed.insights || !Array.isArray(parsed.insights) || parsed.insights.length === 0) {
      throw new Error('Invalid response format from OpenAI');
    }

    return {
      insights: parsed.insights,
      error: null
    };
  } catch (error) {
    console.error('Error generating insights with OpenAI:', error);
    
    // Fallback to mock insights on error
    return {
      insights: generateMockInsights(lead),
      error: `Failed to generate insights: ${error.message}`
    };
  }
}

/**
 * Generate mock insights for development/testing
 * @param {Object} lead - The LinkedIn lead data
 * @returns {Array} - Array of mock insights
 */
function generateMockInsights(lead) {
  const industry = lead.company?.toLowerCase().includes('tech') ? 'technology' : 
                  lead.company?.toLowerCase().includes('finance') ? 'finance' : 
                  lead.company?.toLowerCase().includes('health') ? 'healthcare' : 
                  'industry';

  return [
    {
      type: "industry_trend",
      title: `Growth Opportunities in ${industry.charAt(0).toUpperCase() + industry.slice(1)}`,
      content: `${lead.name}'s industry is experiencing significant growth, particularly in digital transformation. Recent market analysis shows a 24% increase in technology adoption within this sector.`,
      confidenceScore: 0.85,
      actionPoints: [
        "Share our latest industry report as a conversation starter",
        "Highlight our success stories in similar companies"
      ]
    },
    {
      type: "connection_opportunity",
      title: "Expansive Professional Network",
      content: `With ${lead.connections || 'an extensive'} connections, ${lead.name} has a strong network in the ${industry} space. This presents an opportunity for wider reach through relationship-building.`,
      confidenceScore: 0.78,
      actionPoints: [
        "Explore mutual connections for a warm introduction",
        "Engage with their recent LinkedIn activity before reaching out"
      ]
    },
    {
      type: "skill_analysis",
      title: `${lead.title?.includes('Development') ? 'Web Development' : 
             lead.title?.includes('Marketing') ? 'Marketing' : 
             'Leadership'} Expertise Alignment`,
      content: `${lead.name}'s background in ${lead.title || 'their field'} aligns well with our solution's focus on improving efficiency and outcomes. Their experience suggests they would appreciate our product's technical advantages.`,
      confidenceScore: 0.92,
      actionPoints: [
        "Emphasize how our solution addresses specific challenges in their role",
        "Provide a case study showing ROI for someone in a similar position"
      ]
    }
  ];
}

module.exports = {
  generateInsightsForLead
}; 