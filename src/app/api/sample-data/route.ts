import { NextResponse } from 'next/server';
import { sampleLeads, sampleInsights, generateSampleInsightsForLead } from '@/lib/sampleData';
import { v4 as uuidv4 } from 'uuid';

// GET /api/sample-data/leads - Get sample leads
export async function GET(req: Request) {
  const url = new URL(req.url);
  const path = url.pathname.split('/').pop();
  
  // Return all sample leads
  if (path === 'leads' || !path) {
    return NextResponse.json({
      data: { leads: sampleLeads }
    });
  }
  
  // Return a specific lead by ID
  if (path === 'lead' && url.searchParams.has('id')) {
    const leadId = url.searchParams.get('id');
    const lead = sampleLeads.find(l => l.id === leadId);
    
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    
    return NextResponse.json({ data: { lead } });
  }
  
  // Return sample insights
  if (path === 'insights') {
    const leadId = url.searchParams.get('lead_id');
    
    // If lead_id is provided, return insights for that lead
    if (leadId) {
      const insights = sampleInsights.filter(i => i.lead_id === leadId);
      
      // If no insights found and lead exists, generate some
      if (insights.length === 0) {
        const lead = sampleLeads.find(l => l.id === leadId);
        
        if (lead) {
          const generatedInsights = generateSampleInsightsForLead(lead);
          return NextResponse.json({ 
            data: { 
              insights: generatedInsights,
              generated: true
            } 
          });
        }
      }
      
      return NextResponse.json({ data: { insights } });
    }
    
    // Otherwise return all sample insights
    return NextResponse.json({ data: { insights: sampleInsights } });
  }
  
  // Handle analyze request (generate insights for leads)
  if (path === 'analyze') {
    try {
      const { leadIds } = await req.json();
      
      if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
        return NextResponse.json(
          { error: 'No leads selected for analysis' },
          { status: 400 }
        );
      }
      
      const results = {
        successful: 0,
        failed: 0,
        errors: [] as { leadId: string; error: string }[],
        insights: [] as any[],
      };
      
      // Process each lead
      for (const leadId of leadIds) {
        const lead = sampleLeads.find(l => l.id === leadId);
        
        if (!lead) {
          results.failed++;
          results.errors.push({
            leadId,
            error: 'Lead not found',
          });
          continue;
        }
        
        // Generate insights
        const insights = generateSampleInsightsForLead(lead);
        results.successful++;
        results.insights.push(...insights);
      }
      
      return NextResponse.json({
        successful: results.successful,
        failed: results.failed,
        total: leadIds.length,
        insightsGenerated: results.insights.length,
        insights: results.insights,
        errors: results.errors,
        message: `Successfully analyzed ${results.successful} leads and generated ${results.insights.length} insights.`,
      });
      
    } catch (error: any) {
      return NextResponse.json(
        { error: `Failed to analyze leads: ${error.message}` },
        { status: 500 }
      );
    }
  }
  
  // Default 404 for unhandled paths
  return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
}

// For POST requests to /api/sample-data/analyze
export async function POST(req: Request) {
  const url = new URL(req.url);
  const path = url.pathname.split('/').pop();
  
  if (path === 'analyze') {
    try {
      const { leadIds } = await req.json();
      
      if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
        return NextResponse.json(
          { error: 'No leads selected for analysis' },
          { status: 400 }
        );
      }
      
      const results = {
        successful: 0,
        failed: 0,
        errors: [] as { leadId: string; error: string }[],
        insights: [] as any[],
      };
      
      // Process each lead
      for (const leadId of leadIds) {
        const lead = sampleLeads.find(l => l.id === leadId);
        
        if (!lead) {
          results.failed++;
          results.errors.push({
            leadId,
            error: 'Lead not found',
          });
          continue;
        }
        
        // Generate insights
        const insights = generateSampleInsightsForLead(lead);
        results.successful++;
        results.insights.push(...insights);
      }
      
      return NextResponse.json({
        successful: results.successful,
        failed: results.failed,
        total: leadIds.length,
        insightsGenerated: results.insights.length,
        insights: results.insights,
        errors: results.errors,
        message: `Successfully analyzed ${results.successful} leads and generated ${results.insights.length} insights.`,
      });
      
    } catch (error: any) {
      return NextResponse.json(
        { error: `Failed to analyze leads: ${error.message}` },
        { status: 500 }
      );
    }
  }
  
  // Default 404 for unhandled paths
  return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
} 