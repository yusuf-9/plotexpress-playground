import { TIME_CHART_TRACE_SETTING_OPTION_KEYS } from "./settings";

export const DEFAULT_TIME_CHART_TRACE_SETTINGS_INPUT_CONFIG = [
  {
    id: TIME_CHART_TRACE_SETTING_OPTION_KEYS.traceWidth,
    label: "Trace width",
    inputType: "slider",
    placeholder: "trace width",
    inputProps: {
      min: 0,
      max: 5,
      step: 1
    },
  },
  {
    id: TIME_CHART_TRACE_SETTING_OPTION_KEYS.markerVisibility,
    label: "Marker visibility",
    inputType: "switch",
    placeholder: "marker visibility",
  },
  {
    id: TIME_CHART_TRACE_SETTING_OPTION_KEYS.markerWidth,
    label: "Marker width",
    inputType: "slider",
    placeholder: "marker width",
    inputProps: {
      min: 0,
      max: 5,
      step: 1
    },
  },
  {
    id: TIME_CHART_TRACE_SETTING_OPTION_KEYS.markerType,
    label: "Marker type",
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
];

export const DEFAULT_TIME_CHART_GENERAL_SETTINGS_INPUT_CONFIG = [
];

export const DEFAULT_TIME_CHART_AXIS_SETTINGS_INPUT_CONFIG = {
  x: [],
  y: [],
};
