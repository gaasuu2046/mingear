// app/api/auth/delete/route.ts

import { NextResponse } from 'next/server'
import { Session } from "next-auth"
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function DELETE() {
  const session = await getServerSession(authOptions) as Session | null
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // ユーザーに関連するデータを削除
    await prisma.user.delete({
      where: { id: session.user.id },
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
