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
  const { name, description, categoryID, brandID, brandName, img, price, weight } = body
  
  let brand;
  if (brandID) {
    // 既存のブランドを使用
    brand = { connect: { id: brandID } }
  } else if (brandName) {
    // 新しいブランドを作成
    brand = { create: { name: brandName } }
  } else {
    throw new Error('brandID または brandName が必要です')
  }
  
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
      brand: brand
    },
    include: {
      category: true,
      brand: true
    }
  })

  return NextResponse.json(gear, { status: 201 })
}
