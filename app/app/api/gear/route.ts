// app/api/gear/route.ts
import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function GET() {
  const gears = await prisma.gear.findMany({
    include: { reviews: true },
  })
  return NextResponse.json(gears)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { name, description, category, brand, img, price } = body
  const gear = await prisma.gear.create({
    data: { name, description, category, brand, img, price },
  })
  return NextResponse.json(gear, { status: 201 })
}