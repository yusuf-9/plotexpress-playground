import { BarChartSettings, BarTraceSettings } from "@/modules/playground/types";

export const BAR_CHART_TRACE_SETTING_OPTION_KEYS = {
  binWidth: "binWidth",
} as const;

export const BAR_CHART_SETTING_OPTION_KEYS = {
} as const;

export const DEFAULT_BAR_CHART_TRACE_SETTINGS: BarTraceSettings = {
  [BAR_CHART_TRACE_SETTING_OPTION_KEYS.binWidth]: 55,
};

export const DEFAULT_BAR_CHART_SETTINGS: BarChartSettings = {
};
