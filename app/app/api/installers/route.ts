import { NextRequest, NextResponse } from 'next/server'

import { Installer } from '@/src/model/model'
import { GetInstallers, CreateInstaller } from '@/src/usecase/installer'

// 代理店一覧を取得
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const subsidiaryId = searchParams.get("subsidiary");
    if(subsidiaryId == null){
        return new NextResponse(JSON.stringify("subsidiaryを指定してください"))
    }
  const result: Installer[] = await GetInstallers(subsidiaryId)
  // resultが空の場合は404を返す
  if(result.length == 0){
    return new NextResponse(JSON.stringify("指定された代理店が存在しません"), {status: 404})
  }
  return new NextResponse(JSON.stringify(result))
}

// 代理店を作成
export async function POST(req: NextRequest){
  const {name, parentId} = await req.json()
  if(name == null || parentId == null){
    return new NextResponse(JSON.stringify("必須パラメータが入力されていません"))
  }
  const result = await CreateInstaller(name, parentId)
  return new NextResponse(JSON.stringify(result))
}
