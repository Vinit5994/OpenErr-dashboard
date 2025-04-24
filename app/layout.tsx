import React from 'react';
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext';

// const inter = Inter({ 
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-inter',
// })

export const metadata = {
  title: 'Error Monitoring Dashboard',
  description: 'Monitor and track errors across your applications',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" >
      <body>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
} 