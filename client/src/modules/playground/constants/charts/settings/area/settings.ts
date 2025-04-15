import { AreaChartSettings, AreaTraceSettings } from "@/modules/playground/types";

export const AREA_CHART_TRACE_SETTING_OPTION_KEYS = {
  traceWidth: "traceWidth",
  markerVisibility: "markerVisibility",
  markerWidth: "markerWidth",
  marketType: "marketType",
  fillOpacity: "fillOpacity",
} as const;

export const AREA_CHART_SETTING_OPTION_KEYS = {
} as const;

export const DEFAULT_AREA_CHART_TRACE_SETTINGS: AreaTraceSettings = {
  [AREA_CHART_TRACE_SETTING_OPTION_KEYS.traceWidth]: 1,
  [AREA_CHART_TRACE_SETTING_OPTION_KEYS.markerVisibility]: true,
  [AREA_CHART_TRACE_SETTING_OPTION_KEYS.markerWidth]: 1,
  [AREA_CHART_TRACE_SETTING_OPTION_KEYS.marketType]: "circle",
  [AREA_CHART_TRACE_SETTING_OPTION_KEYS.fillOpacity]: 0.5,
};

export const DEFAULT_AREA_CHART_SETTINGS: AreaChartSettings = {
};
