// app/gear/search/route.ts
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
  const brand = searchParams.get('brand')

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
      category ? { category: { name: { equals: category, mode: 'insensitive' } } } : {},
      brand ? { brand: { name: { equals: brand, mode: 'insensitive' } } } : {},
    ],
  }

  const personalGearWhere: Prisma.PersonalGearWhereInput = {
    AND: [
      { userId: session?.user?.id },
      query
        ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
            ],
          }
        : {},
      category ? { category: { name: { equals: category, mode: 'insensitive' } } } : {},
      // brand ? { brand: { name: { equals: brand, mode: 'insensitive' } } } : {},
    ],
  }

  const [publicGears, personalGears] = await Promise.all([
    prisma.gear.findMany({
      where: publicGearWhere,
      include: { reviews: true, category: true, brand: true },
    }),
    session?.user
      ? prisma.personalGear.findMany({
          where: personalGearWhere,
          include: { category: true, brand: true }, 
        })
      : [],
  ])

  const formattedPublicGears = publicGears.map(gear => ({
    ...gear,
    type: 'public' as const,
  }))

  const formattedPersonalGears = personalGears.map(gear => ({
    ...gear,
    type: 'personal' as const,
  }))

  const allGears = [...formattedPublicGears, ...formattedPersonalGears]

  return NextResponse.json(allGears)
}