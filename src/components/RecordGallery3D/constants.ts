/* 3D 堆叠布局参数 */
export const VISIBLE_COUNT = 10;
export const BASE_Y = -305;
export const ROW_STEP = 49;
export const BASE_WIDTH = 370;
export const WIDTH_STEP = 7;
export const HIT_Y_OFFSET_BY_SLOT = [56, 35, 17, 1, -9, -15, -16, -9, 5, 0];
export const HIT_HEIGHT_BY_SLOT = [25, 29, 33, 37, 42, 47, 54, 62, 72, 82];

/* 动画时间参数 */
export const SCROLL_TRANSITION_MS = 220;
export const ACTIVE_TRANSITION_MS = 220;
export const DETAIL_HEAVY_CONTENT_DELAY_MS = 180;

/* 交互阈值 */
export const WHEEL_STEP_SIZE = 115;
export const TOUCH_STEP_SIZE = 86;
export const MAX_WHEEL_STEP = 1;
export const MAX_TOUCH_STEP = 0.62;
export const CLICK_AFTER_SCROLL_DELAY_MS = 140;
export const CONFIRM_CLICK_DELAY_MS = 110;

/* 视觉参数 */
export const EDGE_FADE_WIDTH = 0.86;
export const MIN_CLICKABLE_OPACITY = 1.0;
export const FRONT_ACTIVE_START = VISIBLE_COUNT - 1.45;

/* 展开面板尺寸 */
export const DETAIL_PANEL_MAX_WIDTH = 680;
export const DETAIL_PANEL_MAX_HEIGHT = 500;
export const DETAIL_PANEL_WIDTH_RATIO = 0.76;
export const DETAIL_PANEL_HEIGHT_RATIO = 0.66;

/* 弹簧动画参数（一体化核心，勿改） */
export const SPRING_CONFIG = {
  type: "spring" as const,
  stiffness: 68,
  damping: 19,
  mass: 0.98,
};
