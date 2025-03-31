const axios = require('axios');

/**
 * Base function to call the Phantombuster API
 * @param {Object} options - API call options
 * @param {string} options.endpoint - API endpoint
 * @param {Object} options.data - Data for POST requests
 * @param {string} options.method - HTTP method (GET or POST)
 * @returns {Promise<Object>} - API response
 */
async function callPhantombusterAPI({ endpoint, data = null, method = 'GET' }) {
  try {
    const apiKey = process.env.PHANTOMBUSTER_API_KEY;
    if (!apiKey) {
      throw new Error('Phantombuster API key is not set');
    }

    const url = `https://api.phantombuster.com/api/v2${endpoint}`;
    const headers = {
      'X-Phantombuster-Key': apiKey,
      'Content-Type': 'application/json'
    };

    const response = await axios({
      method,
      url,
      headers,
      data: data ? JSON.stringify(data) : undefined
    });

    return response.data;
  } catch (error) {
    console.error(`Error calling Phantombuster API (${endpoint}):`, error.message);
    if (error.response) {
      console.error('API Error Response:', error.response.data);
    }
    throw error;
  }
}

/**
 * Get information about a Phantombuster container
 * @param {string} containerId - The container ID
 * @returns {Promise<Object>} - Container information
 */
async function getContainerInfo(containerId) {
  if (!containerId) {
    throw new Error('Container ID is required');
  }

  return callPhantombusterAPI({
    endpoint: `/agents/${containerId}`,
    method: 'GET'
  });
}

/**
 * Launch a LinkedIn profile scraper
 * @param {Object} options - Scraper options
 * @param {string} options.containerId - The LinkedIn scraper container ID
 * @param {Array<string>} [options.profileUrls] - Optional array of LinkedIn profile URLs
 * @param {string} [options.searchQuery] - Optional LinkedIn search query
 * @param {number} [options.maxProfiles=50] - Maximum profiles to scrape
 * @returns {Promise<Object>} - Scrape results
 */
async function launchLinkedInScraper({ containerId, profileUrls, searchQuery, maxProfiles = 50 }) {
  if (!containerId) {
    throw new Error('LinkedIn scraper container ID is required');
  }

  // If we're in mock mode, return mock data
  if (process.env.USE_MOCK_DATA === 'true') {
    return { 
      data: generateMockLinkedInProfiles(maxProfiles),
      status: 'success'
    };
  }

  try {
    // First, launch the container
    const launchResult = await callPhantombusterAPI({
      endpoint: `/agents/${containerId}/launch`,
      method: 'POST',
      data: {
        argument: JSON.stringify({
          sessionCookie: process.env.LINKEDIN_SESSION_COOKIE,
          profileUrls: profileUrls,
          searchUrl: searchQuery,
          numberOfResultsPerSearch: maxProfiles,
          numberOfLinesPerLaunch: maxProfiles
        })
      }
    });

    // Check if the container was launched successfully
    if (launchResult.status !== 'success') {
      throw new Error(`Failed to launch container: ${launchResult.message || 'Unknown error'}`);
    }

    // If we have a container ID, we need to wait for the job to complete
    // For simplicity, we're not implementing a full polling mechanism here
    // In a real implementation, you would poll the /agents/{id} endpoint until the job is done

    // For now, we'll just wait a few seconds and then fetch the results
    console.log('Container launched successfully. Waiting for job to complete...');
    
    // In a real implementation, you'd poll the container status until it's done
    // Instead, we'll just wait 5 seconds for demo purposes
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Fetch the container info to get the output
    const containerInfo = await getContainerInfo(containerId);
    
    // Check if we have output
    if (containerInfo.output && containerInfo.output.length > 0) {
      return {
        data: JSON.parse(containerInfo.output),
        status: 'success'
      };
    }
    
    // If no output, throw an error
    throw new Error('No output from Phantombuster container');

  } catch (error) {
    console.error('Error launching LinkedIn scraper:', error);
    
    // In mock mode or if error, return mock data
    if (process.env.USE_MOCK_DATA === 'true') {
      return { 
        data: generateMockLinkedInProfiles(maxProfiles),
        status: 'success'
      };
    }
    
    throw error;
  }
}

/**
 * Generate mock LinkedIn profiles for development/testing
 * @param {number} count - Number of profiles to generate
 * @returns {Array} - Array of mock profiles
 */
function generateMockLinkedInProfiles(count = 5) {
  const companies = ['TechCorp', 'Global Finance', 'Healthcare Solutions', 'Marketing Pro', 'Startup Innovations'];
  const titles = ['CEO', 'CTO', 'Marketing Director', 'Software Engineer', 'Product Manager', 'Sales Executive'];
  const locations = ['San Francisco, CA', 'New York, NY', 'London, UK', 'Toronto, Canada', 'Berlin, Germany'];
  const skills = [
    ['Leadership', 'Strategy', 'Business Development', 'Public Speaking'],
    ['JavaScript', 'React', 'Node.js', 'AWS', 'TypeScript'],
    ['Digital Marketing', 'Content Strategy', 'SEO', 'Social Media'],
    ['Data Analysis', 'SQL', 'Python', 'Machine Learning'],
    ['Product Management', 'Agile', 'UX/UI', 'Roadmapping']
  ];
  
  const profiles = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = `Test${i + 1}`;
    const lastName = `User${i + 1}`;
    const companyIndex = i % companies.length;
    const titleIndex = i % titles.length;
    const locationIndex = i % locations.length;
    const skillsIndex = i % skills.length;
    
    profiles.push({
      name: `${firstName} ${lastName}`,
      title: titles[titleIndex],
      company: companies[companyIndex],
      location: locations[locationIndex],
      profileUrl: `https://www.linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${i}`,
      connections: 500 + Math.floor(Math.random() * 1000),
      summary: `Experienced ${titles[titleIndex]} with a passion for ${skills[skillsIndex][0]} and ${skills[skillsIndex][1]}.`,
      skills: skills[skillsIndex],
      connectionDegree: Math.floor(Math.random() * 3) + 1,
      timestamp: new Date().toISOString()
    });
  }
  
  return profiles;
}

module.exports = {
  callPhantombusterAPI,
  getContainerInfo,
  launchLinkedInScraper,
  generateMockLinkedInProfiles
}; 