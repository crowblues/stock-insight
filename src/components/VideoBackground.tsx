"use client";
import { useRef, useEffect } from "react";

interface Props {
  src: string;
  className?: string;
  overlay?: boolean;
}

export default function VideoBackground({ src, className = "", overlay = true }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number>(0);
  const fadingOut = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const fadeIn = () => {
      fadingOut.current = false;
      let opacity = 0;
      const step = () => {
        if (fadingOut.current) return;
        opacity = Math.min(opacity + 0.02, 1);
        video.style.opacity = String(opacity);
        if (opacity < 1) frameRef.current = requestAnimationFrame(step);
      };
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(step);
    };

    const handleTimeUpdate = () => {
      if (!video.duration || fadingOut.current) return;
      const remaining = video.duration - video.currentTime;
      if (remaining < 1.5) {
        fadingOut.current = true;
        let opacity = parseFloat(video.style.opacity || "1");
        const fadeOut = () => {
          opacity = Math.max(opacity - 0.02, 0);
          video.style.opacity = String(opacity);
          if (opacity > 0) frameRef.current = requestAnimationFrame(fadeOut);
        };
        cancelAnimationFrame(frameRef.current);
        frameRef.current = requestAnimationFrame(fadeOut);
      }
    };

    const handleEnded = () => {
      video.style.opacity = "0";
      video.currentTime = 0;
      video.play();
      setTimeout(fadeIn, 100);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("canplay", fadeIn, { once: true });
    return () => {
      cancelAnimationFrame(frameRef.current);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
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
      {overlay && <div className="absolute inset-0 bg-black/50" />}
    </div>
  );
}
