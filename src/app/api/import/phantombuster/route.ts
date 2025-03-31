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
    const { data: scrapeData, error: scrapeError } = await launchLinkedInScraper({
      containerId,
      maxProfiles,
    });

    if (scrapeError) {
      return NextResponse.json({ error: `Failed to scrape profiles: ${scrapeError}` }, { status: 500 });
    }

    if (!scrapeData || !Array.isArray(scrapeData) || scrapeData.length === 0) {
      return NextResponse.json({ error: 'No profiles found or invalid data format' }, { status: 404 });
    }

    // Import the scraped leads into the database
    const importResult = await importLeadsFromPhantombuster(scrapeData);

    return NextResponse.json({
      successful: importResult.successful,
      failed: importResult.failed,
      errors: importResult.errors,
      total: scrapeData.length,
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