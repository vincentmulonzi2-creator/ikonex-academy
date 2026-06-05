'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navigation from '@/app/components/Navigation'

export default function EditClassPage() {
  const params = useParams()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    academicYear: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClass()
  }, [])

  const fetchClass = async () => {
    try {
      const res = await fetch(`/api/classes/${params.id}`)
      const data = await res.json()
      setFormData({
        name: data.name || '',
        code: data.code || '',
        academicYear: data.academicYear || ''
      })
    } catch (error) {
      console.error('Error fetching class:', error)
      alert('Error loading class data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/classes/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        alert('Class updated successfully!')
        router.push('/classes')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to update class')
      }
    } catch (error) {
      alert('Error updating class')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="text-center py-8">Loading class data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Edit Class</h1>
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Form 1A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              placeholder="e.g., F1A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.academicYear}
              onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
              placeholder="e.g., 2026"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              💾 Save Changes
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}