// app/api/gear/route.ts
import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'


export async function GET() {
  const gears = await prisma.gear.findMany({
    include: { reviews: true },
  })
  return NextResponse.json(gears)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, categoryID, brandID, brandName, img, price, weight, productUrl } = body
    
    let brand;
    if (brandID) {
      brand = { connect: { id: parseInt(brandID, 10) } }
    } else if (brandName) {
      brand = { create: { name: brandName } }
    } else {
      return NextResponse.json({ error: 'brandID または brandName が必要です' }, { status: 400 });
    }
    
    const gear = await prisma.gear.create({
      data: {
        name,
        description,
        img,
        price: price ? parseInt(price, 10) : null,
        weight: parseInt(weight, 10),
        category: {
          connect: { id: parseInt(categoryID, 10) }
        },
        brand: brand,
        productUrl
      },
      include: {
        category: true,
        brand: true
      }
    })

    return NextResponse.json(gear, { status: 201 })
  } catch (error) {
    console.error('Error creating gear:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ error: '同じ名前のギアが既に存在します。' }, { status: 400 })
      }
    }
    return NextResponse.json({ error: 'ギアの作成中にエラーが発生しました。' }, { status: 500 })
  }
}
