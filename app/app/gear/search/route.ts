// app/gear/search/route.ts
import { Prisma } from '@prisma/client'
import { PersonalGear, Category, Brand, Gear, Review } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'


interface publicGearWithRelations extends Gear {
  category: Category;
  brand: Brand | null;
  reviews: Review[];
}
interface FormattedPublicGear extends publicGearWithRelations {
  type: 'public';
}
interface PersonalGearWithRelations extends PersonalGear {
  category: Category;
  brand: Brand | null;
}


export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const category = searchParams.get('category')
  const brand = searchParams.get('brand')
  const type = searchParams.get('type')
  const limit = parseInt(searchParams.get('limit') || '5', 10)


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
              { brand: { name: { contains: query, mode: 'insensitive' } } },
            ],
          }
        : {},
      category ? { category: { name: { equals: category, mode: 'insensitive' } } } : {},
      // brand ? { brand: { name: { equals: brand, mode: 'insensitive' } } } : {},
    ],
  }

  let publicGears: publicGearWithRelations[] = []
  let personalGears: PersonalGearWithRelations[] = []

  if (type === 'public' || !session?.user) {
    publicGears = await prisma.gear.findMany({
      where: publicGearWhere,
      include: { reviews: true, category: true, brand: true },
      orderBy: { avgRating: 'desc' },
      take: limit,
    }) as publicGearWithRelations[]
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
      }) as publicGearWithRelations[]
    }
  }

  const formattedPublicGears: FormattedPublicGear[] = publicGears.map(gear => ({
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
