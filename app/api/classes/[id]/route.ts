import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Fetch single class with students
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const classStream = await prisma.classStream.findUnique({
      where: { id },
      include: {
        students: true
      }
    })
    
    if (!classStream) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }
    
    return NextResponse.json(classStream)
  } catch (error) {
    console.error('Error fetching class:', error)
    return NextResponse.json({ error: 'Failed to fetch class' }, { status: 500 })
  }
}

// PUT - Update class
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, code, academicYear } = body
    
    const classStream = await prisma.classStream.update({
      where: { id },
      data: { 
        name, 
        code, 
        academicYear 
      }
    })
    
    return NextResponse.json(classStream)
  } catch (error) {
    console.error('Error updating class:', error)
    return NextResponse.json({ error: 'Failed to update class' }, { status: 500 })
  }
}

// DELETE - Delete class and related data
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('Deleting class:', id)
    
    // Get all students in this class
    const students = await prisma.student.findMany({
      where: { classStreamId: id },
      select: { id: true }
    })
    
    const studentIds = students.map(s => s.id)
    
    // Delete all scores for these students
    if (studentIds.length > 0) {
      await prisma.score.deleteMany({
        where: { studentId: { in: studentIds } }
      })
    }
    
    // Delete all students in this class
    await prisma.student.deleteMany({
      where: { classStreamId: id }
    })
    
    // Delete the class
    await prisma.classStream.delete({
      where: { id: id }
    })
    
    return NextResponse.json({ success: true, message: 'Class deleted successfully' })
  } catch (error) {
    console.error('Delete class error:', error)
    return NextResponse.json({ error: 'Failed to delete class' }, { status: 500 })
  }
}