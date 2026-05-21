/**
 * Marquee 跑马灯组件
 * 
 * 无限向左滚动的文字条，用来模糊 section 之间的边界。
 * 纯 CSS 动画实现，不需要 JS。
 */
"use client";

interface MarqueeProps {
  items: string[];
  speed?: number; // 秒数，越小越快
  className?: string;
}

export default function Marquee({ items, speed = 20, className = "" }: MarqueeProps) {
  // 重复内容确保无缝循环
  const content = items.join(" · ");

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div
        className="inline-block animate-marquee"
        style={{ animationDuration: `${speed}s` }}
      >
        <span className="inline-block px-4">{content}</span>
        <span className="inline-block px-4">{content}</span>
        <span className="inline-block px-4">{content}</span>
        <span className="inline-block px-4">{content}</span>
      </div>
    </div>
  );
}
