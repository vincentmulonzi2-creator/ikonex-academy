'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/app/components/Navigation'

interface ClassStream {
  id: string
  name: string
}

export default function NewStudentPage() {
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

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    const res = await fetch('/api/classes')
    const data = await res.json()
    setClasses(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        alert('Student registered successfully!')
        router.push('/students')
      } else {
        alert('Failed to register student')
      }
    } catch (error) {
      alert('Error registering student')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Register New Student</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow p-6 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">Admission Number</label>
            <input
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.admissionNo}
              onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Class Stream</label>
            <select
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.classStreamId}
              onChange={(e) => setFormData({ ...formData, classStreamId: e.target.value })}
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Register Student
            </button>
            <button type="button" onClick={() => router.back()} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}