import { NextRequest, NextResponse } from 'next/server'

import { ProfileMetadata } from '@/src/model/model'
import { GetProfileMetadatas } from '@/src/usecase/profile'

// Route Handlerがhandler層(controller層)となる
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const tenantId = params.id
  // usecase層を呼び出す
  const result: ProfileMetadata[] = await GetProfileMetadatas(tenantId)
  return new NextResponse(JSON.stringify(result))
}
