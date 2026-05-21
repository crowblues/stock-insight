/**
 * GSAP 初始化配置
 * 
 * GSAP 是一个专业的动画库，ScrollTrigger 是它的滚动驱动插件。
 * 这个文件统一注册插件，其他组件直接从这里导入即可。
 */
"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 注册 ScrollTrigger 插件（只需要注册一次）
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
