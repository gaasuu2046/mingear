// app/api/gear/search/route.ts
import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const category = searchParams.get('category')
  const brand = searchParams.get('brand')

  const gears = await prisma.gear.findMany({
    where: {
      AND: [
        query ? {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { brand: { contains: query, mode: 'insensitive' } },
          ],
        } : {},
        category ? { category: { equals: category, mode: 'insensitive' } } : {},
        brand ? { brand: { equals: brand, mode: 'insensitive' } } : {},
      ],
    },
    include: { reviews: true },
  })

  return NextResponse.json(gears)
}
