'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navigation from '@/app/components/Navigation'

interface ClassStream {
  id: string
  name: string
  code: string
}

interface Subject {
  id: string
  name: string
  code: string
}

interface StudentRank {
  studentId: string
  studentName: string
  admissionNo: string
  averageScore: number
  subjectPosition: number
  subjectRank: string
  caScore: number | null
  examScore: number | null
}

export default function SubjectPositionsPage() {
  const [classes, setClasses] = useState<ClassStream[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedTerm, setSelectedTerm] = useState('All')
  const [rankings, setRankings] = useState<StudentRank[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [classInfo, setClassInfo] = useState<ClassStream | null>(null)
  const [subjectInfo, setSubjectInfo] = useState<Subject | null>(null)

  useEffect(() => {
    fetchClasses()
    fetchSubjects()
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

  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/subjects')
      const data = await res.json()
      setSubjects(data)
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const generateRankings = async () => {
    if (!selectedClass || !selectedSubject) {
      alert('Please select both a class and a subject')
      return
    }
    
    setLoading(true)
    try {
      const res = await fetch(`/api/reports/subject-positions/${selectedClass}/${selectedSubject}?term=${selectedTerm}`)
      const data = await res.json()
      setRankings(data.students || [])
      setSummary(data.summary)
      
      const foundClass = classes.find(c => c.id === selectedClass)
      const foundSubject = subjects.find(s => s.id === selectedSubject)
      setClassInfo(foundClass || null)
      setSubjectInfo(foundSubject || null)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to generate rankings')
    } finally {
      setLoading(false)
    }
  }

  const getMedalDisplay = (position: number) => {
    if (position === 1) return '🥇 1st'
    if (position === 2) return '🥈 2nd'
    if (position === 3) return '🥉 3rd'
    return `${position}th`
  }

  const getMedalStyle = (position: number) => {
    if (position === 1) return 'bg-yellow-100 text-yellow-700'
    if (position === 2) return 'bg-gray-100 text-gray-600'
    if (position === 3) return 'bg-amber-100 text-amber-700'
    return 'bg-gray-50 text-gray-400'
  }

  const getGradeLetter = (score: number) => {
    if (score >= 80) return 'A'
    if (score >= 70) return 'B'
    if (score >= 60) return 'C'
    if (score >= 50) return 'D'
    return 'F'
  }

  const getGradeStyle = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700'
    if (score >= 70) return 'bg-blue-100 text-blue-700'
    if (score >= 60) return 'bg-yellow-100 text-yellow-700'
    if (score >= 50) return 'bg-orange-100 text-orange-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button onClick={() => window.location.href = '/reports'} className="mb-4 text-blue-600 hover:text-blue-800">
          ← Back to Reports
        </button>
        
        <h1 className="text-2xl font-bold mb-6">🏆 Subject Positions & Rankings</h1>
        
        {/* Selection Form */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Select Criteria</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class Stream</label>
              <select
                className="w-full border border-gray-300 rounded-md shadow-sm p-2.5"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">-- Select Class --</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.code})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                className="w-full border border-gray-300 rounded-md shadow-sm p-2.5"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">-- Select Subject --</option>
                {subjects.map((subj) => (
                  <option key={subj.id} value={subj.id}>
                    {subj.name} ({subj.code})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academic Term</label>
              <select
                className="w-full border border-gray-300 rounded-md shadow-sm p-2.5"
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
              >
                <option value="All">All Terms</option>
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={generateRankings}
            disabled={loading}
            className="w-full bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition duration-200"
          >
            {loading ? '⏳ Generating Rankings...' : '🏆 Generate Subject Rankings'}
          </button>
        </div>
        
        {/* Rankings Results */}
        {rankings.length > 0 && classInfo && subjectInfo && (
          <>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {classInfo.name} - {subjectInfo.name} Rankings
              </h2>
              <p className="text-gray-600 mt-1">
                Term: {selectedTerm} | Total Students: {summary?.totalStudents || 0}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <p className="text-gray-500 text-sm">With Scores</p>
                <p className="text-2xl font-bold text-green-600">{summary?.withScores || 0}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <p className="text-gray-500 text-sm">Without Scores</p>
                <p className="text-2xl font-bold text-gray-600">{summary?.withoutScores || 0}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <p className="text-gray-500 text-sm">Highest Score</p>
                <p className="text-2xl font-bold text-purple-600">{summary?.highestScore || 0}%</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <p className="text-gray-500 text-sm">Lowest Score</p>
                <p className="text-2xl font-bold text-orange-600">{summary?.lowestScore || 0}%</p>
              </div>
            </div>
            
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admission No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CA Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Average</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rankings.map((student) => (
                      <tr key={student.studentId} className={student.subjectPosition <= 3 ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${getMedalStyle(student.subjectPosition)}`}>
                            {getMedalDisplay(student.subjectPosition)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {student.studentName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {student.admissionNo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.caScore ? `${student.caScore}%` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.examScore ? `${student.examScore}%` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold">
                          {student.averageScore > 0 ? `${student.averageScore}%` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.averageScore > 0 && (
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getGradeStyle(student.averageScore)}`}>
                              {getGradeLetter(student.averageScore)}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        
        {rankings.length === 0 && selectedClass && selectedSubject && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <p className="text-yellow-800">No scores recorded for this subject in the selected class.</p>
            <Link href="/scores/record" className="inline-block mt-4 text-indigo-600 hover:text-indigo-800">
              → Go to Record Scores
            </Link>
          </div>
        )}
        
        {!selectedClass && !selectedSubject && !loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <p className="text-blue-800">Select a class and subject above to view rankings.</p>
          </div>
        )}
      </div>
    </div>
  )
}