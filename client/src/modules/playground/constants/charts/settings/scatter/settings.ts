import { ScatterChartSettings, ScatterTraceSettings } from "@/modules/playground/types";

export const SCATTER_CHART_TRACE_SETTING_OPTION_KEYS = {
  scatterTraceDummy: "scatterTraceDummy",
} as const;

export const SCATTER_CHART_SETTING_OPTION_KEYS = {
  scatterSettingDummy: "scatterSettingDummy",
} as const;

export const DEFAULT_SCATTER_CHART_TRACE_SETTINGS: ScatterTraceSettings = {
  [SCATTER_CHART_TRACE_SETTING_OPTION_KEYS.scatterTraceDummy]: true,
};

export const DEFAULT_SCATTER_CHART_SETTINGS: ScatterChartSettings = {
  [SCATTER_CHART_SETTING_OPTION_KEYS.scatterSettingDummy]: false,
};
