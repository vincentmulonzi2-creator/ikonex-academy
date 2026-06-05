import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        classStream: true,
        scores: true
      }
    })
    
    // Calculate total marks and average for each student
    const studentsWithStats = students.map(student => {
      const totalMarks = student.scores.reduce((sum, score) => sum + score.marks, 0)
      const averageScore = student.scores.length > 0 ? totalMarks / student.scores.length : 0
      
      const { scores, ...studentWithoutScores } = student
      
      return {
        ...studentWithoutScores,
        totalMarks,
        averageScore: parseFloat(averageScore.toFixed(2)),
        scoresCount: student.scores.length
      }
    })
    
    return NextResponse.json(studentsWithStats)
  } catch (error) {
    console.error('GET Error:', error)
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { admissionNo, name, email, phone, address, classStreamId } = body
    
    const student = await prisma.student.create({
      data: {
        admissionNo,
        name,
        email: email || null,
        phone: phone || null,
        address: address || null,
        classStreamId: classStreamId
      }
    })
    
    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('POST Error:', error)
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 })
  }
}