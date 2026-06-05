'use client'

import { useEffect, useState } from 'react'
import Navigation from '@/app/components/Navigation'

interface GradeScale {
  id: string
  grade: string
  minMarks: number
  maxMarks: number
  points: number
  remark: string
}

export default function GradeScalesPage() {
  const [grades, setGrades] = useState<GradeScale[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    grade: '',
    minMarks: 0,
    maxMarks: 0,
    points: 0,
    remark: ''
  })

  useEffect(() => {
    fetchGrades()
  }, [])

  const fetchGrades = async () => {
    try {
      const res = await fetch('/api/grade-scales')
      const data = await res.json()
      setGrades(data)
    } catch (error) {
      console.error('Error fetching grades:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingId ? `/api/grade-scales?id=${editingId}` : '/api/grade-scales'
      const method = editingId ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...formData, id: editingId } : formData)
      })
      
      if (res.ok) {
        alert(editingId ? 'Grade scale updated!' : 'Grade scale created!')
        setFormData({ grade: '', minMarks: 0, maxMarks: 0, points: 0, remark: '' })
        setShowForm(false)
        setEditingId(null)
        fetchGrades()
      } else {
        alert('Failed to save grade scale')
      }
    } catch (error) {
      alert('Error saving grade scale')
    }
  }

  const handleEdit = (grade: GradeScale) => {
    setFormData({
      grade: grade.grade,
      minMarks: grade.minMarks,
      maxMarks: grade.maxMarks,
      points: grade.points,
      remark: grade.remark
    })
    setEditingId(grade.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this grade scale?')) return
    try {
      const res = await fetch(`/api/grade-scales?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        alert('Grade scale deleted!')
        fetchGrades()
      }
    } catch (error) {
      alert('Error deleting grade scale')
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">📊 Configurable Grading Scales</h1>
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setFormData({ grade: '', minMarks: 0, maxMarks: 0, points: 0, remark: '' }) }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Add Grade Scale
          </button>
        </div>

        {/* Current Grading Scale Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="text-xl font-bold">Current Grading Scale</h2>
            <p className="text-sm text-gray-500">Configure how scores are converted to grades</p>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Grade</th>
                <th className="p-3 text-left">Min Marks</th>
                <th className="p-3 text-left">Max Marks</th>
                <th className="p-3 text-left">Points</th>
                <th className="p-3 text-left">Remark</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {grades.sort((a, b) => b.minMarks - a.minMarks).map((grade) => (
                <tr key={grade.id} className="border-t">
                  <td className="p-3 font-bold">
                    <span className={`px-2 py-1 rounded ${
                      grade.grade === 'A' ? 'bg-green-100 text-green-700' :
                      grade.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                      grade.grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                      grade.grade === 'D' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {grade.grade}
                    </span>
                  </td>
                  <td className="p-3">{grade.minMarks}%</td>
                  <td className="p-3">{grade.maxMarks}%</td>
                  <td className="p-3">{grade.points}</td>
                  <td className="p-3 text-gray-500">{grade.remark}</td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => handleEdit(grade)} className="text-green-600 hover:text-green-800">Edit</button>
                    <button onClick={() => handleDelete(grade.id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Grade Scale' : 'Add Grade Scale'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Grade Letter</label>
                  <input type="text" required className="w-full border p-2 rounded" value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value.toUpperCase()})} placeholder="A, B, C, D, F" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Min Marks (%)</label>
                  <input type="number" required className="w-full border p-2 rounded" value={formData.minMarks} onChange={(e) => setFormData({...formData, minMarks: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium">Max Marks (%)</label>
                  <input type="number" required className="w-full border p-2 rounded" value={formData.maxMarks} onChange={(e) => setFormData({...formData, maxMarks: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium">GPA Points</label>
                  <input type="number" step="0.1" required className="w-full border p-2 rounded" value={formData.points} onChange={(e) => setFormData({...formData, points: parseFloat(e.target.value)})} placeholder="4.0, 3.0, 2.0..." />
                </div>
                <div>
                  <label className="block text-sm font-medium">Remark</label>
                  <input type="text" className="w-full border p-2 rounded" value={formData.remark} onChange={(e) => setFormData({...formData, remark: e.target.value})} placeholder="Excellent, Good, Pass..." />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{editingId ? 'Update' : 'Create'}</button>
                  <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Default Grading Scale Info */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800">ℹ️ How Grading Works</h3>
          <p className="text-sm text-blue-600 mt-1">
            Grades are determined by matching a student's average score to the configured grade scale.
            The system uses the first matching grade where: <strong>minMarks ≤ score ≤ maxMarks</strong>
          </p>
          <p className="text-sm text-blue-600 mt-2">
            Example: Score 85% → Grade A (if min=80, max=100)
          </p>
        </div>
      </div>
    </div>
  )
}