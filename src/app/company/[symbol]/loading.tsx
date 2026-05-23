export default function CompanyLoading() {
  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 text-[#20231d]"
      style={{
        background:
          "linear-gradient(90deg, #c9dcb2 0%, #eef1dc 16%, #f5f3ed 50%, #e8f0cf 84%, #b7d392 100%)",
      }}
    >
      <div className="pointer-events-none absolute left-0 top-0 h-full w-[18vw] min-w-40 bg-[linear-gradient(135deg,rgba(211,235,137,0.5),rgba(225,76,91,0.2)_48%,rgba(55,99,79,0.25))]" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-[18vw] min-w-40 bg-[linear-gradient(225deg,rgba(54,114,59,0.5),rgba(176,211,120,0.34)_50%,rgba(239,161,173,0.22))]" />

      <div className="relative flex min-h-[760px] w-full max-w-[1320px] items-center justify-center bg-[#f3f1ea] shadow-[0_24px_80px_rgba(42,56,31,0.18)]">
        <div className="pointer-events-none absolute left-1/2 top-[11%] h-8 w-[260px] -translate-x-1/2 rounded-[6px] bg-[#090b0b] opacity-90 shadow-[0_10px_26px_rgba(0,0,0,0.18)]" />
        <div className="pointer-events-none absolute left-1/2 top-[15%] h-8 w-[340px] -translate-x-1/2 rounded-[6px] bg-[#111313] opacity-85 shadow-[0_10px_26px_rgba(0,0,0,0.18)]" />
        <div className="pointer-events-none absolute bottom-[11%] left-1/2 h-8 w-[360px] -translate-x-1/2 rounded-[6px] bg-[#111313] opacity-90 shadow-[0_10px_26px_rgba(0,0,0,0.18)]" />

        <article className="relative z-10 h-[min(72vh,590px)] w-[min(760px,86vw)] animate-pulse overflow-hidden bg-white shadow-[0_26px_68px_rgba(28,31,24,0.28)]">
          <header className="px-8 pb-6 pt-7 text-center">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-3 w-40 bg-[#dedfd6]" />
              <div className="h-3 w-16 bg-[#dedfd6]" />
            </div>
            <div className="mx-auto h-48 w-full max-w-[470px] bg-[#111313]" />
            <div className="mx-auto mt-7 h-3 w-72 bg-[#dedfd6]" />
            <div className="mx-auto mt-4 h-14 w-[min(520px,70vw)] bg-[#d6d7ce]" />
            <div className="mx-auto mt-5 h-12 w-[min(560px,72vw)] bg-[#ecece6]" />
          </header>

          <section className="grid grid-cols-2 gap-3 px-8 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-[58px] rounded-[4px] border border-[#dcddd2] bg-[#f8f7f2]" />
            ))}
          </section>
        </article>
      </div>
    </main>
  );
}
