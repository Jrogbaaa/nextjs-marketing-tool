import { NextResponse } from 'next/server';

// Mock implementation for GitHub Pages deployment
export async function POST(request: Request) {
  try {
    const { leadIds } = await request.json();

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json(
        { error: 'No leads selected for analysis' },
        { status: 400 }
      );
    }

    // For GitHub Pages demo, we'll just return mock data
    const mockInsights = leadIds.map(leadId => ({
      id: `ins-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      lead_id: leadId,
      type: 'industry',
      title: 'Industry Insight',
      content: 'This lead works in a growing industry with significant opportunities.',
      confidence_score: 0.85,
      created_at: new Date().toISOString(),
    }));

    return NextResponse.json({
      successful: leadIds.length,
      failed: 0,
      total: leadIds.length,
      insightsGenerated: mockInsights.length,
      insights: mockInsights,
      errors: [],
      message: `Successfully analyzed ${leadIds.length} leads and generated ${mockInsights.length} insights.`,
    });
  } catch (error: any) {
    console.error('Error in mock analyze leads:', error);
    return NextResponse.json(
      { error: `Failed to analyze leads: ${error.message}` },
      { status: 500 }
    );
  }
}
