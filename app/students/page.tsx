'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navigation from '@/app/components/Navigation'

interface Student {
  id: string
  admissionNo: string
  name: string
  email: string
  classStream: { name: string }
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students')
      const data = await res.json()
      setStudents(data)
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student? This will also delete all their scores.')) return
    
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' })
      if (res.ok) {
        alert('Student deleted successfully!')
        fetchStudents()
      } else {
        alert('Failed to delete student')
      }
    } catch (error) {
      alert('Error deleting student')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="text-center py-8">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Students</h1>
          <Link href="/students/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            + Add New Student
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admission No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{student.admissionNo}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{student.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{student.classStream?.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <button onClick={() => handleDelete(student.id)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}