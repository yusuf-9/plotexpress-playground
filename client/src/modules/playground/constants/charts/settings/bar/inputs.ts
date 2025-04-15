import { BAR_CHART_TRACE_SETTING_OPTION_KEYS } from "./settings";

export const DEFAULT_BAR_CHART_TRACE_SETTINGS_INPUT_CONFIG = [
  {
    id: BAR_CHART_TRACE_SETTING_OPTION_KEYS.binWidth,
    label: "Bin Width",
    inputType: "slider",
    placeholder: "Bin Width",
    inputProps: {
      min: 0,
      max: 5,
      step: 1
    },
  },
];

export const DEFAULT_BAR_CHART_GENERAL_SETTINGS_INPUT_CONFIG = [
];

export const DEFAULT_BAR_CHART_AXIS_SETTINGS_INPUT_CONFIG = {
  x: [],
  y: [],
};
