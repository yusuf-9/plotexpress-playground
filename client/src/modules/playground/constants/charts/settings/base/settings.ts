import { BaseTraceConfig } from "@/modules/playground/types";
import { BaseChartSettings } from "@/modules/playground/types";

export const DEFAULT_CHART_SETTINGS_OPTION_KEYS = {
  title: "title",
  titleVisibility: "titleVisibility",
  legendVisibility: "legendVisibility",
  legendPosition: "legendPosition",
  xAxisLabel: "xAxisLabel",
  xAxisLimits: "xAxisLimits",
  yAxisLabel: "yAxisLabel",
  yAxisLimits: "yAxisLimits",
} as const;

export const DEFAULT_CHART_SETTINGS: BaseChartSettings = {
  [DEFAULT_CHART_SETTINGS_OPTION_KEYS.title]: "",
  [DEFAULT_CHART_SETTINGS_OPTION_KEYS.titleVisibility]: true,
  [DEFAULT_CHART_SETTINGS_OPTION_KEYS.legendVisibility]: true,
  [DEFAULT_CHART_SETTINGS_OPTION_KEYS.legendPosition]: "bottom",
  [DEFAULT_CHART_SETTINGS_OPTION_KEYS.xAxisLabel]: "",
  [DEFAULT_CHART_SETTINGS_OPTION_KEYS.xAxisLimits]: {
    min: "",
    max: "",
  },
  [DEFAULT_CHART_SETTINGS_OPTION_KEYS.yAxisLabel]: "",
  [DEFAULT_CHART_SETTINGS_OPTION_KEYS.yAxisLimits]: {
    min: "",
    max: "",
  },
};

export const DEFAULT_SERIES_SETTING_OPTION_KEYS = {
  color: "color",
  visibility: "visibility",
  opacity: "opacity",
} as const;

export const DEFAULT_SERIES_SETTINGS: Omit<BaseTraceConfig["settings"], "name"> = {
  [DEFAULT_SERIES_SETTING_OPTION_KEYS.color]: "#000000",
  [DEFAULT_SERIES_SETTING_OPTION_KEYS.visibility]: true,
  [DEFAULT_SERIES_SETTING_OPTION_KEYS.opacity]: 10,
};
