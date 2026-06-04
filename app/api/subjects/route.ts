import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany()
    return NextResponse.json(subjects)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, code, description } = body
    
    const subject = await prisma.subject.create({
      data: {
        name,
        code,
        description
      }
    })
    
    return NextResponse.json(subject, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create subject' }, { status: 500 })
  }
}