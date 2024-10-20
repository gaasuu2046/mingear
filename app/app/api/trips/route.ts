import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const trips = await prisma.trip.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        area: true,
        elevation: true,
        packingList: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });
    
    return NextResponse.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json({ message: 'Error fetching trips' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, detail, ptid, elevation, area, startDate, endDate } = body;

    const trip = await prisma.trip.create({
      data: {
        name,
        detail,
        ptid,
        elevation,
        area,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId: session.user.id,
      },
    });

    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    console.error('Error creating trip:', error);
    return NextResponse.json({ message: 'Error creating trip' }, { status: 500 });
  }
}
