/* ─── 卡片尺寸 ─── */
export const CARD_W = 560;
export const FULL_CARD_W = 870;
export const CARD_H = 160;
export const FULL_CARD_H = 620;
export const GAP = -110;
export const STEP = CARD_H + GAP; // 50
export const TILT = -34; // rotateX 倾斜角度
export const STAGE_H = 660;
export const SLOTS = 18;

/* ─── 交互偏移 ─── */
export const SHIFT_AMOUNT_PEEK = 60;
export const SHIFT_AMOUNT_FULL = 210;

/* ─── 动画 ─── */
export const TRANSITION_CONFIG = {
  type: "tween" as const,
  ease: [0.25, 0.1, 0.25, 1.0] as [number, number, number, number],
  duration: 0.45,
};

/* ─── 滚动 ─── */
export const SCROLL_LERP = 0.13;
export const WHEEL_SENSITIVITY = 0.7;
export const TOUCH_SENSITIVITY = 1.1;

/* ─── 详情延迟 ─── */
export const DETAIL_HEAVY_CONTENT_DELAY_MS = 180;
