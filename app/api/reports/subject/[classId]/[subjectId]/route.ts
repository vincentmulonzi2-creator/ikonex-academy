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
    
    // Get class and subject info
    const classInfo = await prisma.classStream.findUnique({
      where: { id: classId }
    })
    
    const subjectInfo = await prisma.subject.findUnique({
      where: { id: subjectId }
    })
    
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
    
    // Calculate performance for each student
    const studentPerformance = students.map(student => {
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
      
      const grade = getGrade(averageScore)
      
      return {
        studentId: student.id,
        studentName: student.name,
        admissionNo: student.admissionNo,
        caScore: caCount > 0 ? parseFloat(caAverage.toFixed(2)) : null,
        examScore: examCount > 0 ? parseFloat(examAverage.toFixed(2)) : null,
        totalScore: parseFloat((caTotal + examTotal).toFixed(2)),
        averageScore: parseFloat(averageScore.toFixed(2)),
        grade: grade.letter,
        gradeColor: grade.color,
        status: averageScore >= 50 ? 'Pass' : 'Fail'
      }
    })
    
    // Sort by average score (highest first)
    const sortedPerformance = studentPerformance.sort((a, b) => b.averageScore - a.averageScore)
    
    return NextResponse.json({
      students: sortedPerformance,
      classInfo,
      subjectInfo
    })
  } catch (error) {
    console.error('Error generating subject report:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}

function getGrade(score: number) {
  if (score >= 80) return { letter: 'A', color: 'text-green-600 bg-green-100' }
  if (score >= 70) return { letter: 'B', color: 'text-blue-600 bg-blue-100' }
  if (score >= 60) return { letter: 'C', color: 'text-yellow-600 bg-yellow-100' }
  if (score >= 50) return { letter: 'D', color: 'text-orange-600 bg-orange-100' }
  return { letter: 'F', color: 'text-red-600 bg-red-100' }
}