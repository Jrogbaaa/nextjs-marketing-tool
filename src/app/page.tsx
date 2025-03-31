import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-4">
          <Link 
            href="/import" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Import Leads
          </Link>
          <Link 
            href="/leads/analyze" 
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Analyze Leads
          </Link>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-500 mb-2">Total Leads</div>
          <div className="text-3xl font-bold text-gray-900">0</div>
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <span className="text-green-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              0%
            </span>
            <span className="ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-500 mb-2">Analyzed Leads</div>
          <div className="text-3xl font-bold text-gray-900">0</div>
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <span className="text-gray-500">0% of total</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-500 mb-2">Generated Insights</div>
          <div className="text-3xl font-bold text-gray-900">0</div>
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <span className="text-blue-500">0 avg. per lead</span>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <svg 
              className="w-16 h-16 mb-4 text-gray-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <p className="mb-2 text-lg">No recent activity</p>
            <p className="text-sm">Import leads to get started with analysis</p>
          </div>
        </div>
      </div>

      {/* Getting started guide */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Getting Started</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">1</div>
              </div>
              <div className="ml-4">
                <h3 className="text-md font-medium text-gray-900">Import LinkedIn Leads</h3>
                <p className="text-gray-600">Import leads from Phantombuster or upload a CSV file.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">2</div>
              </div>
              <div className="ml-4">
                <h3 className="text-md font-medium text-gray-900">Generate AI Insights</h3>
                <p className="text-gray-600">Select leads to analyze and generate marketing insights.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">3</div>
              </div>
              <div className="ml-4">
                <h3 className="text-md font-medium text-gray-900">Review and Rate Insights</h3>
                <p className="text-gray-600">Provide feedback on insights to improve future recommendations.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Link 
              href="/import" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              Get started now
              <svg 
                className="ml-1 w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 