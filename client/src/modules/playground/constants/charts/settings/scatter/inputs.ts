import { SCATTER_CHART_SETTING_OPTION_KEYS, SCATTER_CHART_TRACE_SETTING_OPTION_KEYS } from "./settings";

export const DEFAULT_SCATTER_CHART_TRACE_SETTINGS_INPUT_CONFIG = [
  {
    id: SCATTER_CHART_TRACE_SETTING_OPTION_KEYS.scatterTraceDummy,
    label: "Scatter trace",
    inputType: "switch",
    placeholder: "Scatter trace",
  },
];

export const DEFAULT_SCATTER_CHART_GENERAL_SETTINGS_INPUT_CONFIG = [
  {
    id: SCATTER_CHART_SETTING_OPTION_KEYS.scatterSettingDummy,
    label: "Trace width",
    inputType: "slider",
    placeholder: "trace width",
  },
];

export const DEFAULT_SCATTER_CHART_AXIS_SETTINGS_INPUT_CONFIG = {
  x: [],
  y: [],
};
