import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('Deleting subject:', id)
    
    // First delete all scores related to this subject
    await prisma.score.deleteMany({
      where: { subjectId: id }
    })
    
    // Then delete the subject
    await prisma.subject.delete({
      where: { id: id }
    })
    
    return NextResponse.json({ success: true, message: 'Subject deleted successfully' })
  } catch (error) {
    console.error('Delete subject error:', error)
    return NextResponse.json({ error: 'Failed to delete subject' }, { status: 500 })
  }
}