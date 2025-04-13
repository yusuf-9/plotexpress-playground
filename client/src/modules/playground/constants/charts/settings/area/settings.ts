import { AreaChartSettings, AreaTraceSettings } from "@/modules/playground/types";

export const AREA_CHART_TRACE_SETTING_OPTION_KEYS = {
  areaTraceDummy: "areaTraceDummy",
} as const;

export const AREA_CHART_SETTING_OPTION_KEYS = {
  areaSettingDummy: "areaSettingDummy",
} as const;

export const DEFAULT_AREA_CHART_TRACE_SETTINGS: AreaTraceSettings = {
  [AREA_CHART_TRACE_SETTING_OPTION_KEYS.areaTraceDummy]: true,
};

export const DEFAULT_AREA_CHART_SETTINGS: AreaChartSettings = {
  [AREA_CHART_SETTING_OPTION_KEYS.areaSettingDummy]: false,
};
