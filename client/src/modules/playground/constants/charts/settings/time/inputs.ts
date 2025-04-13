import { TIME_CHART_SETTING_OPTION_KEYS, TIME_CHART_TRACE_SETTING_OPTION_KEYS } from "./settings";

export const DEFAULT_TIME_CHART_TRACE_SETTINGS_INPUT_CONFIG = [
  {
    id: TIME_CHART_TRACE_SETTING_OPTION_KEYS.timeTraceDummy,
    label: "Trace width",
    inputType: "switch",
    placeholder: "trace width",
  },
];

export const DEFAULT_TIME_CHART_GENERAL_SETTINGS_INPUT_CONFIG = [
  {
    id: TIME_CHART_SETTING_OPTION_KEYS.timeSettingDummy,
    label: "Trace width",
    inputType: "switch",
    placeholder: "trace width",
  },
];

export const DEFAULT_TIME_CHART_AXIS_SETTINGS_INPUT_CONFIG = {
  x: [],
  y: [],
};
