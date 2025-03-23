import { BG_COLOR_CLASSES } from "../constants/colors";

export function getColorBgClass(color: string, opacity: number) {
  const colorBgClasses = BG_COLOR_CLASSES.find(bgClass => bgClass[0].includes(color));
  if (!colorBgClasses) return null;

  // Opacity should be between 0-100, map to array index 0-10
  const opacityIndex = Math.min(Math.floor(opacity / 10), 10);
  return colorBgClasses[opacityIndex];
}
