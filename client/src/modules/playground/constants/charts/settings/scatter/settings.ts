import { ScatterChartSettings, ScatterTraceSettings } from "@/modules/playground/types";

export const SCATTER_CHART_TRACE_SETTING_OPTION_KEYS = {
  markerWidth: "markerWidth",
  markerType: "markerType",
} as const;

export const SCATTER_CHART_SETTING_OPTION_KEYS = {
} as const;

export const DEFAULT_SCATTER_CHART_TRACE_SETTINGS: ScatterTraceSettings = {
  [SCATTER_CHART_TRACE_SETTING_OPTION_KEYS.markerWidth]: 10,
  [SCATTER_CHART_TRACE_SETTING_OPTION_KEYS.markerType]: "circle",
};

export const DEFAULT_SCATTER_CHART_SETTINGS: ScatterChartSettings = {
};
