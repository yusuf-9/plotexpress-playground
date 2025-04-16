import { AREA_CHART_TRACE_SETTING_OPTION_KEYS } from "./settings";

export const DEFAULT_AREA_CHART_TRACE_SETTINGS_INPUT_CONFIG = [
  {
    id: AREA_CHART_TRACE_SETTING_OPTION_KEYS.traceWidth,
    label: "Trace width",
    inputType: "slider",
    placeholder: "trace width",
    inputProps: {
      min: 0,
      max: 5,
      step: 1
    }
  },
  {
    id: AREA_CHART_TRACE_SETTING_OPTION_KEYS.markerVisibility,
    label: "Marker visibility",
    inputType: "switch",
    placeholder: "marker visibility"
  },
  {
    id: AREA_CHART_TRACE_SETTING_OPTION_KEYS.markerWidth,
    label: "Marker width",
    inputType: "slider",
    placeholder: "marker width",
    inputProps: {
      min: 0,
      max: 10,
      step: 1
    }
  },
  {
    id: AREA_CHART_TRACE_SETTING_OPTION_KEYS.markerType,
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
  {
    id: AREA_CHART_TRACE_SETTING_OPTION_KEYS.fillOpacity,
    label: "Fill opacity",
    inputType: "slider",
    placeholder: "fill opacity",
    inputProps: {
      min: 1,
      max: 10,
      step: 1
    }
  }
];

export const DEFAULT_AREA_CHART_GENERAL_SETTINGS_INPUT_CONFIG = [];

export const DEFAULT_AREA_CHART_AXIS_SETTINGS_INPUT_CONFIG = {
  x: [],
  y: []
};
