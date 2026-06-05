'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { pdf } from '@react-pdf/renderer'
import Navigation from '@/app/components/Navigation'
import ReportCardPDF from '@/app/components/ReportCardPDF'

export default function StudentReportCardPage() {
  const params = useParams()
  const router = useRouter()
  const [student, setStudent] = useState<any>(null)
  const [scores, setScores] = useState<any[]>([])
  const [classRank, setClassRank] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    fetchReportData()
  }, [])

  const fetchReportData = async () => {
    try {
      const res = await fetch(`/api/reports/student/${params.studentId}`)
      const data = await res.json()
      setStudent(data.student)
      setScores(data.scores)
      setClassRank(data.classRank)
      setTotalStudents(data.totalStudents)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = async () => {
    setDownloading(true)
    try {
      const blob = await pdf(
        <ReportCardPDF 
          student={student}
          scores={scores}
          classRank={classRank}
          totalStudents={totalStudents}
          schoolYear="2026"
          term="Term 1"
        />
      ).toBlob()
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Report_Card_${student?.admissionNo}_${student?.name}.pdf`
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
        <div className="text-center py-8">Loading report data...</div>
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => router.back()} className="mb-4 text-blue-600 hover:text-blue-800">
          ← Back
        </button>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Generate Report Card</h1>
          <div className="mb-6">
            <p className="text-lg">Student: <strong>{student.name}</strong></p>
            <p className="text-gray-600">Admission No: {student.admissionNo}</p>
            <p className="text-gray-600">Class: {student.classStream?.name}</p>
          </div>
          
          <button
            onClick={downloadPDF}
            disabled={downloading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-lg font-semibold"
          >
            {downloading ? '⏳ Generating PDF...' : '📄 Download Report Card (PDF)'}
          </button>
          
          <p className="text-sm text-gray-500 mt-4">
            Click the button above to download a professional PDF report card.
          </p>
        </div>
      </div>
    </div>
  )
}