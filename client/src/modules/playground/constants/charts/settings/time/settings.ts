import { TimeChartSettings, TimeTraceSettings } from "@/modules/playground/types";

export const TIME_CHART_TRACE_SETTING_OPTION_KEYS = {
  traceWidth: "traceWidth",
  markerVisibility: "markerVisibility",
  markerWidth: "markerWidth",
  markerType: "markerType",
} as const;

export const TIME_CHART_SETTING_OPTION_KEYS = {
} as const;

export const DEFAULT_TIME_CHART_TRACE_SETTINGS: TimeTraceSettings = {
  [TIME_CHART_TRACE_SETTING_OPTION_KEYS.traceWidth]: 1,
  [TIME_CHART_TRACE_SETTING_OPTION_KEYS.markerVisibility]: true,
  [TIME_CHART_TRACE_SETTING_OPTION_KEYS.markerWidth]: 1,
  [TIME_CHART_TRACE_SETTING_OPTION_KEYS.markerType]: "circle",
};

export const DEFAULT_TIME_CHART_SETTINGS: TimeChartSettings = {
};