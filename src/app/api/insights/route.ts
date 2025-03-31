import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { Insight, ApiResponse } from '@/lib/types';
import { generateInsightsForLead } from '@/lib/openai';

// GET /api/insights - Get insights with optional filtering
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const leadId = url.searchParams.get('lead_id');
    const type = url.searchParams.get('type');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    let query = supabase
      .from('insights')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);
      
    // Apply filters if provided
    if (leadId) {
      query = query.eq('lead_id', leadId);
    }
    
    if (type) {
      query = query.eq('type', type);
    }
    
    const { data: insights, error, count } = await query;
    
    if (error) {
      console.error('Error fetching insights:', error);
      return NextResponse.json<ApiResponse<null>>({
        error: 'Failed to fetch insights from database.'
      }, { status: 500 });
    }
    
    return NextResponse.json<ApiResponse<{ insights: Insight[], count: number }>>({
      data: {
        insights: insights as Insight[],
        count: count || 0
      }
    });
    
  } catch (error) {
    console.error('Error fetching insights:', error);
    return NextResponse.json<ApiResponse<null>>({
      error: 'Internal server error while fetching insights.'
    }, { status: 500 });
  }
}

// POST /api/insights/generate - Generate insights for a lead
export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Validate request data
    if (!data.lead_id) {
      return NextResponse.json<ApiResponse<null>>({
        error: 'Missing lead_id in request.'
      }, { status: 400 });
    }
    
    // Get the lead data
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', data.lead_id)
      .single();
      
    if (leadError || !lead) {
      console.error('Error fetching lead:', leadError);
      return NextResponse.json<ApiResponse<null>>({
        error: 'Failed to find lead with the provided ID.'
      }, { status: 404 });
    }
    
    // Generate insights using our AI pipeline
    const insights = await generateInsightsForLead(lead);
    
    // Store the insights in the database
    const { data: insertedInsights, error: insertError } = await supabase
      .from('insights')
      .insert(insights)
      .select();
      
    if (insertError) {
      console.error('Error inserting insights:', insertError);
      return NextResponse.json<ApiResponse<null>>({
        error: 'Failed to save generated insights to database.'
      }, { status: 500 });
    }
    
    // Update the lead to mark it as analyzed
    await supabase
      .from('leads')
      .update({ analyzed: true, updated_at: new Date().toISOString() })
      .eq('id', data.lead_id);
    
    return NextResponse.json<ApiResponse<{ insights: Insight[] }>>({
      data: {
        insights: insertedInsights as Insight[]
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json<ApiResponse<null>>({
      error: 'Internal server error while generating insights.'
    }, { status: 500 });
  }
} 