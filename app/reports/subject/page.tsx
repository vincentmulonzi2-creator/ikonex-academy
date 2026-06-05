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

interface StudentPerformance {
  studentId: string
  studentName: string
  admissionNo: string
  caScore: number | null
  examScore: number | null
  totalScore: number
  averageScore: number
  grade: string
  gradeColor: string
  status: string
}

export default function SubjectPerformancePage() {
  const [classes, setClasses] = useState<ClassStream[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedTerm, setSelectedTerm] = useState('All')
  const [performanceData, setPerformanceData] = useState<StudentPerformance[]>([])
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

  const generateReport = async () => {
    if (!selectedClass || !selectedSubject) {
      alert('Please select both a class and a subject')
      return
    }
    
    setLoading(true)
    try {
      const res = await fetch(`/api/reports/subject/${selectedClass}/${selectedSubject}?term=${selectedTerm}`)
      const data = await res.json()
      setPerformanceData(data.students || [])
      setClassInfo(data.classInfo)
      setSubjectInfo(data.subjectInfo)
    } catch (error) {
      alert('Failed to generate report')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getClassAverage = () => {
    if (performanceData.length === 0) return 0
    const validScores = performanceData.filter(s => s.averageScore > 0)
    if (validScores.length === 0) return 0
    const total = validScores.reduce((sum, s) => sum + s.averageScore, 0)
    return total / validScores.length
  }

  const getPassCount = () => {
    return performanceData.filter(s => s.averageScore >= 50).length
  }

  const getFailCount = () => {
    return performanceData.filter(s => s.averageScore < 50 && s.averageScore > 0).length
  }

  const getNoScoreCount = () => {
    return performanceData.filter(s => s.averageScore === 0).length
  }

  const getPassRate = () => {
    const withScores = performanceData.filter(s => s.averageScore > 0)
    if (withScores.length === 0) return 0
    return (getPassCount() / withScores.length) * 100
  }

  const getHighestScore = () => {
    const withScores = performanceData.filter(s => s.averageScore > 0)
    if (withScores.length === 0) return null
    return withScores.reduce((max, s) => s.averageScore > max.averageScore ? s : max, withScores[0])
  }

  const getLowestScore = () => {
    const withScores = performanceData.filter(s => s.averageScore > 0)
    if (withScores.length === 0) return null
    return withScores.reduce((min, s) => s.averageScore < min.averageScore ? s : min, withScores[0])
  }

  const getTermLabel = () => {
    if (selectedTerm === 'Term 1') return 'Term 1'
    if (selectedTerm === 'Term 2') return 'Term 2'
    if (selectedTerm === 'Term 3') return 'Term 3'
    return 'All Terms'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button onClick={() => window.location.href = '/reports'} className="mb-4 text-blue-600 hover:text-blue-800">
          ← Back to Reports
        </button>
        
        <h1 className="text-2xl font-bold mb-6">📊 Class Performance by Subject</h1>
        
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
            onClick={generateReport}
            disabled={loading}
            className="w-full bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition duration-200"
          >
            {loading ? '⏳ Generating Report...' : '🚀 Generate Subject Performance Report'}
          </button>
        </div>
        
        {/* Report Results */}
        {performanceData.length > 0 && classInfo && subjectInfo && (
          <>
            {/* Report Header */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {classInfo.name} - {subjectInfo.name}
              </h2>
              <p className="text-gray-600 mt-1">
                Term: {getTermLabel()} | Students: {performanceData.length}
              </p>
            </div>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <p className="text-gray-500 text-sm">Class Average</p>
                <p className="text-2xl font-bold text-indigo-600">{getClassAverage().toFixed(2)}%</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <p className="text-gray-500 text-sm">Passing</p>
                <p className="text-2xl font-bold text-green-600">{getPassCount()}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <p className="text-gray-500 text-sm">Failing</p>
                <p className="text-2xl font-bold text-red-600">{getFailCount()}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <p className="text-gray-500 text-sm">No Score</p>
                <p className="text-2xl font-bold text-gray-600">{getNoScoreCount()}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <p className="text-gray-500 text-sm">Pass Rate</p>
                <p className="text-2xl font-bold text-purple-600">{getPassRate().toFixed(1)}%</p>
              </div>
            </div>
            
            {/* Top/Bottom Performers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {getHighestScore() && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-green-600 text-sm font-semibold">🏆 TOP PERFORMER</p>
                  <p className="text-lg font-bold">{getHighestScore()?.studentName}</p>
                  <p className="text-gray-600">
                    Score: {getHighestScore()?.averageScore.toFixed(2)}% | Grade: {getHighestScore()?.grade}
                  </p>
                </div>
              )}
              {getLowestScore() && (
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-red-600 text-sm font-semibold">⚠️ NEEDS IMPROVEMENT</p>
                  <p className="text-lg font-bold">{getLowestScore()?.studentName}</p>
                  <p className="text-gray-600">
                    Score: {getLowestScore()?.averageScore.toFixed(2)}% | Grade: {getLowestScore()?.grade}
                  </p>
                </div>
              )}
            </div>
            
            {/* Performance Table */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admission No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CA Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Average</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {performanceData.map((student, index) => (
                      <tr key={student.studentId} className={`${index < 3 ? 'bg-yellow-50' : ''} hover:bg-gray-50`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                          {index === 0 && '🥇 '}
                          {index === 1 && '🥈 '}
                          {index === 2 && '🥉 '}
                          #{index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.studentName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.admissionNo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {student.caScore ? `${student.caScore}%` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {student.examScore ? `${student.examScore}%` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                          {student.averageScore > 0 ? `${student.averageScore.toFixed(2)}%` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.averageScore > 0 && (
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${student.gradeColor}`}>
                              {student.grade}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.averageScore > 0 ? (
                            <span className={student.averageScore >= 50 ? 'text-green-600' : 'text-red-600'}>
                              {student.averageScore >= 50 ? '✅ Pass' : '❌ Fail'}
                            </span>
                          ) : (
                            <span className="text-gray-400">No Score</span>
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
        
        {/* Empty State */}
        {performanceData.length === 0 && selectedClass && selectedSubject && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <p className="text-yellow-800">No scores recorded for this subject in the selected class.</p>
            <Link href="/scores/record" className="inline-block mt-4 text-indigo-600 hover:text-indigo-800">
              → Go to Record Scores
            </Link>
          </div>
        )}
        
        {/* Instructions */}
        {!selectedClass && !selectedSubject && !loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <p className="text-blue-800">Select a class and subject above to view performance.</p>
          </div>
        )}
      </div>
    </div>
  )
}