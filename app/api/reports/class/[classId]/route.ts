import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string }> }
) {
  try {
    const { classId } = await params
    
    // Get all students in the class with their scores
    const students = await prisma.student.findMany({
      where: { classStreamId: classId },
      include: {
        scores: {
          include: { subject: true }
        }
      }
    })
    
    // Calculate overall performance for each student
    const classPerformance = students.map(student => {
      const totalMarks = student.scores.reduce((sum, s) => sum + s.marks, 0)
      const averageScore = student.scores.length > 0 ? totalMarks / student.scores.length : 0
      
      return {
        studentId: student.id,
        name: student.name,
        admissionNo: student.admissionNo,
        totalMarks,
        averageScore: parseFloat(averageScore.toFixed(2)),
      }
    })
    
    // Sort by average score (highest first) and assign overall positions
    const rankedPerformance = classPerformance
      .sort((a, b) => b.averageScore - a.averageScore)
      .map((student, index) => ({
        ...student,
        overallPosition: index + 1,
        overallRank: getRankText(index + 1)
      }))
    
    return NextResponse.json(rankedPerformance)
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}

function getRankText(position: number): string {
  if (position === 1) return '🥇 1st'
  if (position === 2) return '🥈 2nd'
  if (position === 3) return '🥉 3rd'
  return `${position}th`
}