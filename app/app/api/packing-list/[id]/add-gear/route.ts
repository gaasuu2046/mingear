import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
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
    const data = await request.json();
    const { gearId, personalGearId, quantity } = data;

    // パッキングリストの所有者を確認
    const packingList = await prisma.packingList.findUnique({
      where: { id: packingListId },
      select: { userId: true },
    });

    if (!packingList || packingList.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // ギアをパッキングリストに追加
    await prisma.packingListItem.create({
      data: {
        packingListId,
        gearId,
        personalGearId,
        quantity: quantity || 1,
      },
    });

    // 更新されたパッキングリストを取得
    const updatedPackingList = await prisma.packingList.findUnique({
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

    return NextResponse.json(updatedPackingList);
  } catch (error) {
    console.error('Error adding gear to packing list:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
