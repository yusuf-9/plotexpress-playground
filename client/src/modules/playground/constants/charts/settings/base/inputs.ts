import { DEFAULT_SERIES_SETTING_OPTION_KEYS } from "./settings";
import { DEFAULT_CHART_SETTINGS_OPTION_KEYS } from "./settings";

export const DEFAULT_CHART_GENERAL_SETTINGS_INPUT_CONFIG = [
  {
    id: DEFAULT_CHART_SETTINGS_OPTION_KEYS.title,
    label: "Chart title",
    inputType: "text",
    placeholder: "Enter chart title",
  },
  {
    id: DEFAULT_CHART_SETTINGS_OPTION_KEYS.titleVisibility,
    label: "Show chart title",
    inputType: "switch",
    placeholder: "Show chart title",
  },
  {
    id: DEFAULT_CHART_SETTINGS_OPTION_KEYS.legendVisibility,
    label: "Show legend",
    inputType: "switch",
    placeholder: "Show legend",
  },
];

export const DEFAULT_CHART_AXIS_SETTINGS_INPUT_CONFIG = {
  x: [
    {
      id: DEFAULT_CHART_SETTINGS_OPTION_KEYS.xAxisLabel,
      label: "X axis label",
      inputType: "text",
      placeholder: "Enter x axis label",
    },
    {
      id: DEFAULT_CHART_SETTINGS_OPTION_KEYS.xAxisLimits,
      label: "X axis limits",
      inputType: "min/max",
      placeholderMin: "Enter x axis min",
      placeholderMax: "Enter x axis max",
    },
  ],
  y: [
    {
      id: DEFAULT_CHART_SETTINGS_OPTION_KEYS.yAxisLabel,
      label: "Y axis label",
      inputType: "text",
      placeholder: "Enter y axis label",
    },
    {
      id: DEFAULT_CHART_SETTINGS_OPTION_KEYS.yAxisLimits,
      label: "Y axis limits",
      inputType: "min/max",
      placeholderMin: "Enter y axis min",
      placeholderMax: "Enter y axis max",
    },
  ],
};

export const DEFAULT_CHART_TRACE_SETTINGS_INPUT_CONFIG = [
  {
    id: DEFAULT_SERIES_SETTING_OPTION_KEYS.color,
    label: "Series color",
    inputType: "color",
    placeholder: "Enter series color",
  },
  {
    id: DEFAULT_SERIES_SETTING_OPTION_KEYS.visibility,
    label: "Series Visibility",
    inputType: "switch",
    placeholder: "Enter series name",
  },
  {
    id: DEFAULT_SERIES_SETTING_OPTION_KEYS.opacity,
    label: "Series opacity",
    inputType: "slider",
    placeholder: "Series opacity",
    inputProps: {
      min: 1,
      max: 10,
      step: 1,
    },
  },
];

