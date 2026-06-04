'use client'

import { useEffect, useState } from 'react'
import Navigation from '@/app/components/Navigation'

interface Subject {
  id: string
  name: string
  code: string
  description: string
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: ''
  })

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/subjects')
      const data = await res.json()
      setSubjects(data)
    } catch (error) {
      console.error('Error fetching subjects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        alert('Subject created successfully!')
        setFormData({ name: '', code: '', description: '' })
        setShowForm(false)
        fetchSubjects()
      } else {
        alert('Failed to create subject')
      }
    } catch (error) {
      alert('Error creating subject')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subject? This will also delete all scores for this subject.')) return
    try {
      const res = await fetch(`/api/subjects/${id}`, { method: 'DELETE' })
      if (res.ok) {
        alert('Subject deleted successfully!')
        fetchSubjects()
      } else {
        alert('Failed to delete subject')
      }
    } catch (error) {
      alert('Error deleting subject')
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
          <h1 className="text-2xl font-bold">Subjects</h1>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Add New Subject
          </button>
        </div>

        {showForm && (
          <div className="bg-white shadow p-6 rounded-lg mb-6">
            <h2 className="text-xl font-bold mb-4">Create New Subject</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject Code</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., MATH101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Create Subject
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjects.map((subject) => (
                <tr key={subject.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{subject.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{subject.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{subject.description}</td>
                  <td className="px-6 py-4 text-sm">
                    <button onClick={() => handleDelete(subject.id)} className="text-red-600 hover:text-red-900">
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