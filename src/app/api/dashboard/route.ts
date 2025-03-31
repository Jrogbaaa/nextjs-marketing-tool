import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { ApiResponse, DashboardData, InsightType } from '@/lib/types';

// GET /api/dashboard - Get dashboard data
export async function GET(req: Request) {
  try {
    // 1. Get lead stats
    const { data: leadStats, error: leadStatsError } = await supabase.rpc('get_lead_stats');
    
    if (leadStatsError) {
      console.error('Error fetching lead stats:', leadStatsError);
      return NextResponse.json<ApiResponse<null>>({
        error: 'Failed to fetch lead statistics from database.'
      }, { status: 500 });
    }
    
    // 2. Get insight stats
    const { data: insightStats, error: insightStatsError } = await supabase.rpc('get_insight_stats');
    
    if (insightStatsError) {
      console.error('Error fetching insight stats:', insightStatsError);
      return NextResponse.json<ApiResponse<null>>({
        error: 'Failed to fetch insight statistics from database.'
      }, { status: 500 });
    }
    
    // 3. Get feedback stats
    const { data: feedbackStats, error: feedbackStatsError } = await supabase.rpc('get_feedback_stats');
    
    if (feedbackStatsError) {
      console.error('Error fetching feedback stats:', feedbackStatsError);
      return NextResponse.json<ApiResponse<null>>({
        error: 'Failed to fetch feedback statistics from database.'
      }, { status: 500 });
    }
    
    // 4. Get recent insights
    const { data: recentInsights, error: recentInsightsError } = await supabase
      .from('insights')
      .select('*, leads(name, title, company)')
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (recentInsightsError) {
      console.error('Error fetching recent insights:', recentInsightsError);
      return NextResponse.json<ApiResponse<null>>({
        error: 'Failed to fetch recent insights from database.'
      }, { status: 500 });
    }
    
    // 5. Get recent leads
    const { data: recentLeads, error: recentLeadsError } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (recentLeadsError) {
      console.error('Error fetching recent leads:', recentLeadsError);
      return NextResponse.json<ApiResponse<null>>({
        error: 'Failed to fetch recent leads from database.'
      }, { status: 500 });
    }
    
    // Prepare dashboard data
    const dashboardData: DashboardData = {
      lead_stats: {
        total: leadStats?.total || 0,
        analyzed: leadStats?.analyzed || 0,
        not_analyzed: leadStats?.not_analyzed || 0
      },
      insight_stats: {
        total: insightStats?.total || 0,
        by_type: insightStats?.by_type || {},
        average_confidence: insightStats?.average_confidence || 0
      },
      feedback_stats: {
        total: feedbackStats?.total || 0,
        average_rating: feedbackStats?.average_rating || 0,
        by_rating: feedbackStats?.by_rating || {}
      },
      recent_insights: recentInsights || [],
      recent_leads: recentLeads || []
    };
    
    return NextResponse.json<ApiResponse<DashboardData>>({
      data: dashboardData
    });
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json<ApiResponse<null>>({
      error: 'Internal server error while fetching dashboard data.'
    }, { status: 500 });
  }
}

// Fallback implementation if RPC functions are not set up
async function fallbackDashboardData() {
  // Lead statistics
  const { data: leads, error: leadsError } = await supabase
    .from('leads')
    .select('id, analyzed');
  
  if (leadsError) throw leadsError;
  
  const leadStats = {
    total: leads?.length || 0,
    analyzed: leads?.filter(lead => lead.analyzed).length || 0,
    not_analyzed: leads?.filter(lead => !lead.analyzed).length || 0
  };
  
  // Insight statistics
  const { data: insights, error: insightsError } = await supabase
    .from('insights')
    .select('id, type, confidence_score');
  
  if (insightsError) throw insightsError;
  
  const byType: Record<string, number> = {};
  let totalConfidence = 0;
  
  insights?.forEach(insight => {
    byType[insight.type] = (byType[insight.type] || 0) + 1;
    totalConfidence += insight.confidence_score;
  });
  
  const insightStats = {
    total: insights?.length || 0,
    by_type: byType,
    average_confidence: insights?.length ? totalConfidence / insights.length : 0
  };
  
  // Feedback statistics
  const { data: feedback, error: feedbackError } = await supabase
    .from('feedback')
    .select('id, rating');
  
  if (feedbackError) throw feedbackError;
  
  const byRating: Record<number, number> = {};
  let totalRating = 0;
  
  feedback?.forEach(item => {
    byRating[item.rating] = (byRating[item.rating] || 0) + 1;
    totalRating += item.rating;
  });
  
  const feedbackStats = {
    total: feedback?.length || 0,
    average_rating: feedback?.length ? totalRating / feedback.length : 0,
    by_rating: byRating
  };
  
  // Recent insights
  const { data: recentInsights, error: recentInsightsError } = await supabase
    .from('insights')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (recentInsightsError) throw recentInsightsError;
  
  // Recent leads
  const { data: recentLeads, error: recentLeadsError } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (recentLeadsError) throw recentLeadsError;
  
  return {
    lead_stats: leadStats,
    insight_stats: insightStats,
    feedback_stats: feedbackStats,
    recent_insights: recentInsights || [],
    recent_leads: recentLeads || []
  };
} 