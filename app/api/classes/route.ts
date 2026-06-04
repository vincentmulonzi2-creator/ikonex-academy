import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const classes = await prisma.classStream.findMany({
      include: {
        students: true
      }
    })
    return NextResponse.json(classes)
  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, code, academicYear } = body
    
    // Check if class with same code already exists
    const existing = await prisma.classStream.findUnique({
      where: { code }
    })
    
    if (existing) {
      return NextResponse.json({ error: 'Class with this code already exists' }, { status: 400 })
    }
    
    const classStream = await prisma.classStream.create({
      data: {
        name,
        code,
        academicYear: academicYear || '2026'
      }
    })
    
    return NextResponse.json(classStream, { status: 201 })
  } catch (error) {
    console.error('Error creating class:', error)
    return NextResponse.json({ error: 'Failed to create class' }, { status: 500 })
  }
}