import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const category = searchParams.get('category')
  const categoryId = searchParams.get('categoryId')
  const brand = searchParams.get('brand')
  const type = searchParams.get('type')
  const limit = parseInt(searchParams.get('limit') || '5', 10)
  const userId = searchParams.get('userId')

  const publicGearWhere: Prisma.GearWhereInput = {
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
      categoryId
        ? { categoryId: parseInt(categoryId) }
        : category
        ? { category: { name: { equals: category, mode: 'insensitive' } } }
        : {},
      brand ? { brand: { name: { equals: brand, mode: 'insensitive' } } } : {},
    ],
  }

  const personalGearWhere: Prisma.PersonalGearWhereInput = {
    AND: [
      { userId: userId || session?.user?.id },
      query
        ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { brand: { name: { contains: query, mode: 'insensitive' } } },
            ],
          }
        : {},
      categoryId
        ? { categoryId: parseInt(categoryId) }
        : category
        ? { category: { name: { equals: category, mode: 'insensitive' } } }
        : {},
      brand ? { brand: { name: { equals: brand, mode: 'insensitive' } } } : {},
    ],
  }

  let publicGears: Prisma.GearGetPayload<{ include: { reviews: true; category: true; brand: true } }>[] = []
  let personalGears: Prisma.PersonalGearGetPayload<{ include: { category: true; brand: true } }>[] = []

  if (type === 'public' || !session?.user) {
    publicGears = await prisma.gear.findMany({
      where: publicGearWhere,
      include: { reviews: true, category: true, brand: true },
      orderBy: { avgRating: 'desc' },
      take: limit,
    })
  } else {
    personalGears = await prisma.personalGear.findMany({
      where: personalGearWhere,
      include: { category: true, brand: true },
      take: limit,
    })

    if (personalGears.length < limit) {
      const remainingLimit = limit - personalGears.length
      publicGears = await prisma.gear.findMany({
        where: publicGearWhere,
        include: { reviews: true, category: true, brand: true },
        orderBy: { avgRating: 'desc' },
        take: remainingLimit,
      })
    }
  }

  const formattedPublicGears = publicGears.map(gear => ({
    ...gear,
    type: 'public' as const,
  }))

  const formattedPersonalGears = personalGears.map(gear => ({
    ...gear,
    type: 'personal' as const,
  }))

  const allGears = [...formattedPersonalGears, ...formattedPublicGears]
  
  return NextResponse.json(allGears)
}
