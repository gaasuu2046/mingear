import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const packingListId = parseInt(params.id, 10);
  if (isNaN(packingListId)) {
    return NextResponse.json({ error: 'Invalid packing list ID' }, { status: 400 });
  }

  try {
    const packingList = await prisma.packingList.findUnique({
      where: { id: packingListId },
      select: { userId: true },
    });

    if (!packingList) {
      return NextResponse.json({ error: 'Packing list not found' }, { status: 404 });
    }

    if (packingList.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { gears } = await request.json();

    if (!Array.isArray(gears)) {
      return NextResponse.json({ error: 'Invalid gears data' }, { status: 400 });
    }

    // トランザクションを使用して、既存のアイテムを削除し、新しいアイテムを追加する
    const updatedPackingList = await prisma.$transaction(async (prisma) => {
      // 既存のアイテムを全て削除
      await prisma.packingListItem.deleteMany({
        where: { packingListId },
      });

      // 新しいアイテムを追加
      await prisma.packingListItem.createMany({
        data: gears.map((gear) => ({
          packingListId,
          gearId: gear.type === 'public' ? gear.id : undefined,
          personalGearId: gear.type === 'personal' ? gear.id : undefined,
          quantity: gear.quantity || 1,
          altName: gear.name,
        })),
      });

      // 更新されたパッキングリストを取得
      return prisma.packingList.findUnique({
        where: { id: packingListId },
        include: {
          items: {
            include: {
              gear: true,
              personalGear: true,
            },
          },
        },
      });
    });

    return NextResponse.json(updatedPackingList);
  } catch (error) {
    console.error('Error updating packing list items:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
