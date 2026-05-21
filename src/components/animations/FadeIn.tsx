/**
 * 通用淡入动画组件
 * 
 * 包裹任何内容，当滚动到可见区域时自动播放淡入动画。
 * 支持自定义方向、延迟、持续时间。
 */
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface FadeInProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  className?: string;
}

export default function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  className = "",
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  // 根据方向决定初始位移
  const getOffset = () => {
    switch (direction) {
      case "up": return { y: 40, x: 0 };
      case "down": return { y: -40, x: 0 };
      case "left": return { y: 0, x: 40 };
      case "right": return { y: 0, x: -40 };
    }
  };

  useGSAP(() => {
    if (!ref.current) return;
    const offset = getOffset();

    gsap.from(ref.current, {
      scrollTrigger: {
        trigger: ref.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: offset.y,
      x: offset.x,
      duration,
      delay,
      ease: "power2.out",
    });
  }, { scope: ref });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
