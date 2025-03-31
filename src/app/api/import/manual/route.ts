import { NextResponse } from 'next/server';
import { createLead } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const lead = await request.json();

    // Basic validation
    if (!lead.name || !lead.profile_url) {
      return NextResponse.json(
        { error: 'Name and LinkedIn profile URL are required' },
        { status: 400 }
      );
    }

    // Check if profile URL is a valid LinkedIn URL
    const linkedInUrlPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;
    if (!linkedInUrlPattern.test(lead.profile_url)) {
      return NextResponse.json(
        { error: 'Please provide a valid LinkedIn profile URL (e.g., https://www.linkedin.com/in/username)' },
        { status: 400 }
      );
    }

    // Default values for missing fields
    const leadToCreate = {
      name: lead.name,
      title: lead.title || 'Unknown',
      company: lead.company || 'Unknown',
      location: lead.location || 'Unknown',
      profile_url: lead.profile_url,
      summary: lead.summary || '',
      analyzed: false,
    };

    // Create the lead in the database
    const { data, error } = await createLead(leadToCreate);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      successful: 1,
      lead: data,
      message: `Successfully added ${lead.name} to your leads.`,
    });
  } catch (error: any) {
    console.error('Error adding manual lead:', error);
    return NextResponse.json(
      { error: `Failed to add lead: ${error.message}` },
      { status: 500 }
    );
  }
} 