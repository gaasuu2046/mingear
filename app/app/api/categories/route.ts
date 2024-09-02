// app/api/packing-list/route.ts

import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function GET() {

  try {
    const categories = await prisma.category.findMany()
    return NextResponse.json(categories)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'categories' }, { status: 500 })
  }
}
