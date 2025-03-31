import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { Lead, ApiResponse } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Validate request data
    if (!Array.isArray(data.leads) || data.leads.length === 0) {
      return NextResponse.json<ApiResponse<null>>({
        error: 'Missing or invalid leads array in request.'
      }, { status: 400 });
    }
    
    // Add created_at timestamp to each lead if not provided
    const leadsWithTimestamp = data.leads.map((lead: Partial<Lead>) => ({
      ...lead,
      created_at: lead.created_at || new Date().toISOString(),
      analyzed: lead.analyzed || false
    }));
    
    // Insert the leads into the database
    const { data: insertedLeads, error } = await supabase
      .from('leads')
      .insert(leadsWithTimestamp)
      .select();
      
    if (error) {
      console.error('Error inserting leads:', error);
      return NextResponse.json<ApiResponse<null>>({
        error: 'Failed to insert leads into database.'
      }, { status: 500 });
    }
    
    return NextResponse.json<ApiResponse<{ leads: Lead[] }>>({
      data: {
        leads: insertedLeads as Lead[]
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error inserting leads:', error);
    return NextResponse.json<ApiResponse<null>>({
      error: 'Internal server error while adding leads.'
    }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const analyzed = url.searchParams.get('analyzed');
    const searchTerm = url.searchParams.get('search');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);
      
    // Apply filters if provided
    if (analyzed !== null) {
      const isAnalyzed = analyzed === 'true';
      query = query.eq('analyzed', isAnalyzed);
    }
    
    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`);
    }
    
    const { data: leads, error, count } = await query;
    
    if (error) {
      console.error('Error fetching leads:', error);
      return NextResponse.json<ApiResponse<null>>({
        error: 'Failed to fetch leads from database.'
      }, { status: 500 });
    }
    
    return NextResponse.json<ApiResponse<{ leads: Lead[], count: number }>>({
      data: {
        leads: leads as Lead[],
        count: count || 0
      }
    });
    
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json<ApiResponse<null>>({
      error: 'Internal server error while fetching leads.'
    }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    // Extract the ID from the URL
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const leadId = pathParts[pathParts.length - 1];
    
    if (!leadId) {
      return NextResponse.json<ApiResponse<null>>({
        error: 'Missing lead ID in request URL.'
      }, { status: 400 });
    }
    
    const data = await req.json();
    
    // Add updated_at timestamp
    const leadWithTimestamp = {
      ...data,
      updated_at: new Date().toISOString()
    };
    
    // Update the lead in the database
    const { data: updatedLead, error } = await supabase
      .from('leads')
      .update(leadWithTimestamp)
      .eq('id', leadId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating lead:', error);
      return NextResponse.json<ApiResponse<null>>({
        error: 'Failed to update lead in database.'
      }, { status: 500 });
    }
    
    return NextResponse.json<ApiResponse<{ lead: Lead }>>({
      data: {
        lead: updatedLead as Lead
      }
    });
    
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json<ApiResponse<null>>({
      error: 'Internal server error while updating lead.'
    }, { status: 500 });
  }
} 