import { Lead, Insight, InsightType, Experience, Education } from './types';
import { v4 as uuidv4 } from 'uuid';

// Generate current date and dates in the past
const now = new Date().toISOString();
const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
const twoMonthsAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();

// Sample LinkedIn leads
export const sampleLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Sarah Johnson',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    profile_url: 'https://linkedin.com/in/sarahjohnson',
    summary: 'Experienced frontend developer with 8+ years in React and modern JavaScript frameworks. Passionate about creating performant and accessible web applications.',
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Redux', 'GraphQL', 'Webpack'],
    experience: [
      {
        title: 'Senior Frontend Developer',
        company: 'TechCorp Solutions',
        description: 'Lead developer for multiple high-traffic web applications. Improved application performance by 40% through code optimization and modern build tools.',
        start_date: '2019-03',
        end_date: undefined,
        duration: '3 years 4 months',
        location: 'San Francisco, CA'
      },
      {
        title: 'Frontend Developer',
        company: 'WebSphere Inc',
        description: 'Developed responsive web applications for clients in finance and e-commerce sectors.',
        start_date: '2016-05',
        end_date: '2019-02',
        duration: '2 years 9 months',
        location: 'San Francisco, CA'
      }
    ],
    education: [
      {
        school: 'University of California, Berkeley',
        degree: 'B.S.',
        field_of_study: 'Computer Science',
        start_date: '2012-09',
        end_date: '2016-05'
      }
    ],
    connections: 842,
    connection_degree: 2,
    analyzed: true,
    created_at: twoMonthsAgo,
    updated_at: oneMonthAgo,
    scrape_data: {} // Would normally contain raw data from scraping
  },
  {
    id: 'lead-2',
    name: 'Michael Chen',
    title: 'Product Manager',
    company: 'Innovate AI',
    location: 'Austin, TX',
    profile_url: 'https://linkedin.com/in/michaelchen',
    summary: 'Product Manager with expertise in AI and machine learning applications. Experience bringing data-driven products from concept to market.',
    skills: ['Product Management', 'AI/ML', 'Product Strategy', 'User Research', 'Agile', 'Scrum', 'Market Analysis', 'Data Analytics'],
    experience: [
      {
        title: 'Product Manager',
        company: 'Innovate AI',
        description: 'Leading development of AI-powered analytics products for enterprise customers.',
        start_date: '2020-06',
        end_date: undefined,
        duration: '2 years 1 month',
        location: 'Austin, TX'
      },
      {
        title: 'Associate Product Manager',
        company: 'DataTech Solutions',
        description: 'Managed the roadmap for data visualization tools and collaborated with engineering to deliver new features.',
        start_date: '2018-03',
        end_date: '2020-05',
        duration: '2 years 2 months',
        location: 'San Jose, CA'
      }
    ],
    education: [
      {
        school: 'Stanford University',
        degree: 'M.B.A.',
        field_of_study: 'Business Administration',
        start_date: '2016-09',
        end_date: '2018-06'
      },
      {
        school: 'University of Texas at Austin',
        degree: 'B.S.',
        field_of_study: 'Computer Science',
        start_date: '2012-09',
        end_date: '2016-05'
      }
    ],
    connections: 975,
    connection_degree: 2,
    analyzed: false,
    created_at: oneMonthAgo,
    updated_at: oneMonthAgo,
    scrape_data: {}
  },
  {
    id: 'lead-3',
    name: 'Alex Rodriguez',
    title: 'Marketing Director',
    company: 'Global Reach Media',
    location: 'New York, NY',
    profile_url: 'https://linkedin.com/in/alexrodriguez',
    summary: 'Creative marketing leader with 10+ years of experience in digital marketing and brand strategy for Fortune 500 companies.',
    skills: ['Digital Marketing', 'Brand Strategy', 'Content Marketing', 'SEO', 'SEM', 'Social Media Marketing', 'Marketing Analytics', 'Team Leadership'],
    experience: [
      {
        title: 'Marketing Director',
        company: 'Global Reach Media',
        description: 'Oversee all marketing initiatives and campaigns across digital and traditional channels.',
        start_date: '2018-01',
        end_date: undefined,
        duration: '4 years 6 months',
        location: 'New York, NY'
      },
      {
        title: 'Senior Marketing Manager',
        company: 'BrandForward Inc',
        description: 'Led digital marketing team and increased online engagement by 65% through innovative campaigns.',
        start_date: '2015-07',
        end_date: '2017-12',
        duration: '2 years 5 months',
        location: 'New York, NY'
      }
    ],
    education: [
      {
        school: 'New York University',
        degree: 'M.S.',
        field_of_study: 'Marketing',
        start_date: '2013-09',
        end_date: '2015-05'
      },
      {
        school: 'University of Pennsylvania',
        degree: 'B.A.',
        field_of_study: 'Communications',
        start_date: '2009-09',
        end_date: '2013-05'
      }
    ],
    connections: 1248,
    connection_degree: 3,
    analyzed: false,
    created_at: oneMonthAgo,
    updated_at: now,
    scrape_data: {}
  }
];

// Sample insights for Sarah Johnson (already analyzed lead)
export const sampleInsights: Insight[] = [
  {
    id: 'insight-1',
    lead_id: 'lead-1',
    type: 'skills',
    title: 'Frontend Development Expertise',
    content: 'Sarah Johnson has strong expertise in modern frontend technologies, particularly React and TypeScript, which aligns with the current tech stack used by many of your clients in the SaaS sector. Her skills in performance optimization could be valuable for clients facing scaling challenges.\n\nHer skill set suggests she would be a good fit for projects requiring advanced UI development and complex state management.',
    confidence_score: 9,
    action_points: [
      'Consider targeting with content about React performance optimization',
      'Highlight case studies from your SaaS clients',
      'Share webinar invites for advanced frontend development topics'
    ],
    created_at: oneMonthAgo,
    updated_at: oneMonthAgo
  },
  {
    id: 'insight-2',
    lead_id: 'lead-1',
    type: 'career',
    title: 'Upward Career Trajectory',
    content: 'Sarah has demonstrated consistent career growth, moving from Frontend Developer to Senior Frontend Developer within 3 years. This progression indicates ambition and skill development.\n\nHaving been in her current role for over 3 years, she may be open to new opportunities that offer further growth, particularly roles that could leverage her leadership potential.',
    confidence_score: 7,
    action_points: [
      'Share content about leadership in technical roles',
      'Offer resources about transitioning to lead developer positions',
      'Consider connecting with a personalized message highlighting growth opportunities'
    ],
    created_at: oneMonthAgo,
    updated_at: oneMonthAgo
  },
  {
    id: 'insight-3',
    lead_id: 'lead-1',
    type: 'industry',
    title: 'Tech Industry Focus',
    content: 'Sarah\'s experience is concentrated in technology companies focused on web applications. This aligns with the growing sector of cloud-based SaaS products that your company specializes in marketing for.\n\nGiven her experience at TechCorp Solutions, which has a similar client base to yours, she likely understands the challenges and opportunities in your target market.',
    confidence_score: 8,
    action_points: [
      'Share industry reports relevant to web application trends',
      'Highlight your success stories with similar tech companies',
      'Consider mentioning specific challenges that TechCorp and similar companies face that your services address'
    ],
    created_at: oneMonthAgo,
    updated_at: oneMonthAgo
  },
  {
    id: 'insight-4',
    lead_id: 'lead-1',
    type: 'engagement',
    title: 'Content Engagement Strategy',
    content: 'Based on Sarah\'s profile, technical content around frontend performance optimization and modern JavaScript frameworks would likely resonate well. Her focus on accessibility also suggests that content around inclusive design would be engaging.\n\nGiven her senior position, she may have influence in technology decisions at TechCorp Solutions, making her a valuable connection for B2B services.',
    confidence_score: 8,
    action_points: [
      'Share technical articles about React performance optimization',
      'Offer a free consultation on accessibility improvements',
      'Invite to webinars focused on frontend architecture decisions'
    ],
    created_at: oneMonthAgo,
    updated_at: oneMonthAgo
  }
];

// Map from InsightType enum to string literals for type conversion
const insightTypeToString: Record<InsightType, string> = {
  [InsightType.INDUSTRY_TREND]: 'industry',
  [InsightType.CONNECTION_NETWORK]: 'network',
  [InsightType.SKILLS_ANALYSIS]: 'skills',
  [InsightType.EDUCATION_BACKGROUND]: 'education',
  [InsightType.CAREER_PROGRESSION]: 'career',
  [InsightType.ENGAGEMENT_OPPORTUNITY]: 'engagement',
  [InsightType.COMPANY_INTELLIGENCE]: 'company'
};

// Function to generate new sample insights for any lead
export function generateSampleInsightsForLead(lead: Lead): Insight[] {
  const currentDate = new Date().toISOString();
  
  // Generate 3-5 insights
  const numInsights = Math.floor(Math.random() * 3) + 3;
  const insights: Insight[] = [];
  
  // Possible insight types to choose from
  const insightTypes = Object.values(InsightType);
  
  for (let i = 0; i < numInsights; i++) {
    // Select a random insight type
    const typeEnum = insightTypes[Math.floor(Math.random() * insightTypes.length)];
    // Convert enum to string literal for type compatibility
    const type = insightTypeToString[typeEnum];
    
    // Generate insight based on type and lead data
    const insight = createInsightByType(lead, typeEnum);
    
    insights.push({
      id: `insight-${uuidv4()}`,
      lead_id: lead.id,
      type, // Using the string type here
      title: insight.title,
      content: insight.content,
      confidence_score: Math.floor(Math.random() * 4) + 6, // Random score between 6-9
      action_points: insight.actionPoints,
      created_at: currentDate,
      updated_at: currentDate
    });
  }
  
  return insights;
}

// Helper function to create specific insights based on lead data and insight type
function createInsightByType(lead: Lead, type: InsightType): { title: string, content: string, actionPoints: string[] } {
  switch (type) {
    case InsightType.INDUSTRY_TREND:
      return {
        title: `${lead.company} Industry Analysis`,
        content: `${lead.name} works at ${lead.company} in the ${lead.title} role, which positions them in a growing sector of the market. Based on our analysis, companies in this space are increasingly investing in digital transformation initiatives.\n\nThis presents an opportunity to engage with content focused on innovation and efficiency in their specific industry.`,
        actionPoints: [
          `Share industry reports relevant to ${lead.company}'s market`,
          'Offer case studies from similar companies',
          'Suggest a consultation focused on their industry challenges'
        ]
      };
      
    case InsightType.CONNECTION_NETWORK:
      return {
        title: 'Network Influence Assessment',
        content: `With ${lead.connections.toLocaleString()} connections, ${lead.name} has an extensive professional network that could amplify your marketing reach. Their ${lead.connection_degree}nd degree connection to your organization suggests potential for warm introductions.\n\nTheir network likely includes decision-makers in similar roles across the industry.`,
        actionPoints: [
          'Consider engaging through shared connections',
          'Share content that would be valuable for their network',
          'Explore potential partnership opportunities'
        ]
      };
      
    case InsightType.SKILLS_ANALYSIS:
      return {
        title: 'Professional Skills Evaluation',
        content: `${lead.name}'s skill set includes ${lead.skills.slice(0, 3).join(', ')}, which indicates they are knowledgeable in areas relevant to your offerings. Their expertise suggests they would understand the value proposition of your solutions.\n\nTargeting content specifically addressing how your offerings enhance or complement these skills could resonate strongly.`,
        actionPoints: [
          `Share technical content related to ${lead.skills[0]}`,
          'Offer resources that address challenges in their domain',
          'Highlight case studies relevant to their skill areas'
        ]
      };
      
    case InsightType.EDUCATION_BACKGROUND:
      return {
        title: 'Educational Background Insights',
        content: `${lead.name}'s education at ${lead.education[0]?.school || 'a top institution'} in ${lead.education[0]?.field_of_study || 'their field'} suggests a strong foundation in theoretical concepts and practical applications.\n\nThis background indicates they likely value evidence-based approaches and thorough analysis, which should inform your communication style.`,
        actionPoints: [
          'Frame offerings in terms of measurable outcomes',
          'Reference research or studies when making claims',
          'Consider educational institution connections for networking'
        ]
      };
      
    case InsightType.CAREER_PROGRESSION:
      return {
        title: 'Career Trajectory Analysis',
        content: `${lead.name}'s career progression shows a ${lead.experience.length > 1 ? 'steady advancement' : 'focused development'} in their field. Currently as ${lead.title} at ${lead.company}, they likely have ${lead.title.toLowerCase().includes('senior') ? 'significant decision-making authority' : 'influence in their department'}.\n\nTheir professional growth suggests they value ${lead.title.toLowerCase().includes('manager') ? 'leadership and strategy' : 'technical excellence and innovation'}.`,
        actionPoints: [
          'Share content about professional growth in their field',
          `Highlight how your offerings support ${lead.title.toLowerCase().includes('manager') ? 'leadership goals' : 'professional excellence'}`,
          'Consider personalized outreach acknowledging their career achievements'
        ]
      };
      
    case InsightType.ENGAGEMENT_OPPORTUNITY:
      return {
        title: 'Optimal Engagement Strategy',
        content: `Based on ${lead.name}'s profile, the most effective engagement approach would be content focused on ${lead.skills.slice(0, 2).join(' and ')} with emphasis on applications in ${lead.company}'s industry.\n\nTheir position as ${lead.title} suggests they would be receptive to content that helps them ${lead.title.toLowerCase().includes('manager') ? 'lead more effectively' : 'enhance their technical capabilities'}.`,
        actionPoints: [
          `Invite to webinars focused on challenges in the ${lead.company} industry`,
          'Share case studies relevant to their current role',
          'Offer a free consultation on specific challenges they might face'
        ]
      };
      
    case InsightType.COMPANY_INTELLIGENCE:
      return {
        title: `${lead.company} Company Analysis`,
        content: `${lead.company} operates in a market that's experiencing ${Math.random() > 0.5 ? 'significant growth' : 'technological disruption'}. As ${lead.title}, ${lead.name} likely plays a key role in ${lead.title.toLowerCase().includes('product') ? 'product strategy' : lead.title.toLowerCase().includes('market') ? 'marketing initiatives' : 'technical decisions'}.\n\nEngaging with them could provide insights into ${lead.company}'s challenges and potential needs for your services.`,
        actionPoints: [
          `Research recent news about ${lead.company} for conversation starters`,
          'Share industry analysis relevant to their company size and sector',
          'Consider account-based marketing approaches for their organization'
        ]
      };
      
    default:
      return {
        title: 'General Engagement Recommendation',
        content: `${lead.name}'s profile suggests they would be a valuable connection for your network. Their experience at ${lead.company} as ${lead.title} indicates potential alignment with your target audience.\n\nConsider a personalized approach that acknowledges their specific experience and the challenges they might face in their role.`,
        actionPoints: [
          'Connect with a personalized message',
          'Share relevant industry content',
          'Follow up with specific value propositions'
        ]
      };
  }
} 