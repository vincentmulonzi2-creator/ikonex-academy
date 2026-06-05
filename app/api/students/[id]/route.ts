import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Fetch single student
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const student = await prisma.student.findUnique({
      where: { id },
      include: { classStream: true, scores: { include: { subject: true } } }
    })
    if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    return NextResponse.json(student)
  } catch (error) {
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
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 })
  }
}