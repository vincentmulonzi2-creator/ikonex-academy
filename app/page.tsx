'use client'

import Navigation from '@/app/components/Navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    classes: 0,
    subjects: 0,
    totalMarks: 0,
    averageScore: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [studentsRes, classesRes, subjectsRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/classes'),
        fetch('/api/subjects')
      ])
      
      const students = await studentsRes.json()
      const classes = await classesRes.json()
      const subjects = await subjectsRes.json()
      
      // Calculate total marks and average across all students
      let totalMarksSum = 0
      let totalAverageSum = 0
      let studentsWithScores = 0
      
      students.forEach((student: any) => {
        if (student.totalMarks) {
          totalMarksSum += student.totalMarks
        }
        // Use averageScore directly from student data
        if (student.averageScore && student.averageScore > 0) {
          totalAverageSum += student.averageScore
          studentsWithScores++
        }
      })
      
      const averageScore = studentsWithScores > 0 ? totalAverageSum / studentsWithScores : 0
      
      setStats({
        students: Array.isArray(students) ? students.length : 0,
        classes: Array.isArray(classes) ? classes.length : 0,
        subjects: Array.isArray(subjects) ? subjects.length : 0,
        totalMarks: totalMarksSum,
        averageScore: parseFloat(averageScore.toFixed(2))
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="text-center py-8">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Students</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.students}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Class Streams</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.classes}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Subjects</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">{stats.subjects}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Marks</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">{stats.totalMarks}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Average Score</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">{stats.averageScore}%</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/students/new" className="bg-blue-500 text-white text-center px-4 py-2 rounded hover:bg-blue-600">
              Register New Student
            </Link>
            <Link href="/scores/record" className="bg-green-500 text-white text-center px-4 py-2 rounded hover:bg-green-600">
              Record Assessment Scores
            </Link>
            <Link href="/reports" className="bg-purple-500 text-white text-center px-4 py-2 rounded hover:bg-purple-600">
              Generate Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}