import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

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