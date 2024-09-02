// app/api/packing-list/route.ts

import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function GET() {

  try {
    const brandList = await prisma.brand.findMany()
    return NextResponse.json(brandList)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'categories' }, { status: 500 })
  }
}
