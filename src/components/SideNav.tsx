"use client";
import { useState, useEffect } from "react";

const sections = [
  { id: "hero", icon: "🏠", label: "首页" },
  { id: "companies", icon: "📊", label: "公司" },
  { id: "features", icon: "⚡", label: "功能" },
  { id: "stats", icon: "📈", label: "数据" },
  { id: "cta", icon: "🚀", label: "开始" },
];

export default function SideNav() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
      {sections.map(({ id, icon, label }) => (
        <button
          key={id}
          onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
          className={`group relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${active === id ? "bg-white text-black scale-110" : "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:scale-105"}`}
          title={label}
        >
          <span className="text-sm">{icon}</span>
          <span className="absolute left-14 px-3 py-1 rounded-lg bg-zinc-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">{label}</span>
        </button>
      ))}
    </nav>
  );
}
