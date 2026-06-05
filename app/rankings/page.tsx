'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navigation from '@/app/components/Navigation'

interface ClassStream {
  id: string
  name: string
  code: string
}

interface StudentRank {
  studentId: string
  name: string
  admissionNo: string
  totalMarks: number
  averageScore: number
  rank: number
  medal: string
}

export default function RankingsPage() {
  const [classes, setClasses] = useState<ClassStream[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [rankings, setRankings] = useState<StudentRank[]>([])
  const [loading, setLoading] = useState(false)
  const [classInfo, setClassInfo] = useState<ClassStream | null>(null)

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

  const generateRankings = async () => {
    if (!selectedClass) {
      alert('Please select a class')
      return
    }
    
    setLoading(true)
    try {
      const res = await fetch(`/api/reports/class/${selectedClass}`)
      const data = await res.json()
      
      const rankedData = data.map((student: any, index: number) => ({
        ...student,
        rank: index + 1,
        medal: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''
      }))
      
      setRankings(rankedData)
      
      const foundClass = classes.find(c => c.id === selectedClass)
      setClassInfo(foundClass || null)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to generate rankings')
    } finally {
      setLoading(false)
    }
  }

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 border-yellow-300'
    if (rank === 2) return 'bg-gray-100 border-gray-300'
    if (rank === 3) return 'bg-amber-100 border-amber-300'
    return ''
  }

  const getGradeColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  const getGradeLetter = (score: number) => {
    if (score >= 80) return 'A'
    if (score >= 70) return 'B'
    if (score >= 60) return 'C'
    if (score >= 50) return 'D'
    return 'F'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">🏆 Class Rankings</h1>
        
        {/* Selection Form */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Select Class to View Rankings</h2>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Class Stream</label>
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
              onClick={generateRankings}
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 w-full md:w-auto"
            >
              {loading ? '⏳ Loading...' : '🏆 Show Rankings'}
            </button>
          </div>
        </div>
        
        {/* Rankings Results */}
        {rankings.length > 0 && classInfo && (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {classInfo.name} Rankings
              </h2>
              <p className="text-gray-600 mt-1">
                Total Students: {rankings.length} | 
                Top Student: {rankings[0]?.name} ({rankings[0]?.averageScore}%)
              </p>
            </div>
            
            {/* Podium for Top 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* 2nd Place */}
              {rankings[1] && (
                <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg p-4 text-center">
                  <div className="text-4xl mb-2">🥈</div>
                  <div className="text-xl font-bold">{rankings[1].name}</div>
                  <div className="text-gray-600">{rankings[1].averageScore}%</div>
                  <div className="text-sm text-gray-500">2nd Place</div>
                </div>
              )}
              
              {/* 1st Place */}
              {rankings[0] && (
                <div className="bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-lg p-6 text-center transform scale-105 shadow-lg">
                  <div className="text-5xl mb-2">👑</div>
                  <div className="text-2xl font-bold text-yellow-800">{rankings[0].name}</div>
                  <div className="text-xl font-bold text-yellow-700">{rankings[0].averageScore}%</div>
                  <div className="text-sm text-yellow-600">🏆 1st Place Champion 🏆</div>
                </div>
              )}
              
              {/* 3rd Place */}
              {rankings[2] && (
                <div className="bg-gradient-to-b from-amber-100 to-amber-200 rounded-lg p-4 text-center">
                  <div className="text-4xl mb-2">🥉</div>
                  <div className="text-xl font-bold">{rankings[2].name}</div>
                  <div className="text-gray-600">{rankings[2].averageScore}%</div>
                  <div className="text-sm text-gray-500">3rd Place</div>
                </div>
              )}
            </div>
            
            {/* Full Rankings Table */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admission No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Marks</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Average</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rankings.map((student) => (
                      <tr key={student.studentId} className={getRankStyle(student.rank)}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                          {student.medal} {student.rank}
                          {student.rank === 1 && 'st'}
                          {student.rank === 2 && 'nd'}
                          {student.rank === 3 && 'rd'}
                          {student.rank > 3 && 'th'}
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
                          <span className={`font-bold ${getGradeColor(student.averageScore)}`}>
                            {student.averageScore.toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold bg-gray-100 ${getGradeColor(student.averageScore)}`}>
                            {getGradeLetter(student.averageScore)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        
        {/* No Data Message */}
        {rankings.length === 0 && selectedClass && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <p className="text-yellow-800">No scores recorded for this class yet.</p>
            <Link href="/scores/record" className="inline-block mt-4 text-indigo-600 hover:text-indigo-800">
              → Go to Record Scores
            </Link>
          </div>
        )}
        
        {/* Instructions */}
        {!selectedClass && !loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <p className="text-blue-800">Select a class above to see student rankings.</p>
            <p className="text-blue-600 text-sm mt-2">Students are automatically ranked by their average score.</p>
          </div>
        )}
      </div>
    </div>
  )
}