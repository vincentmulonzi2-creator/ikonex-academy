import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Fetch single score by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const score = await prisma.score.findUnique({
      where: { id },
      include: {
        student: true,
        subject: true
      }
    })
    
    if (!score) {
      return NextResponse.json({ error: 'Score not found' }, { status: 404 })
    }
    
    return NextResponse.json(score)
  } catch (error) {
    console.error('Error fetching score:', error)
    return NextResponse.json({ error: 'Failed to fetch score' }, { status: 500 })
  }
}

// DELETE - Delete score
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await prisma.score.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true, message: 'Score deleted successfully' })
  } catch (error) {
    console.error('Error deleting score:', error)
    return NextResponse.json({ error: 'Failed to delete score' }, { status: 500 })
  }
}