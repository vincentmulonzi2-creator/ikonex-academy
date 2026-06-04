import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { classId: string } }
) {
  try {
    console.log('=== Generating Report for Class ID:', params.classId)
    
    // Get all students in the class with their scores
    const students = await prisma.student.findMany({
      where: { 
        classStreamId: params.classId 
      },
      include: {
        scores: true
      }
    })
    
    console.log('Found students:', students.length)
    
    if (students.length === 0) {
      return NextResponse.json([])
    }
    
    // Calculate performance for each student
    const classPerformance = students.map(student => {
      let totalMarks = 0
      let scoreCount = student.scores.length
      
      student.scores.forEach(score => {
        totalMarks += score.marks
      })
      
      const averageScore = scoreCount > 0 ? totalMarks / scoreCount : 0
      
      console.log(`${student.name}: ${scoreCount} scores, Total: ${totalMarks}, Avg: ${averageScore}`)
      
      return {
        studentId: student.id,
        name: student.name,
        admissionNo: student.admissionNo,
        totalMarks: totalMarks,
        averageScore: averageScore,
      }
    })
    
    // Sort by average score (highest first)
    const rankedPerformance = classPerformance.sort((a, b) => b.averageScore - a.averageScore)
    
    console.log('Final report:', rankedPerformance)
    
    return NextResponse.json(rankedPerformance)
    
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}