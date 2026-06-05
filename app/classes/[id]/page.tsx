'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/app/components/Navigation'

interface Student {
  id: string
  name: string
  admissionNo: string
  email: string
  phone: string
  address: string
}

interface Subject {
  id: string
  name: string
  code: string
  description: string
}

interface ClassSubject {
  id: string
  subjectId: string
  subject: Subject
}

interface ClassStream {
  id: string
  name: string
  code: string
  academicYear: string
  students: Student[]
  subjects: ClassSubject[]
  createdAt: string
}

export default function ClassDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [classData, setClassData] = useState<ClassStream | null>(null)
  const [allSubjects, setAllSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [showSubjectForm, setShowSubjectForm] = useState(false)
  const [selectedSubjectId, setSelectedSubjectId] = useState('')
  const [assignedSubjects, setAssignedSubjects] = useState<ClassSubject[]>([])

  useEffect(() => {
    fetchClassDetails()
    fetchAllSubjects()
    fetchAssignedSubjects()
  }, [])

  const fetchClassDetails = async () => {
    try {
      const res = await fetch(`/api/classes/${params.id}`)
      const data = await res.json()
      setClassData(data)
    } catch (error) {
      console.error('Error fetching class:', error)
    }
  }

  const fetchAssignedSubjects = async () => {
    try {
      const res = await fetch(`/api/classes/${params.id}/subjects`)
      const data = await res.json()
      console.log('Assigned subjects:', data)
      setAssignedSubjects(data)
    } catch (error) {
      console.error('Error fetching assigned subjects:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllSubjects = async () => {
    try {
      const res = await fetch('/api/subjects')
      const data = await res.json()
      setAllSubjects(data)
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const assignSubject = async () => {
    if (!selectedSubjectId) {
      alert('Please select a subject')
      return
    }
    
    try {
      const res = await fetch(`/api/classes/${params.id}/subjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectId: selectedSubjectId })
      })
      
      if (res.ok) {
        alert('Subject assigned successfully!')
        setSelectedSubjectId('')
        setShowSubjectForm(false)
        fetchAssignedSubjects()
        fetchClassDetails()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to assign subject')
      }
    } catch (error) {
      alert('Error assigning subject')
    }
  }

  const removeSubject = async (subjectId: string) => {
    if (!confirm('Remove this subject from the class?')) return
    
    try {
      const res = await fetch(`/api/classes/${params.id}/subjects?subjectId=${subjectId}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        alert('Subject removed successfully!')
        fetchAssignedSubjects()
        fetchClassDetails()
      } else {
        alert('Failed to remove subject')
      }
    } catch (error) {
      alert('Error removing subject')
    }
  }

  if (loading && !classData) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="text-center py-8">Loading...</div>
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

  const availableSubjects = allSubjects.filter(
    subject => !assignedSubjects.some(cs => cs.subjectId === subject.id)
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button onClick={() => router.back()} className="mb-4 text-blue-600 hover:text-blue-800">
          ← Back
        </button>

        {/* Class Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold">{classData.name}</h1>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Code</p>
              <p className="font-semibold">{classData.code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Academic Year</p>
              <p className="font-semibold">{classData.academicYear}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="font-semibold">{classData.students?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Assigned Subjects</p>
              <p className="font-semibold">{assignedSubjects.length}</p>
            </div>
          </div>
        </div>

        {/* Assigned Subjects Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">📚 Assigned Subjects</h2>
            <button
              onClick={() => setShowSubjectForm(!showSubjectForm)}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
            >
              + Assign Subject
            </button>
          </div>
          
          {showSubjectForm && (
            <div className="p-4 border-b bg-gray-50">
              <div className="flex gap-3">
                <select
                  className="flex-1 border p-2 rounded"
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                >
                  <option value="">Select a subject...</option>
                  {availableSubjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </option>
                  ))}
                </select>
                <button onClick={assignSubject} className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600">
                  Assign
                </button>
                <button onClick={() => setShowSubjectForm(false)} className="bg-gray-500 text-white px-4 rounded hover:bg-gray-600">
                  Cancel
                </button>
              </div>
              {availableSubjects.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">All subjects are already assigned to this class.</p>
              )}
            </div>
          )}
          
          {assignedSubjects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Subject Name</th>
                    <th className="p-3 text-left">Code</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedSubjects.map((cs) => (
                    <tr key={cs.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{cs.subject?.name}</td>
                      <td className="p-3">{cs.subject?.code}</td>
                      <td className="p-3 text-gray-500">{cs.subject?.description || '-'}</td>
                      <td className="p-3">
                        <button
                          onClick={() => removeSubject(cs.subjectId)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No subjects assigned to this class yet. Click "+ Assign Subject" to add.
            </div>
          )}
        </div>

        {/* Students List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">👨‍🎓 Students</h2>
          </div>
          {classData.students && classData.students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Admission No</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Phone</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {classData.students.map((student) => (
                    <tr key={student.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{student.admissionNo}</td>
                      <td className="p-3 font-medium">{student.name}</td>
                      <td className="p-3">{student.email || '-'}</td>
                      <td className="p-3">{student.phone || '-'}</td>
                      <td className="p-3">
                        <Link href={`/students/${student.id}`} className="text-blue-600 hover:text-blue-800">
                          View Profile →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No students in this class yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}