import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, subjectId, assessmentType, marks, academicTerm } = body
    
    // Check for duplicate
    const existing = await prisma.score.findFirst({
      where: {
        studentId,
        subjectId,
        assessmentType,
        academicTerm
      }
    })
    
    if (existing) {
      return NextResponse.json({ 
        error: 'Score already exists for this student, subject, assessment type, and term' 
      }, { status: 409 })
    }
    
    const score = await prisma.score.create({
      data: {
        studentId,
        subjectId,
        assessmentType,
        marks,
        academicTerm
      }
    })
    
    return NextResponse.json(score, { status: 201 })
  } catch (error) {
    console.error('Error recording score:', error)
    return NextResponse.json({ error: 'Failed to record score' }, { status: 500 })
  }
}