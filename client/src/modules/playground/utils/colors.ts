import { BG_COLOR_CLASSES } from "../constants/colors";

export function getColorBgClass(color: string, opacity: number) {
  const colorBgClasses = BG_COLOR_CLASSES.find(bgClass => bgClass[0].includes(color));
  if (!colorBgClasses) {
    return createColorOpacityClass(color, opacity)
  };

  // Opacity should be between 0-100, map to array index 0-10
  const opacityIndex = Math.min(Math.floor(opacity / 10), 10);
  return colorBgClasses[opacityIndex];
}
export function createColorOpacityClass(hexColor: string, opacity: number): string {
  // Validate hex color format and opacity range
  if (!/^#([0-9A-Fa-f]{6})$/.test(hexColor) || opacity < 0 || opacity > 100) {
    return "";
  }

  const className = `bg-[${hexColor}]/${opacity}`;
  const escapedClassName = className.replace(/[[\]#]/g, '\\$&').replace(/\//g, '\\/');

  // Create style element if it doesn't exist
  let styleSheet = document.getElementById("dynamic-bg-styles") as HTMLStyleElement;
  if (!styleSheet) {
    styleSheet = document.createElement("style");
    styleSheet.id = "dynamic-bg-styles";
    styleSheet.type = "text/css"
    document.head.appendChild(styleSheet);
  }

  // Add the class if it doesn't exist
  if (!styleSheet.textContent?.includes(escapedClassName)) {
    const rgbaColor = `rgba(${parseInt(hexColor.slice(1,3), 16)}, ${parseInt(hexColor.slice(3,5), 16)}, ${parseInt(hexColor.slice(5,7), 16)}, ${opacity/100})`;
    const rule = `.${escapedClassName} { background-color: ${rgbaColor}; }`;
    styleSheet.textContent += rule;
  }

  return className;
}


export function getHexColorOfOpacity(hexColor: string, opacity: number): string {
  // Ensure hexColor starts with #
  if (!/^#([0-9A-Fa-f]{6})$/.test(hexColor)) {
    return "";
  }

  if (opacity < 0 || opacity > 1) {
    return "";
  }

  const alpha = Math.round(opacity * 255);
  const alphaHex = alpha.toString(16).padStart(2, "0").toUpperCase();

  return hexColor + alphaHex;
}
