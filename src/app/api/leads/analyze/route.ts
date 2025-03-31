import { NextResponse } from 'next/server';
import { getLeadById, updateLead, createInsight } from '@/lib/supabase';
import { generateInsightsForLead } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { leadIds } = await request.json();

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

    // Process each lead in sequence (could be parallelized for better performance)
    for (const leadId of leadIds) {
      try {
        // Get lead details
        const { data: lead, error: leadError } = await getLeadById(leadId);

        if (leadError || !lead) {
          results.failed++;
          results.errors.push({
            leadId,
            error: leadError?.message || 'Lead not found',
          });
          continue;
        }

        // Generate insights for the lead
        const { insights, error: insightsError } = await generateInsightsForLead(lead);

        if (insightsError || !insights || insights.length === 0) {
          results.failed++;
          results.errors.push({
            leadId,
            error: insightsError || 'Failed to generate insights',
          });
          continue;
        }

        // Store each insight in the database
        const storedInsights = [];
        for (const insight of insights) {
          const { data: storedInsight, error: storeError } = await createInsight({
            lead_id: leadId,
            type: insight.type,
            title: insight.title,
            content: insight.content,
            confidence_score: insight.confidenceScore || 0.7,
            action_points: insight.actionPoints || [],
          });

          if (storeError) {
            console.error(`Error storing insight for lead ${leadId}:`, storeError);
          } else if (storedInsight) {
            storedInsights.push(storedInsight);
          }
        }

        // Mark the lead as analyzed
        await updateLead(leadId, { analyzed: true });

        // Track success
        results.successful++;
        results.insights.push(...storedInsights);
      } catch (error: any) {
        results.failed++;
        results.errors.push({
          leadId,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      successful: results.successful,
      failed: results.failed,
      total: leadIds.length,
      insightsGenerated: results.insights.length,
      errors: results.errors,
      message: `Successfully analyzed ${results.successful} leads and generated ${results.insights.length} insights.`,
    });
  } catch (error: any) {
    console.error('Error analyzing leads:', error);
    return NextResponse.json(
      { error: `Failed to analyze leads: ${error.message}` },
      { status: 500 }
    );
  }
} 