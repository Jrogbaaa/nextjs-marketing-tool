import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { Feedback, ApiResponse } from '@/lib/types';

// POST /api/feedback - Submit feedback on insights
export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Validate request data
    if (!data.insight_id || !data.rating || !data.created_by) {
      return NextResponse.json<ApiResponse<null>>({
        error: 'Missing required fields: insight_id, rating, or created_by.'
      }, { status: 400 });
    }
    
    if (typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5) {
      return NextResponse.json<ApiResponse<null>>({
        error: 'Rating must be a number between 1 and 5.'
      }, { status: 400 });
    }
    
    // Get the insight to retrieve the lead_id
    const { data: insight, error: insightError } = await supabase
      .from('insights')
      .select('lead_id')
      .eq('id', data.insight_id)
      .single();
      
    if (insightError || !insight) {
      console.error('Error fetching insight:', insightError);
      return NextResponse.json<ApiResponse<null>>({
        error: 'Failed to find insight with the provided ID.'
      }, { status: 404 });
    }
    
    // Create the feedback object
    const feedbackData = {
      insight_id: data.insight_id,
      lead_id: insight.lead_id,
      rating: data.rating,
      comment: data.comment || null,
      created_by: data.created_by,
      created_at: new Date().toISOString()
    };
    
    // Insert the feedback into the database
    const { data: insertedFeedback, error: insertError } = await supabase
      .from('feedback')
      .insert(feedbackData)
      .select();
      
    if (insertError) {
      console.error('Error inserting feedback:', insertError);
      return NextResponse.json<ApiResponse<null>>({
        error: 'Failed to save feedback to database.'
      }, { status: 500 });
    }
    
    return NextResponse.json<ApiResponse<{ feedback: Feedback }>>({
      data: {
        feedback: insertedFeedback[0] as Feedback
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json<ApiResponse<null>>({
      error: 'Internal server error while submitting feedback.'
    }, { status: 500 });
  }
}

// GET /api/feedback - Get feedback with optional filtering
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const insightId = url.searchParams.get('insight_id');
    const leadId = url.searchParams.get('lead_id');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    let query = supabase
      .from('feedback')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);
      
    // Apply filters if provided
    if (insightId) {
      query = query.eq('insight_id', insightId);
    }
    
    if (leadId) {
      query = query.eq('lead_id', leadId);
    }
    
    const { data: feedback, error, count } = await query;
    
    if (error) {
      console.error('Error fetching feedback:', error);
      return NextResponse.json<ApiResponse<null>>({
        error: 'Failed to fetch feedback from database.'
      }, { status: 500 });
    }
    
    return NextResponse.json<ApiResponse<{ feedback: Feedback[], count: number }>>({
      data: {
        feedback: feedback as Feedback[],
        count: count || 0
      }
    });
    
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json<ApiResponse<null>>({
      error: 'Internal server error while fetching feedback.'
    }, { status: 500 });
  }
} 