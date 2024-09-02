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
  const { name, description, categoryID, brandID, img, price, weight } = body

  const gear = await prisma.gear.create({
    data: {
      name,
      description,
      img,
      price,
      weight,
      category: {
        connect: { id: categoryID }
      },
      brand: {
        connect: { id: brandID }
      }
    },
    include: {
      category: true,
      brand: true
    }
  })

  return NextResponse.json(gear, { status: 201 })
}
