import React, { useState } from 'react';
import { Lead, Insight, InsightType } from '@/lib/types';

interface LeadAnalysisProps {
  lead: Lead;
  insights: Insight[];
  onGenerateInsights: (leadId: string) => Promise<void>;
  onFeedbackSubmit: (insightId: string, rating: number, comment?: string) => Promise<void>;
  isGenerating: boolean;
}

const LeadAnalysis: React.FC<LeadAnalysisProps> = ({
  lead,
  insights,
  onGenerateInsights,
  onFeedbackSubmit,
  isGenerating
}) => {
  const [expandedInsightId, setExpandedInsightId] = useState<string | null>(null);
  const [feedbackValues, setFeedbackValues] = useState<{ [key: string]: { rating: number; comment: string } }>({});

  const toggleInsight = (insightId: string) => {
    setExpandedInsightId(expandedInsightId === insightId ? null : insightId);
  };
  
  const handleRatingChange = (insightId: string, rating: number) => {
    setFeedbackValues({
      ...feedbackValues,
      [insightId]: { 
        rating, 
        comment: feedbackValues[insightId]?.comment || '' 
      }
    });
  };
  
  const handleCommentChange = (insightId: string, comment: string) => {
    setFeedbackValues({
      ...feedbackValues,
      [insightId]: { 
        rating: feedbackValues[insightId]?.rating || 0, 
        comment 
      }
    });
  };
  
  const handleFeedbackSubmit = async (insightId: string) => {
    const feedback = feedbackValues[insightId];
    if (feedback && feedback.rating > 0) {
      await onFeedbackSubmit(insightId, feedback.rating, feedback.comment);
      
      // Clear feedback after submission
      const newFeedbackValues = { ...feedbackValues };
      delete newFeedbackValues[insightId];
      setFeedbackValues(newFeedbackValues);
    }
  };

  const getInsightTypeLabel = (type: string) => {
    switch (type) {
      case InsightType.INDUSTRY_TREND:
        return 'Industry Trend';
      case InsightType.CONNECTION_NETWORK:
        return 'Connection Network';
      case InsightType.SKILLS_ANALYSIS:
        return 'Skills Analysis';
      case InsightType.EDUCATION_BACKGROUND:
        return 'Education Background';
      case InsightType.CAREER_PROGRESSION:
        return 'Career Progression';
      case InsightType.ENGAGEMENT_OPPORTUNITY:
        return 'Engagement Opportunity';
      case InsightType.COMPANY_INTELLIGENCE:
        return 'Company Intelligence';
      default:
        return type;
    }
  };

  const getInsightTypeColor = (type: string) => {
    switch (type) {
      case InsightType.INDUSTRY_TREND:
        return 'bg-blue-100 text-blue-800';
      case InsightType.CONNECTION_NETWORK:
        return 'bg-purple-100 text-purple-800';
      case InsightType.SKILLS_ANALYSIS:
        return 'bg-green-100 text-green-800';
      case InsightType.EDUCATION_BACKGROUND:
        return 'bg-yellow-100 text-yellow-800';
      case InsightType.CAREER_PROGRESSION:
        return 'bg-indigo-100 text-indigo-800';
      case InsightType.ENGAGEMENT_OPPORTUNITY:
        return 'bg-red-100 text-red-800';
      case InsightType.COMPANY_INTELLIGENCE:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Lead Analysis</h2>
        <button
          onClick={() => onGenerateInsights(lead.id)}
          disabled={isGenerating}
          className="btn-primary inline-flex items-center"
          aria-label="Generate insights"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : 'Generate Insights'}
        </button>
      </div>

      {insights.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No insights generated yet.</p>
          <p className="text-gray-500 mt-2">
            Click the "Generate Insights" button to analyze this lead.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight) => (
            <div 
              key={insight.id} 
              className="border rounded-lg overflow-hidden"
            >
              <div 
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleInsight(insight.id)}
                tabIndex={0}
                aria-expanded={expandedInsightId === insight.id}
                aria-controls={`insight-content-${insight.id}`}
                onKeyDown={(e) => e.key === 'Enter' && toggleInsight(insight.id)}
              >
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getInsightTypeColor(insight.type)}`}>
                    {getInsightTypeLabel(insight.type)}
                  </span>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">{insight.title}</h3>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-3">
                    Confidence: {insight.confidence_score}/10
                  </span>
                  <svg 
                    className={`h-5 w-5 text-gray-500 transform transition-transform ${expandedInsightId === insight.id ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {expandedInsightId === insight.id && (
                <div id={`insight-content-${insight.id}`} className="px-4 py-5 border-t border-gray-200">
                  <div className="prose max-w-none">
                    <div className="text-gray-700 whitespace-pre-line mb-4">
                      {insight.content}
                    </div>
                    
                    {insight.action_points && insight.action_points.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Action Points:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {insight.action_points.map((point, index) => (
                            <li key={index} className="text-sm text-gray-600">
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Provide Feedback</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rate this insight:
                        </label>
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              className={`h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                feedbackValues[insight.id]?.rating === rating
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                              onClick={() => handleRatingChange(insight.id, rating)}
                              aria-label={`Rate ${rating} out of 5`}
                            >
                              {rating}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor={`comment-${insight.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Additional comments (optional):
                        </label>
                        <textarea
                          id={`comment-${insight.id}`}
                          rows={3}
                          className="input"
                          placeholder="Share your thoughts on this insight..."
                          value={feedbackValues[insight.id]?.comment || ''}
                          onChange={(e) => handleCommentChange(insight.id, e.target.value)}
                        ></textarea>
                      </div>
                      
                      <div className="text-right">
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => handleFeedbackSubmit(insight.id)}
                          disabled={!feedbackValues[insight.id] || feedbackValues[insight.id]?.rating === 0}
                          aria-label="Submit feedback"
                        >
                          Submit Feedback
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadAnalysis; 