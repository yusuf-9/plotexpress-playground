import { DEFAULT_CHART_SETTINGS_OPTION_KEYS, DEFAULT_SERIES_SETTING_OPTION_KEYS } from "@/modules/playground/constants/charts";

export const SETTING_CATEGORIES = {
  GENERAL: {
    title: "General settings",
    value: "general-settings",
  },
  AXIS: {
    title: "Axis settings",
    value: "axis-settings",
  },
  SERIES: {
    title: "Series settings",
    value: "series-settings",
  },
  TOOLTIP: {
    title: "Tooltip settings",
    value: "tooltip-settings",
  },
};

export const DEFAULT_GENERAL_SETTING_OPTIONS = [
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
  {
    id: DEFAULT_CHART_SETTINGS_OPTION_KEYS.legendPosition,
    label: "Legend position",
    inputType: "select",
    placeholder: "Select legend position",
    options: [
      {
        label: "Top",
        value: "top",
      },
      {
        label: "Bottom",
        value: "bottom",
      },
    ],
  },
];

export const DEFAULT_AXIS_SETTING_OPTIONS = {
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

export const DEFAULT_SERIES_SETTING_OPTIONS = [
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
    inputType: "number",
    placeholder: "Enter series opacity",
    inputProps: {
      min: 0,
      max: 1,
      step: 0.1
    }
  },
];
