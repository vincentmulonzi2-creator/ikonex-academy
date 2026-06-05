'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navigation from '@/app/components/Navigation'

interface ClassStream {
  id: string
  name: string
  code: string
  academicYear: string
  students: any[]
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassStream[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    academicYear: '2026'
  })

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes')
      const data = await res.json()
      if (Array.isArray(data)) {
        setClasses(data)
      } else {
        setClasses([])
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
      setClasses([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        alert('Class created successfully!')
        setFormData({ name: '', code: '', academicYear: '2026' })
        setShowForm(false)
        fetchClasses()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to create class')
      }
    } catch (error) {
      alert('Error creating class')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class? This will also delete all students and scores in this class.')) return
    try {
      const res = await fetch(`/api/classes/${id}`, { method: 'DELETE' })
      if (res.ok) {
        alert('Class deleted successfully!')
        fetchClasses()
      } else {
        alert('Failed to delete class')
      }
    } catch (error) {
      alert('Error deleting class')
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
          <h1 className="text-2xl font-bold">Class Streams</h1>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Add New Class
          </button>
        </div>

        {showForm && (
          <div className="bg-white shadow p-6 rounded-lg mb-6">
            <h2 className="text-xl font-bold mb-4">Create New Class</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Class Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Form 1A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Class Code</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., F1A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Academic Year</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Create Class
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Academic Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {classes.map((cls) => (
                <tr key={cls.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{cls.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cls.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cls.academicYear}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cls.students?.length || 0}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <Link 
                      href={`/classes/${cls.id}`} 
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </Link>
                    <Link 
                      href={`/classes/${cls.id}/edit`} 
                      className="text-green-600 hover:text-green-900"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(cls.id)} 
                      className="text-red-600 hover:text-red-900"
                    >
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