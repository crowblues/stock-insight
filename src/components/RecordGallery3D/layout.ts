import type { CardLayoutItem, CardFaceMode, CardVisualState, CardFaceRenderState, OverlayRect } from "./types";
import { DETAIL_PANEL_MAX_WIDTH, DETAIL_PANEL_MAX_HEIGHT, DETAIL_PANEL_WIDTH_RATIO, DETAIL_PANEL_HEIGHT_RATIO } from "./constants";

export const getCardVisualState = (item: CardLayoutItem, mode: CardFaceMode): CardVisualState => {
  const isActive = mode === "active";
  const isDetail = mode === "detail";

  return {
    y: item.y,
    z: item.z,
    width: item.width,
    height: isDetail ? 124 : item.height,
    scaleX: isDetail ? 1 : item.width / 560,
    tilt: isDetail ? 0 : item.tilt,
    roll: isDetail ? 0 : item.roll,
    zIndex: isDetail ? 300 : isActive ? 70 : Math.max(0, Math.round(item.motionSlot) + 1),
    opacity: item.opacity,
    radius: isDetail ? 12 : 7,
    borderWidth: isActive ? 1.5 : 1,
    borderOpacity: isActive ? 0.8 : 0.08,
    shadowStrength: isDetail ? 1.06 : 1,
    imageScale: isActive || isDetail ? 1 : 0.58,
    compactTitleOpacity: isDetail ? 0 : isActive ? 0.08 : 1,
    detailTitleOpacity: isDetail ? 1 : isActive ? 1 : 0,
    metaOpacity: isDetail ? 0.45 : isActive ? 0.45 : 0.45,
    descriptionOpacity: isActive || isDetail ? 1 : 0,
    hintOpacity: isActive ? 1 : isDetail ? 0 : 0,
  };
};

export const getCardFaceRenderState = (visual: CardVisualState): CardFaceRenderState => ({
  height: visual.height,
  radius: visual.radius,
  borderWidth: visual.borderWidth,
  borderColor: `rgba(255,255,255,${visual.borderOpacity})`,
  boxShadow: `0 ${18 * visual.shadowStrength}px ${46 * visual.shadowStrength}px rgba(0,0,0,0.36), 0 1px 0 rgba(255,255,255,0.14) inset`,
  imageScale: visual.imageScale,
  compactTitleOpacity: visual.compactTitleOpacity,
  detailTitleOpacity: visual.detailTitleOpacity,
  metaOpacity: visual.metaOpacity,
  descriptionOpacity: visual.descriptionOpacity,
  descriptionY: visual.descriptionOpacity > 0 ? 0 : -4,
  hintOpacity: visual.hintOpacity,
});

/** 计算展开面板目标尺寸（响应式） */
export const getDetailTargetRect = (): OverlayRect => {
  const isMobile = window.innerWidth < 768;
  const maxW = isMobile ? window.innerWidth * 0.94 : DETAIL_PANEL_MAX_WIDTH;
  const maxH = isMobile ? window.innerHeight * 0.82 : DETAIL_PANEL_MAX_HEIGHT;
  const widthRatio = isMobile ? 0.94 : DETAIL_PANEL_WIDTH_RATIO;
  const heightRatio = isMobile ? 0.82 : DETAIL_PANEL_HEIGHT_RATIO;

  const width = Math.min(maxW, window.innerWidth * widthRatio);
  const height = Math.min(maxH, window.innerHeight * heightRatio);

  return {
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
    width,
    height,
  };
};

/** 响应式堆叠宽度 */
export const getStackWidth = (): number => {
  const w = window.innerWidth;
  if (w < 480) return Math.min(340, w * 0.88);
  if (w < 768) return Math.min(440, w * 0.8);
  return Math.min(560, w * 0.72);
};

/** 响应式透视值（小屏减少变形） */
export const getPerspective = (): string => {
  const w = window.innerWidth;
  if (w < 480) return "420px";
  if (w < 768) return "480px";
  return "560px";
};
