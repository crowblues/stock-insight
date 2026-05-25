"use client";

import { memo } from "react";
import { motion, type ComponentProps } from "motion/react";
import type { RecordCard, CardFaceRenderState } from "./types";

/** 方案3：React.memo 避免展开/关闭时其他卡片不必要的 re-render */
export const CardFace = memo(function CardFace({
  card,
  state,
  className,
  style,
}: {
  card: RecordCard;
  state: CardFaceRenderState;
  className?: string;
  style?: ComponentProps<typeof motion.div>["style"];
}) {
  return (
    <motion.div
      className={`relative overflow-hidden text-white ${className ?? ""}`}
      style={{
        height: state.height,
        borderRadius: state.radius,
        borderWidth: state.borderWidth,
        borderStyle: "solid",
        borderColor: state.borderColor,
        backgroundImage: `linear-gradient(90deg, rgba(4,5,5,0.97) 0%, rgba(8,9,10,0.88) 46%, rgba(10,12,12,0.74) 100%), url(${card.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: state.boxShadow,
        flexShrink: 0,
        ...style,
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_42%,rgba(0,0,0,0.2))]" />
      <div
        className="absolute right-3 top-2 rounded-[4px] px-2 py-0.5 font-mono text-[10px] font-bold text-[#101211]"
        style={{ backgroundColor: card.tint }}
      >
        {card.change}
      </div>

      <div className="relative flex min-h-[42px] items-center gap-3 px-4 py-2.5">
        <motion.img
          src={card.image}
          alt=""
          className="h-12 w-12 shrink-0 origin-left rounded-[4px] object-cover"
          style={{ scale: state.imageScale }}
        />

        <div className="min-w-0 flex-1 pr-20">
          <motion.div
            className="mb-1 flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white"
            style={{ opacity: state.metaOpacity }}
          >
            <span>{card.symbol}</span>
            <span className="h-1 w-1 rounded-full" style={{ backgroundColor: card.tint }} />
            <span>{card.sub}</span>
          </motion.div>

          <div className="relative leading-tight">
            <motion.h3
              className="truncate text-sm font-bold leading-tight tracking-normal text-white"
              style={{ opacity: state.compactTitleOpacity }}
            >
              {card.name}
            </motion.h3>
            <motion.h3
              aria-hidden="true"
              className="absolute inset-x-0 top-0 truncate text-lg font-bold leading-tight tracking-normal text-white"
              style={{ opacity: state.detailTitleOpacity }}
            >
              {card.name}
            </motion.h3>
          </div>

          <motion.div
            className="mt-1.5"
            style={{
              opacity: state.descriptionOpacity,
              y: state.descriptionY,
            }}
          >
            <p className="max-w-[460px] truncate text-xs text-white/66">{card.desc}</p>
            <motion.div
              className="mt-1.5 flex flex-wrap items-center gap-2"
              style={{ opacity: state.hintOpacity }}
            >
              <span className="rounded-full border border-white/25 bg-white/12 px-3.5 py-1 text-xs font-semibold text-white/78">
                Click to expand
              </span>
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/12 bg-white/8 px-2.5 py-0.5 text-[10px] text-white/72"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});
