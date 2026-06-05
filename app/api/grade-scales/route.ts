import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Fetch all grade scales
export async function GET() {
  try {
    const gradeScales = await prisma.gradeScale.findMany({
      orderBy: { minMarks: 'desc' }
    })
    return NextResponse.json(gradeScales)
  } catch (error) {
    console.error('Error fetching grade scales:', error)
    return NextResponse.json({ error: 'Failed to fetch grade scales' }, { status: 500 })
  }
}

// POST - Create new grade scale
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { grade, minMarks, maxMarks, points, remark } = body
    
    const gradeScale = await prisma.gradeScale.create({
      data: { grade, minMarks, maxMarks, points, remark }
    })
    return NextResponse.json(gradeScale, { status: 201 })
  } catch (error) {
    console.error('Error creating grade scale:', error)
    return NextResponse.json({ error: 'Failed to create grade scale' }, { status: 500 })
  }
}

// PUT - Update grade scale
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, grade, minMarks, maxMarks, points, remark } = body
    
    const gradeScale = await prisma.gradeScale.update({
      where: { id },
      data: { grade, minMarks, maxMarks, points, remark }
    })
    return NextResponse.json(gradeScale)
  } catch (error) {
    console.error('Error updating grade scale:', error)
    return NextResponse.json({ error: 'Failed to update grade scale' }, { status: 500 })
  }
}

// DELETE - Delete grade scale
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }
    
    await prisma.gradeScale.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting grade scale:', error)
    return NextResponse.json({ error: 'Failed to delete grade scale' }, { status: 500 })
  }
}