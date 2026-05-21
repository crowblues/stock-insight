/**
 * Lenis 平滑滚动组件
 * 
 * 包裹整个页面，让滚动有丝滑的阻尼感。
 * 同时让 GSAP ScrollTrigger 和 Lenis 同步。
 */
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "@/lib/gsap";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    // 让 ScrollTrigger 和 Lenis 同步
    lenis.on("scroll", () => ScrollTrigger.update());

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}
