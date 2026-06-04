import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('Deleting student:', id)
    
    // First delete all scores for this student
    await prisma.score.deleteMany({
      where: { studentId: id }
    })
    
    // Then delete the student
    await prisma.student.delete({
      where: { id: id }
    })
    
    return NextResponse.json({ success: true, message: 'Student deleted successfully' })
  } catch (error) {
    console.error('Delete student error:', error)
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 })
  }
}