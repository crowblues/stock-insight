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
    <div className="min-h-screen bg-[#0a0a0a] animate-pulse">
      {/* 顶部骨架 */}
      <header className="bg-[#141414] border-b border-[#2a2a2a]">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            {/* Logo 占位 */}
            <div className="w-16 h-16 bg-[#2a2a2a] rounded-lg" />
            <div className="flex-1">
              <div className="h-7 bg-[#2a2a2a] rounded w-48 mb-2" />
              <div className="h-4 bg-[#2a2a2a] rounded w-64" />
            </div>
            <div className="text-right">
              <div className="h-7 bg-[#2a2a2a] rounded w-24 mb-2" />
              <div className="h-4 bg-[#2a2a2a] rounded w-20" />
            </div>
          </div>
        </div>
      </header>

      {/* 主内容骨架 */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* 关键指标卡片骨架 */}
        <section>
          <div className="h-5 bg-[#2a2a2a] rounded w-32 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[#141414] p-4 rounded-lg border border-[#2a2a2a]">
                <div className="h-4 bg-[#2a2a2a] rounded w-20 mb-2" />
                <div className="h-6 bg-[#2a2a2a] rounded w-16" />
              </div>
            ))}
          </div>
        </section>

        {/* 图表区域骨架 */}
        <section>
          <div className="h-5 bg-[#2a2a2a] rounded w-32 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#141414] p-4 rounded-lg border border-[#2a2a2a] h-[300px]" />
            <div className="bg-[#141414] p-4 rounded-lg border border-[#2a2a2a] h-[300px]" />
          </div>
        </section>

        {/* 表格骨架 */}
        <section>
          <div className="h-5 bg-[#2a2a2a] rounded w-40 mb-4" />
          <div className="bg-[#141414] rounded-lg border border-[#2a2a2a] p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 bg-[#2a2a2a] rounded" />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
