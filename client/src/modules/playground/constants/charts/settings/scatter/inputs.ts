import { SCATTER_CHART_TRACE_SETTING_OPTION_KEYS } from "./settings";

export const DEFAULT_SCATTER_CHART_TRACE_SETTINGS_INPUT_CONFIG = [
  {
    id: SCATTER_CHART_TRACE_SETTING_OPTION_KEYS.markerWidth,
    label: "Marker Width",
    inputType: "slider",
    placeholder: "marker width",
    inputProps: {
      min: 0,
      max: 10,
      step: 1
    },
  },
  {
    id: SCATTER_CHART_TRACE_SETTING_OPTION_KEYS.markerType,
    label: "Marker Type",
    inputType: "select",
    placeholder: "marker type",
    options: [
      {
        label: "Circle",
        value: "circle",
      },
      {
        label: "Square",
        value: "square",
      },
      {
        label: "Triangle",
        value: "triangle",
      },

      {
        label: "Diamond",
        value: "diamond",
      },
      {
        label: "Pin",
        value: "pin",
      },
      {
        label: "Arrow",
        value: "arrow",
      },
    ],
  },
];

export const DEFAULT_SCATTER_CHART_GENERAL_SETTINGS_INPUT_CONFIG = [
];

export const DEFAULT_SCATTER_CHART_AXIS_SETTINGS_INPUT_CONFIG = {
  x: [],
  y: [],
};
