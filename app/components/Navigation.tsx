'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const router = useRouter()

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 hover:bg-blue-700 px-3 py-2 rounded-lg transition">
              <span className="text-xl">🏠</span>
              <span className="font-bold">Ikonex Academy</span>
            </Link>
            
            <div className="hidden md:flex space-x-1">
              <Link href="/" className="px-3 py-2 rounded-lg hover:bg-blue-700 transition">Dashboard</Link>
              <Link href="/classes" className="px-3 py-2 rounded-lg hover:bg-blue-700 transition">Classes</Link>
              <Link href="/students" className="px-3 py-2 rounded-lg hover:bg-blue-700 transition">Students</Link>
              <Link href="/subjects" className="px-3 py-2 rounded-lg hover:bg-blue-700 transition">Subjects</Link>
              <Link href="/scores" className="px-3 py-2 rounded-lg hover:bg-blue-700 transition">Scores</Link>
              <Link href="/scores/record" className="px-3 py-2 rounded-lg hover:bg-blue-700 transition">Record</Link>
              <Link href="/reports" className="px-3 py-2 rounded-lg hover:bg-blue-700 transition">Reports</Link>
            </div>
          </div>
          
          <button
            onClick={() => router.back()}
            className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition flex items-center space-x-2"
          >
            <span>◀</span>
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden bg-blue-700 py-2 overflow-x-auto whitespace-nowrap">
        <div className="flex space-x-4 px-4">
          <Link href="/" className="px-3 py-1 rounded hover:bg-blue-600">Dashboard</Link>
          <Link href="/classes" className="px-3 py-1 rounded hover:bg-blue-600">Classes</Link>
          <Link href="/students" className="px-3 py-1 rounded hover:bg-blue-600">Students</Link>
          <Link href="/subjects" className="px-3 py-1 rounded hover:bg-blue-600">Subjects</Link>
          <Link href="/scores" className="px-3 py-1 rounded hover:bg-blue-600">Scores</Link>
          <Link href="/scores/record" className="px-3 py-1 rounded hover:bg-blue-600">Record</Link>
          <Link href="/reports" className="px-3 py-1 rounded hover:bg-blue-600">Reports</Link>
        </div>
      </div>
    </nav>
  )
}