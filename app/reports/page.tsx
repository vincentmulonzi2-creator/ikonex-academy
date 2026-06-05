'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navigation from '@/app/components/Navigation'

interface ClassStream {
  id: string
  name: string
  code: string
}

interface StudentReport {
  studentId: string
  name: string
  admissionNo: string
  totalMarks: number
  averageScore: number
}

export default function ReportsPage() {
  const [classes, setClasses] = useState<ClassStream[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [reportData, setReportData] = useState<StudentReport[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes')
      const data = await res.json()
      setClasses(data)
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const generateReport = async () => {
    if (!selectedClass) {
      alert('Please select a class')
      return
    }
    
    setLoading(true)
    try {
      const res = await fetch(`/api/reports/class/${selectedClass}`)
      const data = await res.json()
      setReportData(data)
    } catch (error) {
      alert('Failed to generate report')
    } finally {
      setLoading(false)
    }
  }

  const getGrade = (score: number) => {
    if (score >= 80) return { letter: 'A', color: 'text-green-600', bg: 'bg-green-100' }
    if (score >= 70) return { letter: 'B', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (score >= 60) return { letter: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    if (score >= 50) return { letter: 'D', color: 'text-orange-600', bg: 'bg-orange-100' }
    return { letter: 'F', color: 'text-red-600', bg: 'bg-red-100' }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">📊 Reports Dashboard</h1>
        
        {/* Report Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">📚 Class Overall Performance</h2>
            <p className="text-gray-600 mb-4">View overall class rankings based on all subjects and terms.</p>
            <Link 
              href="#class-report"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center"
            >
              Generate Class Report ↓
            </Link>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">📖 Subject Performance by Class</h2>
            <p className="text-gray-600 mb-4">View detailed performance for a specific subject within a class.</p>
            <Link 
              href="/reports/subject"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-center"
            >
              Go to Subject Performance →
            </Link>
          </div>
        </div>
        
        {/* Class Report Section */}
        <div id="class-report">
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Generate Class Report</h2>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Class Stream</label>
                <select
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2.5"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="">-- Choose a class --</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.code})
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={generateReport}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? '⏳ Generating...' : '🚀 Generate Report'}
              </button>
            </div>
          </div>
          
          {reportData.length > 0 && (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <h2 className="text-xl font-bold">📈 Performance Summary</h2>
                <p className="text-sm text-gray-600 mt-1">Total Students: {reportData.length}</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admission No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Marks</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Average (%)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.map((student, index) => {
                      const grade = getGrade(student.averageScore)
                      return (
                        <tr key={student.studentId} className={index === 0 ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                            {index === 0 && '🥇 '}
                            {index === 1 && '🥈 '}
                            {index === 2 && '🥉 '}
                            #{index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.admissionNo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {student.totalMarks}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`font-bold ${grade.color}`}>
                              {student.averageScore.toFixed(2)}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${grade.bg} ${grade.color}`}>
                              {grade.letter}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {reportData.length === 0 && selectedClass && !loading && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
              <p className="text-yellow-800">No scores recorded for this class yet.</p>
              <Link href="/scores/record" className="inline-block mt-4 text-blue-600 hover:text-blue-800">
                → Go to Record Scores
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}