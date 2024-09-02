// app/api/gear/search/route.ts
import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const category = searchParams.get('category')
  const brand = searchParams.get('brand')

  const where: Prisma.GearWhereInput = {
    AND: [
      query
        ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { brand: { name: { contains: query, mode: 'insensitive' } } },
            ],
          }
        : {},
      category ? { category: { name: { equals: category, mode: 'insensitive' } } } : {},
      brand ? { brand: { name: { equals: brand, mode: 'insensitive' } } } : {},
    ],
  }

  const gears = await prisma.gear.findMany({
    where,
    include: { reviews: true, category: true, brand: true },
  })

  return NextResponse.json(gears)
}
