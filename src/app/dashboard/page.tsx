import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">Dashboard</h1>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <Link
            href="/dashboard/uploads"
            className="btn-primary"
            tabIndex={0}
            aria-label="Upload data"
          >
            Upload Data
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Leads Card */}
        <div className="card overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Leads
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      324
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                href="/dashboard/leads"
                className="font-medium text-primary-700 hover:text-primary-900"
                tabIndex={0}
                aria-label="View all leads"
              >
                View all
              </Link>
            </div>
          </div>
        </div>

        {/* Analyzed Leads Card */}
        <div className="card overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Analyzed Leads
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      256
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                href="/dashboard/leads"
                className="font-medium text-primary-700 hover:text-primary-900"
                tabIndex={0}
                aria-label="View analyzed leads"
              >
                View all
              </Link>
            </div>
          </div>
        </div>

        {/* Pending Analysis Card */}
        <div className="card overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Analysis
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      68
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                href="/dashboard/leads"
                className="font-medium text-primary-700 hover:text-primary-900"
                tabIndex={0}
                aria-label="View pending leads"
              >
                View all
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Insights */}
      <h2 className="mt-8 text-lg font-medium text-gray-900">Recent Insights</h2>
      <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Industry Trend Insight */}
        <div className="card">
          <h3 className="text-base font-semibold text-gray-900">Industry Trend</h3>
          <p className="mt-1 text-sm text-gray-500">Based on your recent leads</p>
          <div className="mt-4">
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm">
                <strong>67%</strong> of your recent leads work in <strong>Software Development</strong> and related industries.
              </p>
            </div>
            <div className="mt-4 flex justify-between">
              <button 
                className="text-sm text-primary-600 hover:text-primary-800"
                aria-label="Save this insight"
              >
                Save
              </button>
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  High confidence
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Network Insight */}
        <div className="card">
          <h3 className="text-base font-semibold text-gray-900">Connection Network</h3>
          <p className="mt-1 text-sm text-gray-500">Potential reach analysis</p>
          <div className="mt-4">
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm">
                Your leads have an <strong>average of 842 connections</strong> each, giving you potential reach to over <strong>180,000</strong> professionals.
              </p>
            </div>
            <div className="mt-4 flex justify-between">
              <button 
                className="text-sm text-primary-600 hover:text-primary-800"
                aria-label="Save this insight"
              >
                Save
              </button>
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Medium confidence
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Skill Set Insight */}
        <div className="card">
          <h3 className="text-base font-semibold text-gray-900">Skill Analysis</h3>
          <p className="mt-1 text-sm text-gray-500">Common skills among leads</p>
          <div className="mt-4">
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm">
                Top skills include <strong>JavaScript (78%)</strong>, <strong>React (63%)</strong>, and <strong>Node.js (47%)</strong>. Consider targeting content toward web development.
              </p>
            </div>
            <div className="mt-4 flex justify-between">
              <button 
                className="text-sm text-primary-600 hover:text-primary-800"
                aria-label="Save this insight"
              >
                Save
              </button>
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  High confidence
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View All Insights button */}
      <div className="mt-6 text-center">
        <Link
          href="/dashboard/leads"
          className="btn-secondary"
          tabIndex={0}
          aria-label="View all insights"
        >
          View All Leads
        </Link>
      </div>
    </DashboardLayout>
  );
} 