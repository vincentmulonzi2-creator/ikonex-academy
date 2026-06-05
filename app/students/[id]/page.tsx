'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/app/components/Navigation'

interface Score {
  id: string
  marks: number
  assessmentType: string
  academicTerm: string
  subject: {
    id: string
    name: string
    code: string
  }
}

interface Student {
  id: string
  admissionNo: string
  name: string
  email: string
  phone: string
  address: string
  classStream: {
    id: string
    name: string
    code: string
  }
  scores: Score[]
}

export default function StudentProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTerm, setSelectedTerm] = useState('All')

  useEffect(() => {
    fetchStudentDetails()
  }, [])

  const fetchStudentDetails = async () => {
    try {
      const res = await fetch(`/api/students/${params.id}`)
      const data = await res.json()
      setStudent(data)
    } catch (error) {
      console.error('Error fetching student:', error)
    } finally {
      setLoading(false)
    }
  }

  const getGrade = (marks: number) => {
    if (marks >= 80) return { letter: 'A', color: 'text-green-600', bg: 'bg-green-100' }
    if (marks >= 70) return { letter: 'B', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (marks >= 60) return { letter: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    if (marks >= 50) return { letter: 'D', color: 'text-orange-600', bg: 'bg-orange-100' }
    return { letter: 'F', color: 'text-red-600', bg: 'bg-red-100' }
  }

  const getUniqueSubjects = () => {
    if (!student?.scores) return []
    const subjectsMap = new Map()
    student.scores.forEach(score => {
      if (!subjectsMap.has(score.subject.name)) {
        subjectsMap.set(score.subject.name, score.subject)
      }
    })
    return Array.from(subjectsMap.values())
  }

  const getSubjectAverage = (subjectName: string) => {
    if (!student?.scores) return 0
    const subjectScores = student.scores.filter(s => s.subject.name === subjectName)
    if (subjectScores.length === 0) return 0
    const total = subjectScores.reduce((sum, s) => sum + s.marks, 0)
    return total / subjectScores.length
  }

  const getFilteredScores = () => {
    if (!student?.scores) return []
    if (selectedTerm === 'All') return student.scores
    return student.scores.filter(score => score.academicTerm === selectedTerm)
  }

  const getOverallAverage = () => {
    const filtered = getFilteredScores()
    if (filtered.length === 0) return 0
    const total = filtered.reduce((sum, s) => sum + s.marks, 0)
    return total / filtered.length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="text-center py-8">Loading...</div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="text-center py-8">Student not found</div>
      </div>
    )
  }

  const overallAverage = getOverallAverage()
  const overallGrade = getGrade(overallAverage)
  const uniqueSubjects = getUniqueSubjects()
  const terms = ['All', 'Term 1', 'Term 2', 'Term 3']

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button onClick={() => router.back()} className="mb-4 text-blue-600">
          ← Back
        </button>

        {/* Student Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold">{student.name}</h1>
          <p className="text-gray-500">Admission No: {student.admissionNo}</p>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p>{student.email || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              <p>{student.phone || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Address</p>
              <p>{student.address || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Class</p>
              <Link href={`/classes/${student.classStream?.id}`} className="text-blue-600">
                {student.classStream?.name}
              </Link>
            </div>
          </div>
        </div>

        {/* Term Filter */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex gap-4 items-center">
            <label className="font-medium">Filter by Term:</label>
            <select 
              className="border rounded p-2"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
            >
              {terms.map(term => (
                <option key={term} value={term}>{term}</option>
              ))}
            </select>
            <span className="text-gray-500 text-sm">
              Overall Average: <span className={`font-bold ${overallGrade.color}`}>{overallAverage.toFixed(2)}%</span>
            </span>
          </div>
        </div>

        {/* Performance by Subject */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-xl font-bold">Performance by Subject</h2>
          </div>
          
          {uniqueSubjects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Subject</th>
                    <th className="p-3 text-left">Average</th>
                    <th className="p-3 text-left">Grade</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {uniqueSubjects.map((subject) => {
                    const avg = getSubjectAverage(subject.name)
                    const grade = getGrade(avg)
                    return (
                      <tr key={subject.id} className="border-t">
                        <td className="p-3">{subject.name}</td>
                        <td className="p-3 font-semibold">{avg.toFixed(2)}%</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-sm ${grade.bg} ${grade.color}`}>
                            {grade.letter}
                          </span>
                        </td>
                        <td className="p-3">
                          {avg > 0 ? (avg >= 50 ? '✅ Passing' : '❌ Failing') : '-'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No subject scores recorded</div>
          )}
        </div>

        {/* Detailed Scores */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-xl font-bold">Detailed Scores</h2>
          </div>
          
          {getFilteredScores().length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Subject</th>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">Marks</th>
                    <th className="p-3 text-left">Grade</th>
                    <th className="p-3 text-left">Term</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredScores().map((score) => {
                    const grade = getGrade(score.marks)
                    return (
                      <tr key={score.id} className="border-t">
                        <td className="p-3">{score.subject?.name}</td>
                        <td className="p-3">{score.assessmentType}</td>
                        <td className="p-3 font-semibold">{score.marks}%</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-sm ${grade.bg} ${grade.color}`}>
                            {grade.letter}
                          </span>
                        </td>
                        <td className="p-3">{score.academicTerm}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No scores for selected term</div>
          )}
        </div>
      </div>
    </div>
  )
}