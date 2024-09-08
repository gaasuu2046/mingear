// app/api/personal-gear/route.ts

import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json()
    const { name, gearId, weight, categoryId, brandId, brandName, img, price, productUrl } = body;
    let brand;
    if (brandId)  {
      brand = { connect: { id: brandId } };
    } else if (brandName) {
      brand = { create: { name: brandName } };
    } else {
      brand = undefined;
    } 

    const gear = await prisma.personalGear.create({
      data: {
        userId: session.user.id,
        name,
        gearId: gearId || undefined,  // gearIdがない場合はundefinedを設定
        img,
        price,
        weight,
        category: {
          connect: { id: categoryId }
        },
        brand: brand,
        productUrl,
      },
      include: {
        category: true,
        brand: true
      }  
    });

    return NextResponse.json(gear, { status: 201 });
  } catch (error) {
    console.error('Error creating personal gear:', error);
    return NextResponse.json({ message: 'Error creating personal gear' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method GET not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: 'Method PUT not allowed' }, { status: 405 });
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions) as Session | null
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await request.json()
  console.log('id',  id)

  try {
    await prisma.personalGear.delete({
      where: { id },
    })
    // cache 0
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to remove from personal gear list' }, { status: 500 })
  }
}
