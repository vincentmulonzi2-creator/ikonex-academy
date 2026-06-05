'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navigation from '@/app/components/Navigation'

interface ClassStream {
  id: string
  name: string
}

export default function EditStudentPage() {
  const params = useParams()
  const router = useRouter()
  const [classes, setClasses] = useState<ClassStream[]>([])
  const [formData, setFormData] = useState({
    admissionNo: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    classStreamId: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClasses()
    fetchStudent()
  }, [])

  const fetchClasses = async () => {
    const res = await fetch('/api/classes')
    const data = await res.json()
    setClasses(data)
  }

  const fetchStudent = async () => {
    try {
      const res = await fetch(`/api/students/${params.id}`)
      const data = await res.json()
      setFormData({
        admissionNo: data.admissionNo || '',
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        classStreamId: data.classStreamId || ''
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
      const res = await fetch(`/api/students/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        alert('Student updated successfully!')
        router.push('/students')
      } else {
        alert('Failed to update student')
      }
    } catch (error) {
      alert('Error updating student')
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
        <h1 className="text-2xl font-bold mb-6">Edit Student</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium">Admission Number</label>
            <input type="text" required className="mt-1 w-full border p-2 rounded" value={formData.admissionNo} onChange={(e) => setFormData({...formData, admissionNo: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input type="text" required className="mt-1 w-full border p-2 rounded" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" className="mt-1 w-full border p-2 rounded" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input type="tel" className="mt-1 w-full border p-2 rounded" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium">Address</label>
            <textarea className="mt-1 w-full border p-2 rounded" rows={2} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium">Class Stream</label>
            <select required className="mt-1 w-full border p-2 rounded" value={formData.classStreamId} onChange={(e) => setFormData({...formData, classStreamId: e.target.value})}>
              <option value="">Select Class</option>
              {classes.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
            </select>
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