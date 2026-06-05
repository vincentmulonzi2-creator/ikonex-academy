'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { pdf } from '@react-pdf/renderer'
import Navigation from '@/app/components/Navigation'
import SubjectReportPDF from '@/app/components/SubjectReportPDF'

export default function SubjectReportPDFPage() {
  const params = useParams()
  const [classData, setClassData] = useState<any>(null)
  const [subjectData, setSubjectData] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [selectedTerm, setSelectedTerm] = useState('Term 1')

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const term = urlParams.get('term') || 'Term 1'
    setSelectedTerm(term)
    fetchData(term)
  }, [])

  const fetchData = async (term: string) => {
    try {
      // Fetch subject performance data
      const res = await fetch(`/api/reports/subject-positions/${params.classId}/${params.subjectId}?term=${term}`)
      const data = await res.json()
      setStudents(data.students || [])
      setSummary(data.summary)
      
      // Fetch class info
      const classRes = await fetch(`/api/classes/${params.classId}`)
      const classInfo = await classRes.json()
      setClassData(classInfo)
      
      // Fetch subject info
      const subjectRes = await fetch(`/api/subjects/${params.subjectId}`)
      const subjectInfo = await subjectRes.json()
      setSubjectData(subjectInfo)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = async () => {
    setDownloading(true)
    try {
      const blob = await pdf(
        <SubjectReportPDF 
          className={classData?.name || 'Class'}
          classCode={classData?.code || ''}
          subjectName={subjectData?.name || 'Subject'}
          subjectCode={subjectData?.code || ''}
          term={selectedTerm}
          students={students}
          summary={summary || {
            totalStudents: 0,
            withScores: 0,
            withoutScores: 0,
            classAverage: 0,
            highestScore: 0,
            lowestScore: 0,
            passCount: 0,
            passRate: 0
          }}
        />
      ).toBlob()
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Subject_Report_${classData?.name}_${subjectData?.name}.pdf`
      link.click()
      URL.revokeObjectURL(url)
      alert('PDF downloaded successfully!')
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Check console for details.')
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Subject Performance Report</h1>
          <div className="mb-6">
            <p className="text-lg"><strong>Class:</strong> {classData?.name} ({classData?.code})</p>
            <p className="text-lg"><strong>Subject:</strong> {subjectData?.name} ({subjectData?.code})</p>
            <p className="text-gray-600"><strong>Term:</strong> {selectedTerm}</p>
            <p className="text-gray-600"><strong>Class Average:</strong> {summary?.classAverage?.toFixed(2) || 0}%</p>
            <p className="text-gray-600"><strong>Students with Scores:</strong> {summary?.withScores || 0}</p>
            <p className="text-gray-600"><strong>Pass Rate:</strong> {summary?.passRate?.toFixed(1) || 0}%</p>
          </div>
          <button
            onClick={downloadPDF}
            disabled={downloading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 text-lg font-semibold"
          >
            {downloading ? '⏳ Generating PDF...' : '📄 Download PDF Report'}
          </button>
        </div>
      </div>
    </div>
  )
}