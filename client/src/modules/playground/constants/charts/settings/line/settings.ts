import { LineChartSettings, LineTraceSettings } from "@/modules/playground/types";

export const LINE_CHART_TRACE_SETTING_OPTION_KEYS = {
  traceWidth: "traceWidth",
  markerVisibility: "markerVisibility",
  markerWidth: "markerWidth",
  markerType: "markerType",
} as const;

export const Line_CHART_SETTING_OPTION_KEYS = {
} as const;

export const DEFAULT_LINE_CHART_TRACE_SETTINGS: LineTraceSettings = {
  [LINE_CHART_TRACE_SETTING_OPTION_KEYS.traceWidth]: 1,
  [LINE_CHART_TRACE_SETTING_OPTION_KEYS.markerVisibility]: false,
  [LINE_CHART_TRACE_SETTING_OPTION_KEYS.markerWidth]: 1,
  [LINE_CHART_TRACE_SETTING_OPTION_KEYS.markerType]: "circle",
};

export const DEFAULT_LINE_CHART_SETTINGS: LineChartSettings = {
};