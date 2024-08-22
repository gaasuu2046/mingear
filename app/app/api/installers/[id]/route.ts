import { NextRequest, NextResponse } from 'next/server'

import { Installer } from '@/src/model/model'
import { DeleteInstaller } from '@/src/usecase/installer'

// 代理店を削除
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }){
    const result: null = await DeleteInstaller(params.id)
    return new NextResponse(JSON.stringify(result))
}
