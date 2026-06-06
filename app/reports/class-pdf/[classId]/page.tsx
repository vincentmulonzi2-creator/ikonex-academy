'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { pdf } from '@react-pdf/renderer'
import Navigation from '@/app/components/Navigation'
import ClassReportPDF from '@/app/components/ClassReportPDF'

export default function ClassReportPDFPage() {
  const params = useParams()
  const router = useRouter()
  const [classData, setClassData] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    fetchClassReport()
  }, [])

  const fetchClassReport = async () => {
    try {
      // Fetch class performance data
      const res = await fetch(`/api/reports/class/${params.classId}`)
      const data = await res.json()
      setStudents(data)
      
      // Calculate summary statistics
      const totalStudents = data.length
      const totalMarks = data.reduce((sum: number, s: any) => sum + s.totalMarks, 0)
      
      // Calculate class average (average of averages, not total marks)
      let averageSum = 0
      data.forEach((s: any) => {
        averageSum += s.averageScore
      })
      const classAverage = data.length > 0 ? averageSum / data.length : 0
      
      const passCount = data.filter((s: any) => s.averageScore >= 50).length
      const failCount = totalStudents - passCount
      const passRate = totalStudents > 0 ? (passCount / totalStudents) * 100 : 0
      
      const topStudentData = data.length > 0 ? data[0] : null
      
      setSummary({
        totalStudents,
        totalMarks,
        classAverage,
        passCount,
        failCount,
        passRate,
        topStudent: topStudentData?.name || '',
        topScore: topStudentData?.averageScore || 0
      })
      
      // Fetch class info
      const classRes = await fetch(`/api/classes/${params.classId}`)
      const classInfo = await classRes.json()
      setClassData(classInfo)
    } catch (error) {
      console.error('Error fetching class report:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = async () => {
    setDownloading(true)
    try {
      const blob = await pdf(
        <ClassReportPDF 
          className={classData?.name || 'Class'}
          classCode={classData?.code || ''}
          academicYear={classData?.academicYear || '2026'}
          term="Term 1"
          students={students}
          summary={summary}
        />
      ).toBlob()
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Class_Report_${classData?.name}_${classData?.code}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF')
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="text-center py-8">Loading class report...</div>
      </div>
    )
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="text-center py-8">Class not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => router.back()} className="mb-4 text-blue-600 hover:text-blue-800">
          ← Back
        </button>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Generate Class Performance Report</h1>
          <div className="mb-6">
            <p className="text-lg">Class: <strong>{classData.name} ({classData.code})</strong></p>
            <p className="text-gray-600">Academic Year: {classData.academicYear}</p>
            <p className="text-gray-600">Total Students: {students.length}</p>
            <p className="text-gray-600">Class Average: {summary?.classAverage.toFixed(2)}%</p>
          </div>
          
          <button
            onClick={downloadPDF}
            disabled={downloading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-lg font-semibold"
          >
            {downloading ? '⏳ Generating PDF...' : '📄 Download Class Report (PDF)'}
          </button>
          
          <p className="text-sm text-gray-500 mt-4">
            Click the button above to download a professional PDF class performance report.
          </p>
        </div>
      </div>
    </div>
  )
}