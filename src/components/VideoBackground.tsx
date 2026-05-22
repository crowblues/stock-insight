"use client";
import { useRef, useEffect } from "react";

interface Props {
  src: string;
  className?: string;
  overlay?: boolean;
}

/**
 * 视频背景组件 — requestAnimationFrame 驱动的淡入淡出循环
 * 融合 Weblex Dark Hero 的视频循环技术 + StoryTeaser 的叠加层结构
 */
export default function VideoBackground({ src, className = "", overlay = true }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const fadeIn = () => {
      let opacity = 0;
      const step = () => {
        opacity = Math.min(opacity + 0.03, 1);
        video.style.opacity = String(opacity);
        if (opacity < 1) frameRef.current = requestAnimationFrame(step);
      };
      frameRef.current = requestAnimationFrame(step);
    };

    const handleTimeUpdate = () => {
      if (!video.duration) return;
      const remaining = video.duration - video.currentTime;
      if (remaining < 1.5 && parseFloat(video.style.opacity || "1") > 0.1) {
        let opacity = parseFloat(video.style.opacity || "1");
        const fadeOut = () => {
          opacity = Math.max(opacity - 0.025, 0);
          video.style.opacity = String(opacity);
          if (opacity > 0) frameRef.current = requestAnimationFrame(fadeOut);
        };
        cancelAnimationFrame(frameRef.current);
        frameRef.current = requestAnimationFrame(fadeOut);
      }
    };

    const handleEnded = () => {
      video.style.opacity = "0";
      setTimeout(() => { video.currentTime = 0; video.play(); fadeIn(); }, 100);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("loadeddata", fadeIn);
    return () => {
      cancelAnimationFrame(frameRef.current);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("loadeddata", fadeIn);
    };
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        autoPlay muted loop playsInline preload="none"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0 }}
      >
        <source src={src} type="video/mp4" />
      </video>
      {overlay && <div className="absolute inset-0 bg-black/40" />}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}
