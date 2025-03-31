'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ImportPage() {
  const router = useRouter();
  const [importMethod, setImportMethod] = useState<'phantombuster' | 'csv' | 'manual'>('phantombuster');
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  
  // Form states
  const [phantombusterContainerId, setPhantombusterContainerId] = useState('');
  const [maxProfiles, setMaxProfiles] = useState('50');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [manualLead, setManualLead] = useState({
    name: '',
    title: '',
    company: '',
    location: '',
    profile_url: '',
    summary: '',
  });

  const handleImportFromPhantombuster = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsImporting(true);
    setImportStatus(null);

    try {
      const response = await fetch('/api/import/phantombuster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          containerId: phantombusterContainerId,
          maxProfiles: parseInt(maxProfiles),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setImportStatus({
          success: true,
          message: `Successfully imported ${data.successful} leads.`,
        });
        // Redirect to leads page after 2 seconds
        setTimeout(() => {
          router.push('/leads');
        }, 2000);
      } else {
        setImportStatus({
          success: false,
          message: data.error || 'Failed to import leads.',
        });
      }
    } catch (error) {
      setImportStatus({
        success: false,
        message: 'An error occurred while importing leads.',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportFromCSV = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!csvFile) {
      setImportStatus({
        success: false,
        message: 'Please select a CSV file to import.',
      });
      return;
    }

    setIsImporting(true);
    setImportStatus(null);

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await fetch('/api/import/csv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setImportStatus({
          success: true,
          message: `Successfully imported ${data.successful} leads.`,
        });
        // Redirect to leads page after 2 seconds
        setTimeout(() => {
          router.push('/leads');
        }, 2000);
      } else {
        setImportStatus({
          success: false,
          message: data.error || 'Failed to import leads from CSV.',
        });
      }
    } catch (error) {
      setImportStatus({
        success: false,
        message: 'An error occurred while importing leads from CSV.',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleManualImport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!manualLead.name || !manualLead.profile_url) {
      setImportStatus({
        success: false,
        message: 'Name and LinkedIn profile URL are required.',
      });
      return;
    }

    setIsImporting(true);
    setImportStatus(null);

    try {
      const response = await fetch('/api/import/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(manualLead),
      });

      const data = await response.json();

      if (response.ok) {
        setImportStatus({
          success: true,
          message: 'Lead added successfully.',
        });
        // Reset form
        setManualLead({
          name: '',
          title: '',
          company: '',
          location: '',
          profile_url: '',
          summary: '',
        });
      } else {
        setImportStatus({
          success: false,
          message: data.error || 'Failed to add lead.',
        });
      }
    } catch (error) {
      setImportStatus({
        success: false,
        message: 'An error occurred while adding the lead.',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Import Leads</h1>
      </div>

      {/* Import method selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Select Import Method</h2>
        </div>
        <div className="p-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setImportMethod('phantombuster')}
              className={`px-4 py-2 rounded-md transition-colors ${
                importMethod === 'phantombuster'
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Phantombuster
            </button>
            <button
              onClick={() => setImportMethod('csv')}
              className={`px-4 py-2 rounded-md transition-colors ${
                importMethod === 'csv'
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              CSV Upload
            </button>
            <button
              onClick={() => setImportMethod('manual')}
              className={`px-4 py-2 rounded-md transition-colors ${
                importMethod === 'manual'
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Manual Entry
            </button>
          </div>
        </div>
      </div>

      {/* Import status message */}
      {importStatus && (
        <div className={`p-4 rounded-md ${importStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {importStatus.success ? (
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p>{importStatus.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Phantombuster import form */}
      {importMethod === 'phantombuster' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Import from Phantombuster</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleImportFromPhantombuster} className="space-y-4">
              <div>
                <label htmlFor="containerId" className="block text-sm font-medium text-gray-700 mb-1">
                  Phantombuster Container ID
                </label>
                <input
                  type="text"
                  id="containerId"
                  value={phantombusterContainerId}
                  onChange={(e) => setPhantombusterContainerId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your Phantombuster Container ID"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  You can find this in your Phantombuster dashboard.
                </p>
              </div>
              <div>
                <label htmlFor="maxProfiles" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Profiles
                </label>
                <input
                  type="number"
                  id="maxProfiles"
                  value={maxProfiles}
                  onChange={(e) => setMaxProfiles(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Limit the number of profiles to import (1-500).
                </p>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isImporting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                  {isImporting ? 'Importing...' : 'Import from Phantombuster'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Upload import form */}
      {importMethod === 'csv' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Import from CSV</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleImportFromCSV} className="space-y-4">
              <div>
                <label htmlFor="csvFile" className="block text-sm font-medium text-gray-700 mb-1">
                  Upload CSV File
                </label>
                <input
                  type="file"
                  id="csvFile"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  CSV file must include: name, title, company, location, profile_url columns.
                </p>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isImporting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                  {isImporting ? 'Importing...' : 'Import from CSV'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual lead entry form */}
      {importMethod === 'manual' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Manual Lead Entry</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleManualImport} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={manualLead.name}
                    onChange={(e) => setManualLead({ ...manualLead, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={manualLead.title}
                    onChange={(e) => setManualLead({ ...manualLead, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={manualLead.company}
                    onChange={(e) => setManualLead({ ...manualLead, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={manualLead.location}
                    onChange={(e) => setManualLead({ ...manualLead, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="profile_url" className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn Profile URL *
                </label>
                <input
                  type="url"
                  id="profile_url"
                  value={manualLead.profile_url}
                  onChange={(e) => setManualLead({ ...manualLead, profile_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://www.linkedin.com/in/username"
                  required
                />
              </div>
              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                  Summary
                </label>
                <textarea
                  id="summary"
                  value={manualLead.summary}
                  onChange={(e) => setManualLead({ ...manualLead, summary: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isImporting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                  {isImporting ? 'Adding...' : 'Add Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 