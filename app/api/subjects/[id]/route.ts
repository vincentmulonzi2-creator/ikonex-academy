import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Fetch single subject
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const subject = await prisma.subject.findUnique({
      where: { id }
    })
    
    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 })
    }
    
    return NextResponse.json(subject)
  } catch (error) {
    console.error('Error fetching subject:', error)
    return NextResponse.json({ error: 'Failed to fetch subject' }, { status: 500 })
  }
}

// PUT - Update subject
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, code, description } = body
    
    const subject = await prisma.subject.update({
      where: { id },
      data: { name, code, description }
    })
    return NextResponse.json(subject)
  } catch (error) {
    console.error('Error updating subject:', error)
    return NextResponse.json({ error: 'Failed to update subject' }, { status: 500 })
  }
}

// DELETE - Delete subject
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // First delete all scores related to this subject
    await prisma.score.deleteMany({
      where: { subjectId: id }
    })
    
    // Then delete the subject
    await prisma.subject.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true, message: 'Subject deleted successfully' })
  } catch (error) {
    console.error('Error deleting subject:', error)
    return NextResponse.json({ error: 'Failed to delete subject' }, { status: 500 })
  }
}