import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string; subjectId: string }> }
) {
  try {
    const { classId, subjectId } = await params
    const url = new URL(request.url)
    const selectedTerm = url.searchParams.get('term') || 'All'
    
    // Get all students in the class
    const students = await prisma.student.findMany({
      where: { classStreamId: classId },
      include: {
        scores: {
          where: {
            subjectId: subjectId,
            ...(selectedTerm !== 'All' ? { academicTerm: selectedTerm } : {})
          }
        }
      }
    })
    
    // Calculate subject performance for each student
    const subjectPerformance = students.map(student => {
      const caScores = student.scores.filter(s => s.assessmentType === 'CA')
      const examScores = student.scores.filter(s => s.assessmentType === 'EXAM')
      
      const caTotal = caScores.reduce((sum, s) => sum + s.marks, 0)
      const examTotal = examScores.reduce((sum, s) => sum + s.marks, 0)
      const caCount = caScores.length
      const examCount = examScores.length
      
      const caAverage = caCount > 0 ? caTotal / caCount : 0
      const examAverage = examCount > 0 ? examTotal / examCount : 0
      
      let averageScore = 0
      if (caCount > 0 && examCount > 0) {
        averageScore = (caAverage * 0.5) + (examAverage * 0.5)
      } else if (caCount > 0) {
        averageScore = caAverage
      } else if (examCount > 0) {
        averageScore = examAverage
      } else {
        averageScore = 0
      }
      
      return {
        studentId: student.id,
        studentName: student.name,
        admissionNo: student.admissionNo,
        averageScore: parseFloat(averageScore.toFixed(2)),
        caScore: caCount > 0 ? parseFloat(caAverage.toFixed(2)) : null,
        examScore: examCount > 0 ? parseFloat(examAverage.toFixed(2)) : null
      }
    })
    
    // Filter students with scores and sort by average
    const studentsWithScores = subjectPerformance.filter(s => s.averageScore > 0)
    const studentsWithoutScores = subjectPerformance.filter(s => s.averageScore === 0)
    
    const rankedByScore = studentsWithScores
      .sort((a, b) => b.averageScore - a.averageScore)
      .map((student, index) => ({
        ...student,
        subjectPosition: index + 1,
        subjectRank: getRankText(index + 1)
      }))
    
    // Add students without scores at the bottom
    const allRanked = [...rankedByScore, ...studentsWithoutScores]
    
    return NextResponse.json({
      students: allRanked,
      summary: {
        totalStudents: students.length,
        withScores: studentsWithScores.length,
        withoutScores: studentsWithoutScores.length,
        highestScore: rankedByScore[0]?.averageScore || 0,
        lowestScore: rankedByScore[rankedByScore.length - 1]?.averageScore || 0
      }
    })
  } catch (error) {
    console.error('Error generating subject positions:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}

function getRankText(position: number): string {
  if (position === 1) return '🥇 1st'
  if (position === 2) return '🥈 2nd'
  if (position === 3) return '🥉 3rd'
  return `${position}th`
}