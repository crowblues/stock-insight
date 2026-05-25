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
      duration: 1.8,
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      prevent: (node: HTMLElement) => node.closest("[data-lenis-prevent]") !== null,
    });

    // 让 ScrollTrigger 和 Lenis 同步
    lenis.on("scroll", () => ScrollTrigger.update());

    // 允许其他组件暂停/恢复 Lenis（Mac 触控板滚动嵌套容器需要）
    const handleStop = () => lenis.stop();
    const handleStart = () => lenis.start();
    window.addEventListener("lenis-stop", handleStop);
    window.addEventListener("lenis-start", handleStart);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      window.removeEventListener("lenis-stop", handleStop);
      window.removeEventListener("lenis-start", handleStart);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
