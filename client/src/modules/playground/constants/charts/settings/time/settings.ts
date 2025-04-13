import { TimeChartSettings, TimeTraceSettings } from "@/modules/playground/types";

export const TIME_CHART_TRACE_SETTING_OPTION_KEYS = {
  timeTraceDummy: "timeTraceDummy",
} as const;

export const TIME_CHART_SETTING_OPTION_KEYS = {
  timeSettingDummy: "timeSettingDummy",
} as const;

export const DEFAULT_TIME_CHART_TRACE_SETTINGS: TimeTraceSettings = {
  [TIME_CHART_TRACE_SETTING_OPTION_KEYS.timeTraceDummy]: true,
};

export const DEFAULT_TIME_CHART_SETTINGS: TimeChartSettings = {
  [TIME_CHART_SETTING_OPTION_KEYS.timeSettingDummy]: false,
};