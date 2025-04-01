import { NextResponse } from 'next/server';
import { launchLinkedInScraper } from '@/lib/phantombuster';
import { importLeadsFromPhantombuster } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { containerId, maxProfiles = 50 } = await request.json();

    if (!containerId) {
      return NextResponse.json({ error: 'Phantombuster container ID is required' }, { status: 400 });
    }

    // Launch the scraper and get the results
    const result = await launchLinkedInScraper(containerId, { maxProfiles });

    if (result.status === 'error') {
      return NextResponse.json({ error: `Failed to scrape profiles: ${result.message || 'Unknown error'}` }, { status: 500 });
    }

    // For GitHub Pages demo, let's use mock data instead of waiting for real scrape
    // In a real app, we would wait for the webhook to deliver the scraped data
    const mockScrapeData = [
      {
        name: "Jane Smith",
        headline: "Senior Frontend Developer at Tech Corp",
        location: "San Francisco, CA",
        profileUrl: "https://linkedin.com/in/janesmith",
        skills: ["JavaScript", "React", "TypeScript", "HTML", "CSS"],
        connectionDegree: 2
      },
      {
        name: "John Doe",
        headline: "Full Stack Engineer | JavaScript | React | Node.js",
        location: "Austin, TX",
        profileUrl: "https://linkedin.com/in/johndoe",
        skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express"],
        connectionDegree: 2
      }
    ];

    // Import the mocked leads into the database
    const importResult = await importLeadsFromPhantombuster(mockScrapeData);

    return NextResponse.json({
      successful: importResult.successful,
      failed: importResult.failed,
      errors: importResult.errors,
      total: mockScrapeData.length,
      message: `Successfully imported ${importResult.successful} leads, failed to import ${importResult.failed} leads.`,
    });
  } catch (error: any) {
    console.error('Error importing leads from Phantombuster:', error);
    return NextResponse.json(
      { error: `Failed to import leads: ${error.message}` },
      { status: 500 }
    );
  }
} 