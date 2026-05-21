/**
 * 首页 — 全球财报分析平台的入口
 * 
 * 功能：
 * 1. 搜索框：输入股票代码或公司名，实时搜索
 * 2. 热门公司卡片：展示几个知名公司，点击直接进入详情
 * 3. 搜索结果列表：显示匹配的公司，点击跳转到详情页
 */
"use client"; // 标记为客户端组件（因为需要用户交互：输入、点击等）

import { useState } from "react";
import Link from "next/link";

// 定义搜索结果的数据类型（和后端返回的格式一致）
interface SearchResult {
  symbol: string;
  name: string;
  currency: string;
  exchangeFullName: string;
  exchange: string;
}

// 热门公司列表（首页下方展示的卡片数据）
const HOT_COMPANIES = [
  { symbol: "AAPL", name: "苹果", nameEn: "Apple Inc." },
  { symbol: "MSFT", name: "微软", nameEn: "Microsoft Corp." },
  { symbol: "GOOGL", name: "谷歌", nameEn: "Alphabet Inc." },
  { symbol: "AMZN", name: "亚马逊", nameEn: "Amazon.com Inc." },
  { symbol: "TSLA", name: "特斯拉", nameEn: "Tesla Inc." },
  { symbol: "NVDA", name: "英伟达", nameEn: "NVIDIA Corp." },
];

export default function HomePage() {
  // --- 状态管理 ---
  const [query, setQuery] = useState("");         // 搜索框的输入内容
  const [results, setResults] = useState<SearchResult[]>([]); // 搜索结果
  const [loading, setLoading] = useState(false);  // 是否正在搜索
  const [searched, setSearched] = useState(false); // 是否已经搜索过

  /**
   * 执行搜索
   * 当用户点击搜索按钮或按回车时触发
   */
  const handleSearch = async () => {
    // 如果输入为空，不执行搜索
    if (!query.trim()) return;

    setLoading(true);  // 开始加载
    setSearched(true); // 标记已搜索

    try {
      // 调用我们自己的后端 API（/api/search），传入搜索关键词
      const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
      const data = await response.json();
      setResults(data); // 保存搜索结果
    } catch (error) {
      console.error("搜索失败:", error);
      setResults([]);
    } finally {
      setLoading(false); // 结束加载
    }
  };

  /**
   * 处理键盘事件：按回车键触发搜索
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // --- 页面渲染 ---
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* 顶部标题区域 */}
      <div className="pt-20 pb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          📊 全球财报分析
        </h1>
        <p className="text-gray-500 text-lg">
          输入股票代码或公司名称，查看财务数据
        </p>
      </div>

      {/* 搜索框区域 */}
      <div className="max-w-2xl mx-auto px-4 mb-10">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入股票代码（如 AAPL）或公司名称..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg
                       text-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg
                       hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {loading ? "搜索中..." : "搜索"}
          </button>
        </div>
      </div>

      {/* 搜索结果区域 */}
      {searched && (
        <div className="max-w-2xl mx-auto px-4 mb-10">
          {results.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <h2 className="px-4 py-3 bg-gray-50 text-gray-700 font-medium border-b">
                搜索结果（{results.length} 条）
              </h2>
              <ul>
                {results.map((item) => (
                  <li key={item.symbol} className="border-b last:border-b-0">
                    <Link
                      href={`/company/${item.symbol}`}
                      className="flex items-center justify-between px-4 py-3
                                 hover:bg-blue-50 transition-colors"
                    >
                      <div>
                        <span className="font-bold text-blue-600 mr-2">
                          {item.symbol}
                        </span>
                        <span className="text-gray-700">{item.name}</span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {item.exchange}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              未找到匹配的公司，请尝试其他关键词
            </p>
          )}
        </div>
      )}

      {/* 热门公司卡片区域 */}
      {!searched && (
        <div className="max-w-4xl mx-auto px-4 pb-20">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            🔥 热门公司
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {HOT_COMPANIES.map((company) => (
              <Link
                key={company.symbol}
                href={`/company/${company.symbol}`}
                className="block p-4 bg-white rounded-lg shadow-sm border
                           border-gray-100 hover:shadow-md hover:border-blue-200
                           transition-all text-center"
              >
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {company.symbol}
                </div>
                <div className="text-gray-700">{company.name}</div>
                <div className="text-sm text-gray-400">{company.nameEn}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
