import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Fetch all scores
export async function GET() {
  try {
    const scores = await prisma.score.findMany({
      include: {
        student: true,
        subject: true
      }
    })
    return NextResponse.json(scores)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 })
  }
}

// POST - Create new score
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
      },
      include: {
        student: true,
        subject: true
      }
    })
    
    return NextResponse.json(score, { status: 201 })
  } catch (error) {
    console.error('Error recording score:', error)
    return NextResponse.json({ error: 'Failed to record score' }, { status: 500 })
  }
}

// PUT - Update existing score
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, marks } = body
    
    if (!id) {
      return NextResponse.json({ error: 'Score ID is required' }, { status: 400 })
    }
    
    if (marks < 0 || marks > 100) {
      return NextResponse.json({ error: 'Marks must be between 0 and 100' }, { status: 400 })
    }
    
    const score = await prisma.score.update({
      where: { id },
      data: { marks },
      include: {
        student: true,
        subject: true
      }
    })
    
    return NextResponse.json(score)
  } catch (error) {
    console.error('Error updating score:', error)
    return NextResponse.json({ error: 'Failed to update score' }, { status: 500 })
  }
}