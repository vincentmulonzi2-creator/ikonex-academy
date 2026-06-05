'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navigation from '@/app/components/Navigation'

export default function EditSubjectPage() {
  const params = useParams()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubject()
  }, [])

  const fetchSubject = async () => {
    try {
      const res = await fetch(`/api/subjects/${params.id}`)
      const data = await res.json()
      setFormData({
        name: data.name || '',
        code: data.code || '',
        description: data.description || ''
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/subjects/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        alert('Subject updated successfully!')
        router.push('/subjects')
      } else {
        alert('Failed to update subject')
      }
    } catch (error) {
      alert('Error updating subject')
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
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Edit Subject</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium">Subject Name</label>
            <input type="text" required className="mt-1 w-full border p-2 rounded" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium">Subject Code</label>
            <input type="text" required className="mt-1 w-full border p-2 rounded" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea className="mt-1 w-full border p-2 rounded" rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="flex gap-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save Changes</button>
            <button type="button" onClick={() => router.back()} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}