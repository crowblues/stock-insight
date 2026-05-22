"use client";
import { useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
}

export default function MagneticButton({ children, className = "", href, onClick }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setPos({ x, y });
  };

  const reset = () => setPos({ x: 0, y: 0 });

  const inner = (
    <div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      className={`inline-block transition-transform duration-200 ease-out cursor-pointer hover:scale-110 ${className}`}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
    >
      {children}
    </div>
  );

  if (href) return <a href={href}>{inner}</a>;
  return inner;
}
