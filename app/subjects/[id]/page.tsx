'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/app/components/Navigation'

export default function SubjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [subject, setSubject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/subjects/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setSubject(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  if (loading) return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="text-center py-8">Loading...</div>
    </div>
  )

  if (!subject) return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="text-center py-8">Subject not found</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => router.back()} className="mb-4 text-blue-600 hover:text-blue-800">
          ← Back
        </button>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{subject.name}</h1>
          
          <div className="space-y-3">
            <div className="flex border-b pb-2">
              <span className="font-semibold w-24">Code:</span>
              <span>{subject.code}</span>
            </div>
            <div className="flex border-b pb-2">
              <span className="font-semibold w-24">Description:</span>
              <span>{subject.description || 'No description provided'}</span>
            </div>
            <div className="flex border-b pb-2">
              <span className="font-semibold w-24">Created:</span>
              <span>{new Date(subject.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="mt-6 flex gap-3">
            <Link 
              href={`/subjects/${subject.id}/edit`} 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Edit Subject
            </Link>
            <button 
              onClick={() => router.back()} 
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}