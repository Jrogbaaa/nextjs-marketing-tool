require('dotenv').config();
const OpenAI = require('openai');

async function testOpenAIConnection() {
  console.log('=== Testing OpenAI API Connection ===');
  
  try {
    // Check if API key is available
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('❌ Error: OpenAI API key is missing. Please add it to your .env file.');
      return;
    }

    console.log('🔄 Initializing OpenAI client...');
    const openai = new OpenAI({
      apiKey: apiKey
    });

    console.log('🔄 Sending test request to OpenAI API...');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a marketing expert specialized in LinkedIn lead analysis." 
        },
        {
          role: "user", 
          content: "Generate a single brief marketing insight for a LinkedIn lead who is a CTO at a fintech startup."
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    console.log('\n✅ Successfully connected to OpenAI API!\n');
    console.log('Response:');
    console.log(completion.choices[0].message.content);
    
    // Test generating insights for a mock lead
    console.log('\n🔄 Testing insight generation for a mock LinkedIn lead...\n');
    
    const mockLead = {
      name: "Alex Johnson",
      title: "CTO",
      company: "FinTech Innovations",
      location: "San Francisco, CA",
      summary: "Experienced technology leader with a focus on blockchain and AI solutions for the financial sector.",
      skills: ["Blockchain", "AI/ML", "Cloud Architecture", "FinTech"],
      connections: 1500
    };
    
    const insightPrompt = `
Generate 3 brief marketing insights for a LinkedIn lead with the following profile:

Name: ${mockLead.name}
Title: ${mockLead.title}
Company: ${mockLead.company}
Location: ${mockLead.location}
Summary: ${mockLead.summary}
Skills: ${mockLead.skills.join(', ')}
Connections: ${mockLead.connections}

Format each insight as a JSON object with these fields:
- type: (one of: "industry_trend", "connection_opportunity", "skill_analysis")
- title: A concise title for the insight
- content: The main insight (2-3 sentences)
- actionPoints: An array of 1-2 specific actions to take

Return ONLY valid JSON array of these objects.
`;

    const insightCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are an AI assistant that generates marketing insights based on LinkedIn profiles. Your insights must be specific, actionable, and relevant to the lead's industry and role." 
        },
        {
          role: "user", 
          content: insightPrompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
    });
    
    console.log('AI-Generated LinkedIn Lead Insights:');
    console.log(insightCompletion.choices[0].message.content);
  } catch (error) {
    console.error('❌ Error connecting to OpenAI API:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Error: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(error.message);
    }
  }
}

// Run the test
testOpenAIConnection(); 