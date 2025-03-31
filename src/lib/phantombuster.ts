/**
 * Phantombuster API Client
 * 
 * This module provides functions to interact with the Phantombuster API,
 * which allows us to launch and manage LinkedIn data scraping.
 */

// Types for Phantombuster responses
interface PhantomContainer {
  id: string;
  name: string;
  script: string;
  scriptPackage: string;
  lastEndMessage: string;
  lastEndStatus: 'success' | 'error' | string;
  lastEndTime: string;
}

interface PhantomLaunchResult {
  containerId: string;
  containerName: string;
  status: 'success' | 'error';
  message?: string;
}

// Base function to call Phantombuster API
async function callPhantombusterAPI(endpoint: string, method: 'GET' | 'POST' = 'GET', data?: any) {
  // Get API key from environment variables - using typeof check for SSR compatibility
  const apiKey = typeof process !== 'undefined' ? process.env.PHANTOMBUSTER_API_KEY : undefined;
  const baseUrl = 'https://api.phantombuster.com/api/v2';
  
  if (!apiKey) {
    throw new Error('Phantombuster API key is not set');
  }
  
  const url = `${baseUrl}/${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'X-Phantombuster-Key': apiKey,
      'Content-Type': 'application/json'
    }
  };
  
  if (data && method === 'POST') {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      // Try to get detailed error message from response body
      try {
        const errorData = await response.json();
        throw new Error(`Phantombuster API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
      } catch (parseError) {
        // If we can't parse response as JSON, just throw with status
        throw new Error(`Phantombuster API error: ${response.status} ${response.statusText}`);
      }
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error calling Phantombuster API:', error);
    throw error;
  }
}

// Get status of a specific container (agent)
export async function getContainerInfo(containerId?: string): Promise<PhantomContainer> {
  const id = containerId || (typeof process !== 'undefined' ? process.env.PHANTOMBUSTER_LINKEDIN_CONTAINER_ID : undefined);
  
  if (!id) {
    throw new Error('Container ID is not provided and not set in environment variables');
  }
  
  return callPhantombusterAPI(`containers/${id}`);
}

// Launch a LinkedIn profile scraper
export async function launchLinkedInScraper(
  containerId?: string, 
  options?: { 
    profileUrls?: string[],
    searchQuery?: string,
    maxProfiles?: number 
  }
): Promise<PhantomLaunchResult> {
  const id = containerId || (typeof process !== 'undefined' ? process.env.PHANTOMBUSTER_LINKEDIN_CONTAINER_ID : undefined);
  
  if (!id) {
    throw new Error('Container ID is not provided and not set in environment variables');
  }

  // Validate input parameters
  if (options?.profileUrls && options.profileUrls.length > 0 && options?.searchQuery) {
    throw new Error('Cannot provide both profileUrls and searchQuery - choose one search method');
  }

  // Set default parameters for LinkedIn scraper
  const launchArguments = {
    sessionCookie: typeof process !== 'undefined' ? process.env.LINKEDIN_SESSION_COOKIE : undefined,
    searches: options?.searchQuery ? [options.searchQuery] : undefined,
    numberOfProfiles: options?.maxProfiles || 100,
    urls: options?.profileUrls || undefined,
    // Add a webhook to send data back to our API when done
    webhookUrl: `${typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_APP_URL : ''}/api/leads`
  };
  
  // Verify we have a session cookie
  if (!launchArguments.sessionCookie) {
    throw new Error('LinkedIn session cookie is not set in environment variables');
  }
  
  return callPhantombusterAPI(`containers/${id}/launch`, 'POST', { arguments: launchArguments });
}

// For development/testing - mock the API calls when USE_MOCK_DATA is true
const isMockMode = typeof process !== 'undefined' && process.env.USE_MOCK_DATA === 'true';

// Mock LinkedIn profiles for development
const mockLinkedInProfiles = [
  {
    name: "Jane Smith",
    headline: "Senior Frontend Developer at Tech Corp",
    location: "San Francisco, CA",
    profileUrl: "https://linkedin.com/in/janesmith",
    skills: ["JavaScript", "React", "TypeScript", "HTML", "CSS"],
    connectionDegree: 2
  },
  {
    name: "John Doe",
    headline: "Full Stack Engineer | JavaScript | React | Node.js",
    location: "Austin, TX",
    profileUrl: "https://linkedin.com/in/johndoe",
    skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express"],
    connectionDegree: 2
  },
  {
    name: "Sarah Johnson",
    headline: "Product Manager with Technical Background",
    location: "Seattle, WA",
    profileUrl: "https://linkedin.com/in/sarahjohnson",
    skills: ["Product Management", "Agile", "Scrum", "JavaScript", "User Research"],
    connectionDegree: 3
  }
];

// Export mock function if in development mode
export const getMockLinkedInProfiles = () => {
  return Promise.resolve(mockLinkedInProfiles);
}; 