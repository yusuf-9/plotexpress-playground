import { BarChartSettings, BarTraceSettings } from "@/modules/playground/types";

export const BAR_CHART_TRACE_SETTING_OPTION_KEYS = {
  barTraceDummy: "barTraceDummy",
} as const;

export const BAR_CHART_SETTING_OPTION_KEYS = {
  barSettingDummy: "barSettingDummy",
} as const;

export const DEFAULT_BAR_CHART_TRACE_SETTINGS: BarTraceSettings = {
  [BAR_CHART_TRACE_SETTING_OPTION_KEYS.barTraceDummy]: true,
};

export const DEFAULT_BAR_CHART_SETTINGS: BarChartSettings = {
  [BAR_CHART_SETTING_OPTION_KEYS.barSettingDummy]: false,
};
