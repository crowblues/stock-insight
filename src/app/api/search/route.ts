/**
 * 搜索 API 路由
 * 
 * 前端搜索框输入内容后，会调用这个接口。
 * 这个接口再去调用 FMP 的搜索 API，把结果返回给前端。
 * 
 * 为什么要这样中转？
 * 因为 API 密钥不能暴露在前端代码里（会被别人看到），
 * 所以通过后端路由来转发请求，密钥只在服务器端使用。
 */

import { NextRequest, NextResponse } from "next/server";
import { searchCompanies } from "@/lib/fmp";

/**
 * 处理 GET 请求：/api/search?q=关键词
 */
export async function GET(request: NextRequest) {
  // 从 URL 参数中获取搜索关键词
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  // 如果没有输入关键词，返回错误提示
  if (!query || query.trim() === "") {
    return NextResponse.json(
      { error: "请输入搜索关键词" },
      { status: 400 }
    );
  }

  // 调用 FMP API 搜索公司
  const results = await searchCompanies(query);

  // 返回搜索结果
  return NextResponse.json(results);
}
