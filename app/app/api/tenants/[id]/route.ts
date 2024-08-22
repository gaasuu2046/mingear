import { NextRequest, NextResponse } from 'next/server'

import { Tenant } from '@/src/model/model'
import { DeleteTenant } from '@/src/usecase/tenant'

// テナントを削除
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }){
    const result: null = await DeleteTenant(params.id)
    return new NextResponse(JSON.stringify(result))
}
