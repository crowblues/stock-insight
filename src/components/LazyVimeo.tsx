"use client";
import { useRef, useState, useEffect } from "react";

interface LazyVimeoProps {
  videoId: string;
  className?: string;
}

export default function LazyVimeo({ videoId, className = "" }: LazyVimeoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {loaded ? (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen"
          style={{ border: 0 }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black animate-pulse" />
      )}
    </div>
  );
}
