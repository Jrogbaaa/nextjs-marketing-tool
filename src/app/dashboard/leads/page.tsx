'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Lead, Insight } from '@/lib/types';
import LeadDetail from '@/components/leads/LeadDetail';
import LeadAnalysis from '@/components/leads/LeadAnalysis';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch leads on component mount
  useEffect(() => {
    async function fetchLeads() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/sample-data/leads');
        const data = await response.json();
        
        if (data.data && data.data.leads) {
          setLeads(data.data.leads);
          // Select the first lead by default
          if (data.data.leads.length > 0) {
            setSelectedLead(data.data.leads[0]);
            fetchInsightsForLead(data.data.leads[0].id);
          }
        } else {
          setError('Failed to fetch leads data');
        }
      } catch (err) {
        setError('Error fetching leads: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchLeads();
  }, []);

  // Fetch insights for a lead
  async function fetchInsightsForLead(leadId: string) {
    try {
      const response = await fetch(`/api/sample-data/insights?lead_id=${leadId}`);
      const data = await response.json();
      
      if (data.data && data.data.insights) {
        setInsights(data.data.insights);
      } else {
        setInsights([]);
      }
    } catch (err) {
      console.error('Error fetching insights:', err);
      setInsights([]);
    }
  }

  // Handle lead selection
  function handleLeadSelect(lead: Lead) {
    setSelectedLead(lead);
    fetchInsightsForLead(lead.id);
  }

  // Generate insights for the selected lead
  async function handleGenerateInsights(leadId: string) {
    try {
      setIsGeneratingInsights(true);
      
      const response = await fetch('/api/sample-data/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leadIds: [leadId] }),
      });
      
      const data = await response.json();
      
      if (data.insightsGenerated && data.insightsGenerated > 0) {
        // Fetch the newly generated insights
        fetchInsightsForLead(leadId);
      } else {
        setError('Failed to generate insights');
      }
    } catch (err) {
      setError('Error generating insights: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsGeneratingInsights(false);
    }
  }

  // Mock function for feedback submission
  async function handleFeedbackSubmit(insightId: string, rating: number, comment?: string) {
    // In a real app, this would send feedback to the server
    console.log('Feedback submitted:', { insightId, rating, comment });
    return Promise.resolve();
  }

  return (
    <DashboardLayout>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">Leads Analysis</h1>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          {selectedLead && !selectedLead.analyzed && (
            <button
              onClick={() => handleGenerateInsights(selectedLead.id)}
              disabled={isGeneratingInsights}
              className="btn-primary"
            >
              {isGeneratingInsights ? 'Generating...' : 'Analyze Selected Lead'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center mt-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Leads List */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {leads.map((lead) => (
                  <li key={lead.id}>
                    <div
                      className={`block hover:bg-gray-50 cursor-pointer ${
                        selectedLead?.id === lead.id ? 'bg-gray-50' : ''
                      }`}
                      onClick={() => handleLeadSelect(lead)}
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-primary-600 truncate">
                            {lead.name}
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            {lead.analyzed ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Analyzed
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {lead.title} at {lead.company}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>{lead.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Lead Detail and Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {selectedLead ? (
              <>
                <LeadDetail lead={selectedLead} />
                <LeadAnalysis
                  lead={selectedLead}
                  insights={insights}
                  onGenerateInsights={handleGenerateInsights}
                  onFeedbackSubmit={handleFeedbackSubmit}
                  isGenerating={isGeneratingInsights}
                />
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-500 text-center">Select a lead to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
} 