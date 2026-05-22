"use client";
import { useState, useRef, useEffect } from "react";

const CARDS = [
  { symbol: "AAPL", name: "Apple", image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80" },
  { symbol: "MSFT", name: "Microsoft", image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=600&q=80" },
  { symbol: "NVDA", name: "NVIDIA", image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&q=80" },
  { symbol: "GOOGL", name: "Alphabet", image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=600&q=80" },
  { symbol: "AMZN", name: "Amazon", image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=600&q=80" },
  { symbol: "TSLA", name: "Tesla", image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&q=80" },
  { symbol: "META", name: "Meta", image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80" },
  { symbol: "JPM", name: "JPMorgan", image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=600&q=80" },
  { symbol: "V", name: "Visa", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80" },
  { symbol: "AVGO", name: "Broadcom", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80" },
  { symbol: "UNH", name: "UnitedHealth", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80" },
  { symbol: "BRK.B", name: "Berkshire", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80" },
];

// 每张卡片在3D空间的散落坐标: [x%, y%, z(px), rotateX, rotateY, rotateZ]
const L: number[][] = [
  [-28,-8, 40, 8,-25,-3],[-12, 6,100,-4,-15, 2],[ 0,-16,160, 6,-8,-1],
  [ 12, 3,120,-3, 12, 2],[ 22,-6, 60, 5, 20,-2],[ 30, 8,140,-6, 28, 3],
  [-24,14,180, 4,-20,-2],[ -6,-3, 20,-5, -5, 1],[ 14,12, 80, 7, 15,-1],
  [ 26,-12,200,-2, 22, 2],[-18,-20, 90, 3,-18,-1],[ 4, 18, 50,-7, 5, 2],
];

export default function RecordGallery3D() {
  const [active, setActive] = useState(-1);
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setActive(p => {
        const n = p + (e.deltaY > 0 ? 1 : -1);
        return n < -1 ? CARDS.length - 1 : n >= CARDS.length ? -1 : n;
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMx((e.clientX - r.left) / r.width - 0.5);
    setMy((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section id="companies" ref={ref} onMouseMove={onMove} data-lenis-prevent
      className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]"
      style={{ perspective: "1200px" }}>

      {/* 整体容器 — 鼠标视差旋转 */}
      <div className="absolute inset-0 flex items-center justify-center"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateY(${mx * 12}deg) rotateX(${-my * 8}deg)`,
          transition: "transform 0.15s ease-out",
        }}>

        {CARDS.map((card, i) => {
          const [x, y, z, rx, ry, rz] = L[i];
          const isActive = active === i;
          const t = isActive
            ? `translate3d(0, 0, 350px) rotateX(0deg) rotateY(0deg) rotateZ(-2deg) scale(1.15)`
            : `translate3d(${x}%, ${y}%, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;

          return (
            <a key={card.symbol} href={`/company/${card.symbol}`}
              onClick={(e) => { if (!isActive) { e.preventDefault(); setActive(i); } }}
              className="absolute rounded-xl overflow-hidden shadow-2xl cursor-pointer"
              style={{
                width: "220px", height: "300px",
                transform: t,
                opacity: active === -1 ? 1 : isActive ? 1 : 0.4,
                zIndex: isActive ? 50 : 10,
                transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                transformStyle: "preserve-3d",
              }}>
              <img src={card.image} alt={card.name}
                className="w-full h-full object-cover" draggable={false} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-xs font-mono opacity-50">{card.symbol}</p>
                <p className="text-white text-sm font-bold">{card.name}</p>
              </div>
            </a>
          );
        })}
      </div>

      {/* 底部信息 */}
      <div className="absolute bottom-8 left-8 z-20 pointer-events-none">
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">
          {active >= 0 ? `${String(active+1).padStart(2,"0")} / ${CARDS.length}` : "scroll to browse"}
        </p>
        {active >= 0 && <h2 className="text-2xl font-bold text-white">{CARDS[active].name}</h2>}
      </div>
    </section>
  );
}
