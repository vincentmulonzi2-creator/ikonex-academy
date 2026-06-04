import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        classStream: true
      }
    })
    return NextResponse.json(students)
  } catch (error) {
    console.error('GET Error:', error)
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('POST body:', body)
    
    const { admissionNo, name, email, phone, address, classStreamId } = body
    
    const student = await prisma.student.create({
      data: {
        admissionNo,
        name,
        email: email || null,
        phone: phone || null,
        address: address || null,
        classStreamId: classStreamId
      }
    })
    
    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('POST Error:', error)
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 })
  }
}