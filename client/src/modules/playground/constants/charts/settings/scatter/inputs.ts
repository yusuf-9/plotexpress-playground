import { SCATTER_CHART_TRACE_SETTING_OPTION_KEYS } from "./settings";

export const DEFAULT_SCATTER_CHART_TRACE_SETTINGS_INPUT_CONFIG = [
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
    ],
  },
  {
    id: SCATTER_CHART_TRACE_SETTING_OPTION_KEYS.markerWidth,
    label: "Marker Width",
    inputType: "slider",
    placeholder: "marker width",
    inputProps: {
      min: 0,
      max: 5,
      step: 1
    },
  },
];

export const DEFAULT_SCATTER_CHART_GENERAL_SETTINGS_INPUT_CONFIG = [
];

export const DEFAULT_SCATTER_CHART_AXIS_SETTINGS_INPUT_CONFIG = {
  x: [],
  y: [],
};
