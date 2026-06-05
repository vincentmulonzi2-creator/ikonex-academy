import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Fetch single student with total marks
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const student = await prisma.student.findUnique({
      where: { id },
      include: { 
        classStream: true, 
        scores: { include: { subject: true } } 
      }
    })
    
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }
    
    // Calculate total marks and average
    const totalMarks = student.scores.reduce((sum, score) => sum + score.marks, 0)
    const averageScore = student.scores.length > 0 ? totalMarks / student.scores.length : 0
    
    // Calculate subject-wise totals
    const subjectTotals: Record<string, { total: number; count: number }> = {}
    student.scores.forEach(score => {
      const subjectName = score.subject?.name || 'Unknown'
      if (!subjectTotals[subjectName]) {
        subjectTotals[subjectName] = { total: 0, count: 0 }
      }
      subjectTotals[subjectName].total += score.marks
      subjectTotals[subjectName].count++
    })
    
    const subjectAverages = Object.entries(subjectTotals).map(([name, data]) => ({
      subject: name,
      total: data.total,
      average: parseFloat((data.total / data.count).toFixed(2))
    }))
    
    return NextResponse.json({
      ...student,
      totalMarks,
      averageScore: parseFloat(averageScore.toFixed(2)),
      subjectAverages
    })
  } catch (error) {
    console.error('Error fetching student:', error)
    return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 })
  }
}

// PUT - Update student
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { admissionNo, name, email, phone, address, classStreamId } = body
    
    const student = await prisma.student.update({
      where: { id },
      data: { admissionNo, name, email, phone, address, classStreamId }
    })
    return NextResponse.json(student)
  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 })
  }
}

// DELETE - Delete student
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.score.deleteMany({ where: { studentId: id } })
    await prisma.student.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting student:', error)
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 })
  }
}