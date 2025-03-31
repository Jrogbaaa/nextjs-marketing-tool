import { NextResponse } from 'next/server';
import { createLead } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded. Please select a CSV file.' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a CSV file.' },
        { status: 400 }
      );
    }

    // Read the file content
    const text = await file.text();
    const leads = parseCSV(text);

    if (!leads || leads.length === 0) {
      return NextResponse.json(
        { error: 'No valid leads found in the CSV file.' },
        { status: 400 }
      );
    }

    // Import leads into the database
    const results = {
      successful: 0,
      failed: 0,
      errors: [] as { line: number; error: string }[],
    };

    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
      
      // Validate required fields
      if (!lead.name || !lead.profile_url) {
        results.failed++;
        results.errors.push({
          line: i + 2, // +2 because of 0-index and header row
          error: 'Missing required fields (name or profile_url)',
        });
        continue;
      }

      try {
        const { error } = await createLead({
          name: lead.name,
          title: lead.title || 'Unknown',
          company: lead.company || 'Unknown',
          location: lead.location || 'Unknown',
          profile_url: lead.profile_url,
          summary: lead.summary || '',
          analyzed: false,
        });

        if (error) {
          results.failed++;
          results.errors.push({
            line: i + 2,
            error: error.message,
          });
        } else {
          results.successful++;
        }
      } catch (error: any) {
        results.failed++;
        results.errors.push({
          line: i + 2,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      successful: results.successful,
      failed: results.failed,
      errors: results.errors,
      total: leads.length,
      message: `Successfully imported ${results.successful} leads, failed to import ${results.failed} leads.`,
    });
  } catch (error: any) {
    console.error('Error importing leads from CSV:', error);
    return NextResponse.json(
      { error: `Failed to import leads: ${error.message}` },
      { status: 500 }
    );
  }
}

// Helper function to parse CSV file
function parseCSV(csv: string): Array<Record<string, string>> {
  // Split by lines
  const lines = csv.split(/\r?\n/);
  
  // Get headers from the first line
  const headers = lines[0].split(',').map(header => header.trim());
  
  // Create result array
  const results: Array<Record<string, string>> = [];
  
  // Process each line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines
    
    const values = line.split(',').map(value => value.trim());
    
    // Create an object with the headers as keys
    const obj: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[j] || '';
    }
    
    results.push(obj);
  }
  
  return results;
} 