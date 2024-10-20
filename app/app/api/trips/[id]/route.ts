// app/api/trips/[id]/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const tripId = parseInt(params.id, 10);

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { userId: true },
    });

    if (!trip) {
      return NextResponse.json({ message: 'Trip not found' }, { status: 404 });
    }

    if (trip.userId !== session.user.id) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    await prisma.trip.delete({
      where: { id: tripId },
    });

    return NextResponse.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    return NextResponse.json({ message: 'Error deleting trip' }, { status: 500 });
  }
}
