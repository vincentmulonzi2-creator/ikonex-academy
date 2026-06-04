import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ikonex Academy - Student Management System',
  description: 'Comprehensive student management system for Ikonex Academy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">{children}</body>
    </html>
  )
}