'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/app/components/Navigation'

interface Student {
  id: string
  name: string
  admissionNo: string
  classStream: { name: string }
}

interface Subject {
  id: string
  name: string
}

export default function RecordScorePage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    studentId: '',
    subjectId: '',
    assessmentType: 'CA',
    marks: '',
    academicTerm: 'Term 1'
  })

  useEffect(() => {
    fetchStudents()
    fetchSubjects()
  }, [])

  const fetchStudents = async () => {
    const res = await fetch('/api/students')
    const data = await res.json()
    setStudents(data)
  }

  const fetchSubjects = async () => {
    const res = await fetch('/api/subjects')
    const data = await res.json()
    setSubjects(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const marks = parseInt(formData.marks)
    if (marks < 0 || marks > 100) {
      alert('Marks must be between 0 and 100')
      setLoading(false)
      return
    }
    
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          marks
        })
      })
      
      const result = await res.json()
      
      if (res.ok) {
        alert('Score recorded successfully!')
        setFormData({ ...formData, marks: '', studentId: '', subjectId: '' })
      } else {
        alert(result.error || 'Failed to record score')
      }
    } catch (error) {
      alert('Error recording score')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Record Student Score</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow p-6 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">Student</label>
            <select
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.admissionNo}) - {student.classStream?.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <select
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Assessment Type</label>
            <select
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.assessmentType}
              onChange={(e) => setFormData({ ...formData, assessmentType: e.target.value })}
            >
              <option value="CA">Continuous Assessment (CA)</option>
              <option value="EXAM">Examination (EXAM)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Marks (0-100)</label>
            <input
              type="number"
              required
              min="0"
              max="100"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.marks}
              onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Academic Term</label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.academicTerm}
              onChange={(e) => setFormData({ ...formData, academicTerm: e.target.value })}
            >
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {loading ? 'Recording...' : 'Record Score'}
          </button>
        </form>
      </div>
    </div>
  )
}