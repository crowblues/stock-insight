/**
 * 加载骨架屏
 * 
 * 当用户点击进入公司详情页时，数据还在加载中，
 * Next.js 会自动显示这个组件，让用户看到"正在加载"的效果，
 * 而不是一片白屏。
 * 
 * 这是 Next.js App Router 的内置功能，
 * 只要文件名叫 loading.tsx 放在对应路由文件夹里就自动生效。
 */

export default function CompanyLoading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* 顶部骨架 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            {/* Logo 占位 */}
            <div className="w-16 h-16 bg-gray-200 rounded-lg" />
            <div className="flex-1">
              {/* 公司名占位 */}
              <div className="h-7 bg-gray-200 rounded w-48 mb-2" />
              {/* 行业信息占位 */}
              <div className="h-4 bg-gray-200 rounded w-64" />
            </div>
            {/* 股价占位 */}
            <div className="text-right">
              <div className="h-7 bg-gray-200 rounded w-24 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
          </div>
        </div>
      </header>

      {/* 主内容骨架 */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* 关键指标卡片骨架 */}
        <section>
          <div className="h-5 bg-gray-200 rounded w-32 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
                <div className="h-6 bg-gray-200 rounded w-16" />
              </div>
            ))}
          </div>
        </section>

        {/* 图表区域骨架 */}
        <section>
          <div className="h-5 bg-gray-200 rounded w-32 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm h-[300px]" />
            <div className="bg-white p-4 rounded-lg shadow-sm h-[300px]" />
          </div>
        </section>

        {/* 表格骨架 */}
        <section>
          <div className="h-5 bg-gray-200 rounded w-40 mb-4" />
          <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded" />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
