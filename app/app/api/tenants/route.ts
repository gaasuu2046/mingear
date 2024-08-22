import { NextRequest, NextResponse } from 'next/server'

import { Tenant } from '@/src/model/model'
import { GetTenants, CreateTenant } from '@/src/usecase/tenant'

// テナント一覧を取得
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const installerId = searchParams.get("installer");
  if(installerId == null){
      return new NextResponse(JSON.stringify("installerを指定してください"))
  }
  const result: Tenant[] = await GetTenants(installerId)
  return new NextResponse(JSON.stringify(result))
}

// テナントを作成
export async function POST(req: NextRequest){
  const {name, type, parentId} = await req.json()
  if(name == null || type == null || parentId == null){
    return new NextResponse(JSON.stringify("必須パラメータが入力されていません"))
  }
  const result = await CreateTenant(name, type, parentId)
  return new NextResponse(JSON.stringify(result))
}
