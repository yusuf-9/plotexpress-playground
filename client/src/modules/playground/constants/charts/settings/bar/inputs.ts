import { BAR_CHART_SETTING_OPTION_KEYS, BAR_CHART_TRACE_SETTING_OPTION_KEYS } from "./settings";

export const DEFAULT_BAR_CHART_TRACE_SETTINGS_INPUT_CONFIG = [
  {
    id: BAR_CHART_TRACE_SETTING_OPTION_KEYS.barTraceDummy,
    label: "Bar trace",
    inputType: "switch",
    placeholder: "Bar trace",
  },
];

export const DEFAULT_BAR_CHART_GENERAL_SETTINGS_INPUT_CONFIG = [
  {
    id: BAR_CHART_SETTING_OPTION_KEYS.barSettingDummy,
    label: "Trace width",
    inputType: "slider",
    placeholder: "trace width",
  },
];

export const DEFAULT_BAR_CHART_AXIS_SETTINGS_INPUT_CONFIG = {
  x: [],
  y: [],
};
