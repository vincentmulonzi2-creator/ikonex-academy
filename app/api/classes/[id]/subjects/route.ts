import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Get all subjects assigned to a class
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const classSubjects = await prisma.classSubject.findMany({
      where: { classId: id },
      include: { subject: true }
    })
    
    return NextResponse.json(classSubjects)
  } catch (error) {
    console.error('Error fetching class subjects:', error)
    return NextResponse.json({ error: 'Failed to fetch class subjects' }, { status: 500 })
  }
}

// POST - Assign a subject to class
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { subjectId } = body
    
    // Check if subject exists
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId }
    })
    
    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 })
    }
    
    // Check if already assigned
    const existing = await prisma.classSubject.findUnique({
      where: {
        classId_subjectId: {
          classId: id,
          subjectId: subjectId
        }
      }
    })
    
    if (existing) {
      return NextResponse.json({ error: 'Subject already assigned to this class' }, { status: 400 })
    }
    
    const classSubject = await prisma.classSubject.create({
      data: {
        classId: id,
        subjectId: subjectId
      },
      include: { subject: true }
    })
    
    return NextResponse.json(classSubject, { status: 201 })
  } catch (error) {
    console.error('Error assigning subject:', error)
    return NextResponse.json({ error: 'Failed to assign subject' }, { status: 500 })
  }
}

// DELETE - Remove subject from class
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const url = new URL(request.url)
    const subjectId = url.searchParams.get('subjectId')
    
    if (!subjectId) {
      return NextResponse.json({ error: 'Subject ID is required' }, { status: 400 })
    }
    
    // Check if the assignment exists
    const existing = await prisma.classSubject.findUnique({
      where: {
        classId_subjectId: {
          classId: id,
          subjectId: subjectId
        }
      }
    })
    
    if (!existing) {
      return NextResponse.json({ error: 'Subject not assigned to this class' }, { status: 404 })
    }
    
    await prisma.classSubject.delete({
      where: {
        classId_subjectId: {
          classId: id,
          subjectId: subjectId
        }
      }
    })
    
    return NextResponse.json({ success: true, message: 'Subject removed successfully' })
  } catch (error) {
    console.error('Error removing subject:', error)
    return NextResponse.json({ error: 'Failed to remove subject' }, { status: 500 })
  }
}