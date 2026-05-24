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

      <div className="report-stage-inner relative flex min-h-[760px] w-full max-w-[1320px] items-center justify-center overflow-hidden bg-[#f3f1ea] shadow-[0_24px_80px_rgba(42,56,31,0.18)]">
        <div className="pointer-events-none absolute left-1/2 top-[11%] h-8 w-[260px] -translate-x-1/2 rounded-[6px] bg-[#090b0b] opacity-90 shadow-[0_10px_26px_rgba(0,0,0,0.18)]" />
        <div className="pointer-events-none absolute left-1/2 top-[15%] h-8 w-[340px] -translate-x-1/2 rounded-[6px] bg-[#111313] opacity-85 shadow-[0_10px_26px_rgba(0,0,0,0.18)]" />
        <div className="pointer-events-none absolute bottom-[11%] left-1/2 h-8 w-[360px] -translate-x-1/2 rounded-[6px] bg-[#111313] opacity-90 shadow-[0_10px_26px_rgba(0,0,0,0.18)]" />

        <div className="report-depth-layer report-depth-layer-a pointer-events-none absolute left-1/2 top-1/2 h-[min(70vh,560px)] w-[min(760px,86vw)] -translate-x-1/2 -translate-y-1/2 rotate-[-1.2deg] bg-[#151813] shadow-[0_30px_70px_rgba(25,30,20,0.18)]" />
        <div className="report-depth-layer report-depth-layer-b pointer-events-none absolute left-1/2 top-1/2 h-[min(70vh,560px)] w-[min(760px,86vw)] -translate-x-1/2 -translate-y-1/2 rotate-[1deg] bg-[#d9dbcf] shadow-[0_26px_62px_rgba(39,45,32,0.16)]" />

        <article
          data-lenis-prevent
          className="report-loading-panel relative z-10 h-[min(72vh,590px)] w-[min(760px,86vw)] overflow-hidden border border-white/70 bg-white shadow-[0_30px_80px_rgba(28,31,24,0.32)]"
        >
          <header className="px-8 pb-6 pt-7 text-center">
            <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[#62645d]">
              <span>Stock Insight Archive</span>
              <span>Loading</span>
            </div>

            <div className="relative mx-auto flex h-48 w-full max-w-[470px] items-center justify-center overflow-hidden bg-[#090a0a] shadow-[0_18px_42px_rgba(0,0,0,0.24)]">
              <div className="absolute h-full w-full bg-[radial-gradient(circle_at_68%_40%,rgba(255,255,255,0.2),transparent_23%),linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0)_42%),linear-gradient(90deg,#070909,#171a18)]" />
              <div className="report-loading-sweep absolute inset-y-0 -left-1/2 w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)]" />
              <div className="relative z-10 h-20 w-20 rounded-[6px] bg-white/92 p-2 shadow-[0_14px_36px_rgba(0,0,0,0.28)]">
                <div className="h-full w-full rounded-[4px] bg-[#d84b69]" />
              </div>
              <div className="relative z-10 ml-5 text-left">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">Signal</p>
                <p className="mt-2 text-xl font-semibold leading-tight text-white">Preparing Report</p>
              </div>
            </div>

            <div className="mx-auto mt-7 h-3 w-72 bg-[#dcddd2]" />
            <div className="mx-auto mt-4 h-14 w-[min(520px,70vw)] bg-[#d6d8ce]" />
            <div className="mx-auto mt-5 h-12 w-[min(560px,72vw)] bg-[#efeee8]" />
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
