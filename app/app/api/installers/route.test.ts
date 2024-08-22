import {NextRequest} from 'next/server'

import { GET } from './route'

describe("GET /api/users", () => {
  //　Dynamodb に実際データを持っているidの場合のテスト 
  it ('代理店一覧取得APIのテスト', async () => {
    const searchParams = new URLSearchParams()
    searchParams.set('subsidiary', '247776c3-cab4-481b-9b2c-19b1ac8af27d')
    const req = new NextRequest(`http://localhost:3000/api/installers?${searchParams.toString()}`)
    
    const result = await GET(req)
    // bodyの内容をtextで出力
    const resultText = await result.text(); // ReadableStreamをテキストに変換
    console.log(resultText); // テキストとして出力
    const expectBody = JSON.stringify([
      {
        "createdAt": "Wed Aug 21 2024 03:56:44 GMT+0000 (Coordinated Universal Time)",
        "parentID": "parent_id1",
        "PK": "247776c3-cab4-481b-9b2c-19b1ac8af27d",
        "name": "代理店名"
      }
    ]);
    expect(resultText).toBe(expectBody); // テキストとして比較
    expect(result.status).toBe(200)
  });
  //　Dynamodb にデータがない場合のテスト
  it ('代理店一覧取得APIのテスト 異常系 id不正', async () => {
    const searchParams = new URLSearchParams()
    searchParams.set('subsidiary', 'hogehoge')
    const req = new NextRequest(`http://localhost:3000/api/installers?${searchParams.toString()}`)
    
    const result = await GET(req) 
    // bodyの内容をtextで出力
    const resultText = await result.text(); // ReadableStreamをテキストに変換
    console.log(resultText); // テキストとして出力
    const expectBody = JSON.stringify("指定された代理店が存在しません");
    expect(resultText).toBe(expectBody); // テキストとして比較
    expect(result.status).toBe(404)
  });
});

