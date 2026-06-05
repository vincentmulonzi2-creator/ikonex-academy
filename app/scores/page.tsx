'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navigation from '@/app/components/Navigation'

interface Score {
  id: string
  marks: number
  assessmentType: string
  academicTerm: string
  student: {
    id: string
    name: string
    admissionNo: string
  }
  subject: {
    id: string
    name: string
    code: string
  }
}

export default function ScoresPage() {
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchScores()
  }, [])

  const fetchScores = async () => {
    try {
      const res = await fetch('/api/scores')
      const data = await res.json()
      setScores(data)
    } catch (error) {
      console.error('Error fetching scores:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this score?')) return
    
    try {
      const res = await fetch(`/api/scores/${id}`, { method: 'DELETE' })
      if (res.ok) {
        alert('Score deleted successfully!')
        fetchScores()
      } else {
        alert('Failed to delete score')
      }
    } catch (error) {
      alert('Error deleting score')
    }
  }

  const getGrade = (marks: number) => {
    if (marks >= 80) return { letter: 'A', color: 'text-green-600' }
    if (marks >= 70) return { letter: 'B', color: 'text-blue-600' }
    if (marks >= 60) return { letter: 'C', color: 'text-yellow-600' }
    if (marks >= 50) return { letter: 'D', color: 'text-orange-600' }
    return { letter: 'F', color: 'text-red-600' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="text-center py-8">Loading scores...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">📊 All Scores</h1>
          <Link 
            href="/scores/record" 
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            + Record New Score
          </Link>
        </div>

        {scores.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No scores recorded yet.</p>
            <Link href="/scores/record" className="text-blue-600 mt-2 inline-block">
              Click here to record your first score →
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admission No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Term</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scores.map((score) => {
                    const grade = getGrade(score.marks)
                    return (
                      <tr key={score.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {score.student?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {score.student?.admissionNo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {score.subject?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {score.assessmentType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                          {score.marks}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`font-bold ${grade.color}`}>{grade.letter}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {score.academicTerm}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <Link
                            href={`/scores/${score.id}/edit`}
                            className="text-green-600 hover:text-green-900 font-medium"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(score.id)}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}