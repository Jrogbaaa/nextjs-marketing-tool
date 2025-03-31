import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LinkedIn Lead Analysis',
  description: 'Analyze LinkedIn leads for marketing insights',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <div className="flex flex-col min-h-screen">
          <header className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-6 h-6 text-blue-600"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <span className="text-xl font-semibold text-gray-900">LinkedIn Lead Analysis</span>
              </div>
              <nav>
                <ul className="flex space-x-6">
                  <li>
                    <a href="/" className="text-gray-600 hover:text-blue-600">Dashboard</a>
                  </li>
                  <li>
                    <a href="/leads" className="text-gray-600 hover:text-blue-600">Leads</a>
                  </li>
                  <li>
                    <a href="/insights" className="text-gray-600 hover:text-blue-600">Insights</a>
                  </li>
                  <li>
                    <a href="/import" className="text-gray-600 hover:text-blue-600">Import</a>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
          
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          
          <footer className="bg-white border-t border-gray-200 py-6">
            <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} LinkedIn Lead Analysis System
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
} 