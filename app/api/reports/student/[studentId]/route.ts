import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await params
    
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        classStream: true,
        scores: {
          include: {
            subject: true
          }
        }
      }
    })
    
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }
    
    const classStudents = await prisma.student.findMany({
      where: { classStreamId: student.classStreamId },
      include: {
        scores: true
      }
    })
    
    const classRankings = classStudents.map(s => {
      const totalMarks = s.scores.reduce((sum, sc) => sum + sc.marks, 0)
      const avg = s.scores.length > 0 ? totalMarks / s.scores.length : 0
      return { id: s.id, avg }
    }).sort((a, b) => b.avg - a.avg)
    
    const rank = classRankings.findIndex(r => r.id === student.id) + 1
    
    return NextResponse.json({
      student,
      scores: student.scores,
      classRank: rank,
      totalStudents: classStudents.length
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}