import { BG_COLOR_CLASSES } from "../constants/colors";

export function getColorBgClass(color: string, opacity: number) {
  const colorBgClasses = BG_COLOR_CLASSES.find(bgClass => bgClass[0].includes(color));
  if (!colorBgClasses) return null;

  // Opacity should be between 0-100, map to array index 0-10
  const opacityIndex = Math.min(Math.floor(opacity / 10), 10);
  return colorBgClasses[opacityIndex];
}
export function getHexColorOfOpacity(hexColor: string, opacity: number): string {
  // Ensure hexColor starts with #
  if (!/^#([0-9A-Fa-f]{6})$/.test(hexColor)) {
    return '';
  }

  if (opacity < 0 || opacity > 1) {
    return '';
  }

  const alpha = Math.round(opacity * 255);
  const alphaHex = alpha.toString(16).padStart(2, '0').toUpperCase();

  return hexColor + alphaHex;
}

