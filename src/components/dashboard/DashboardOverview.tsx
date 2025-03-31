import React from 'react';
import { DashboardData, Lead, Insight } from '@/lib/types';
import { 
  Chart as ChartJS, 
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
);

interface DashboardOverviewProps {
  data: DashboardData;
  onLeadSelect: (lead: Lead) => void;
  onInsightSelect: (insight: Insight) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  data, 
  onLeadSelect,
  onInsightSelect 
}) => {
  // Helper function to get friendly labels for insight types
  const getInsightTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'industry_trend': 'Industry Trends',
      'connection_network': 'Network',
      'skills_analysis': 'Skills',
      'education_background': 'Education',
      'career_progression': 'Career',
      'engagement_opportunity': 'Engagement',
      'company_intelligence': 'Company'
    };
    
    return labels[type] || type;
  };
  
  // Prepare data for pie chart (by insight type)
  const insightTypePieData = {
    labels: Object.keys(data.insight_stats.by_type).map(getInsightTypeLabel),
    datasets: [
      {
        data: Object.values(data.insight_stats.by_type),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(201, 203, 207, 0.8)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Prepare data for bar chart (feedback ratings)
  const feedbackBarData = {
    labels: ['1', '2', '3', '4', '5'],
    datasets: [
      {
        label: 'Feedback Ratings',
        data: [
          data.feedback_stats.by_rating[1] || 0,
          data.feedback_stats.by_rating[2] || 0,
          data.feedback_stats.by_rating[3] || 0,
          data.feedback_stats.by_rating[4] || 0,
          data.feedback_stats.by_rating[5] || 0
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-indigo-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-indigo-800 mb-2">Leads</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-indigo-600">Total</p>
              <p className="text-2xl font-bold text-indigo-900">{data.lead_stats.total}</p>
            </div>
            <div>
              <p className="text-sm text-indigo-600">Analyzed</p>
              <p className="text-2xl font-bold text-indigo-900">{data.lead_stats.analyzed}</p>
              <p className="text-xs text-indigo-500">
                {data.lead_stats.total > 0 
                  ? `${Math.round((data.lead_stats.analyzed / data.lead_stats.total) * 100)}%` 
                  : '0%'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-purple-800 mb-2">Insights</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-purple-600">Total</p>
              <p className="text-2xl font-bold text-purple-900">{data.insight_stats.total}</p>
            </div>
            <div>
              <p className="text-sm text-purple-600">Avg Confidence</p>
              <p className="text-2xl font-bold text-purple-900">
                {data.insight_stats.average_confidence.toFixed(1)}
              </p>
              <p className="text-xs text-purple-500">out of 10</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-green-800 mb-2">Feedback</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-green-600">Total</p>
              <p className="text-2xl font-bold text-green-900">{data.feedback_stats.total}</p>
            </div>
            <div>
              <p className="text-sm text-green-600">Avg Rating</p>
              <p className="text-2xl font-bold text-green-900">
                {data.feedback_stats.average_rating.toFixed(1)}
              </p>
              <p className="text-xs text-green-500">out of 5</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Insights by Type</h3>
          <div className="h-64">
            <Pie 
              data={insightTypePieData} 
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Feedback Ratings</h3>
          <div className="h-64">
            <Bar 
              data={feedbackBarData} 
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Recent Insights */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Insights</h3>
        {data.recent_insights.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No insights generated yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.recent_insights.map((insight) => (
                  <tr 
                    key={insight.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onInsightSelect(insight)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        insight.type === 'industry_trend' ? 'bg-blue-100 text-blue-800' :
                        insight.type === 'connection_network' ? 'bg-purple-100 text-purple-800' :
                        insight.type === 'skills_analysis' ? 'bg-green-100 text-green-800' :
                        insight.type === 'education_background' ? 'bg-yellow-100 text-yellow-800' :
                        insight.type === 'career_progression' ? 'bg-indigo-100 text-indigo-800' :
                        insight.type === 'engagement_opportunity' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getInsightTypeLabel(insight.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{insight.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {(insight as any).leads?.name || 'Unknown Lead'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{insight.confidence_score}/10</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Recent Leads */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Leads</h3>
        {data.recent_leads.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No leads imported yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.recent_leads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onLeadSelect(lead)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{lead.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{lead.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        lead.analyzed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {lead.analyzed ? 'Analyzed' : 'Pending Analysis'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview; 