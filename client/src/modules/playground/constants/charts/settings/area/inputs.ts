import { AREA_CHART_SETTING_OPTION_KEYS, AREA_CHART_TRACE_SETTING_OPTION_KEYS } from "./settings";

export const DEFAULT_AREA_CHART_TRACE_SETTINGS_INPUT_CONFIG = [
  {
    id: AREA_CHART_TRACE_SETTING_OPTION_KEYS.areaTraceDummy,
    label: "Area trace",
    inputType: "switch",
    placeholder: "Area trace",
  },
];

export const DEFAULT_AREA_CHART_GENERAL_SETTINGS_INPUT_CONFIG = [
  {
    id: AREA_CHART_SETTING_OPTION_KEYS.areaSettingDummy,
    label: "Trace width",
    inputType: "slider",
    placeholder: "trace width",
  },
];

export const DEFAULT_AREA_CHART_AXIS_SETTINGS_INPUT_CONFIG = {
  x: [],
  y: [],
};