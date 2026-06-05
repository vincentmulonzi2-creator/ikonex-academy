'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navigation from '@/app/components/Navigation'

export default function EditScorePage() {
  const params = useParams()
  const router = useRouter()
  const [score, setScore] = useState<any>(null)
  const [marks, setMarks] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchScore()
  }, [])

  const fetchScore = async () => {
    try {
      const res = await fetch(`/api/scores/${params.id}`)
      const data = await res.json()
      setScore(data)
      setMarks(data.marks?.toString() || '')
    } catch (error) {
      console.error('Error fetching score:', error)
      alert('Failed to load score')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const marksValue = parseInt(marks)
    if (isNaN(marksValue) || marksValue < 0 || marksValue > 100) {
      alert('Marks must be between 0 and 100')
      return
    }
    
    setSaving(true)
    try {
      const res = await fetch('/api/scores', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: params.id, marks: marksValue })
      })
      
      if (res.ok) {
        alert('Score updated successfully!')
        router.push('/scores')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to update score')
      }
    } catch (error) {
      alert('Error updating score')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="text-center py-8">Loading...</div>
      </div>
    )
  }

  if (!score) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="text-center py-8">Score not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => router.back()} className="mb-4 text-blue-600 hover:text-blue-800">
          ← Back
        </button>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Edit Score</h1>
          
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="font-semibold text-lg">Score Details</h2>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Student</p>
                <p className="font-medium">{score.student?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Subject</p>
                <p className="font-medium">{score.subject?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Assessment Type</p>
                <p className="font-medium">{score.assessmentType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Term</p>
                <p className="font-medium">{score.academicTerm}</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marks (0-100)
              </label>
              <input
                type="number"
                required
                min="0"
                max="100"
                className="w-full border border-gray-300 rounded-md p-2 text-lg"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}