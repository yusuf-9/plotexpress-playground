import {
  AreaChartConfig,
  BarChartConfig,
  BaseChartSettings,
  BaseTraceConfig,
  ChartTypes,
  ScatterChartConfig,
  ScatterTraceSettings,
  BarTraceSettings,
  AreaTraceSettings,
  TimeChartConfig,
  TimeTraceSettings,
} from "../types";

export const CHART_TYPES = Object.freeze({
  LINE: "line",
  SCATTER: "scatter",
  BAR: "bar",
  AREA: "area",
});

export const CHART_TRACE_CONSTRAINTS_MAP: {
  [key in ChartTypes]: {
    xRequired: boolean;
    yRequired: boolean;
  };
} = {
  [CHART_TYPES.LINE]: {
    xRequired: true,
    yRequired: true,
  },
  [CHART_TYPES.SCATTER]: {
    xRequired: true,
    yRequired: true,
  },
  [CHART_TYPES.BAR]: {
    xRequired: true,
    yRequired: true,
  },
  [CHART_TYPES.AREA]: {
    xRequired: true,
    yRequired: true,
  },
};

export const DEFAULT_CHART_SETTINGS_OPTION_KEYS = {
  title: "title",
  titleVisibility: "titleVisibility",
  legendVisibility: "legendVisibility",
  legendPosition: "legendPosition",
  xAxisLabel: "xAxisLabel",
  xAxisLimits: "xAxisLimits",
  yAxisLabel: "yAxisLabel",
  yAxisLimits: "yAxisLimits",
} as const;

export const DEFAULT_CHART_SETTINGS: BaseChartSettings = {
  [DEFAULT_CHART_SETTINGS_OPTION_KEYS.title]: "",
  [DEFAULT_CHART_SETTINGS_OPTION_KEYS.titleVisibility]: true,
  [DEFAULT_CHART_SETTINGS_OPTION_KEYS.legendVisibility]: true,
  [DEFAULT_CHART_SETTINGS_OPTION_KEYS.legendPosition]: "top",
  [DEFAULT_CHART_SETTINGS_OPTION_KEYS.xAxisLabel]: "",
  [DEFAULT_CHART_SETTINGS_OPTION_KEYS.xAxisLimits]: {
    min: "",
    max: "",
  },
  [DEFAULT_CHART_SETTINGS_OPTION_KEYS.yAxisLabel]: "",
  [DEFAULT_CHART_SETTINGS_OPTION_KEYS.yAxisLimits]: {
    min: "",
    max: "",
  },
};

export const DEFAULT_CHART_SETTINGS_MAP = {
  [CHART_TYPES.LINE]: { ...DEFAULT_CHART_SETTINGS, timeSettingDummy: false } as TimeChartConfig["chartSettings"],
  [CHART_TYPES.SCATTER]: {
    ...DEFAULT_CHART_SETTINGS,
    scatterSettingDummy: false,
  } as ScatterChartConfig["chartSettings"],
  [CHART_TYPES.BAR]: { ...DEFAULT_CHART_SETTINGS, barSettingDummy: false } as BarChartConfig["chartSettings"],
  [CHART_TYPES.AREA]: { ...DEFAULT_CHART_SETTINGS, areaSettingDummy: false } as AreaChartConfig["chartSettings"],
};

export const DEFAULT_SERIES_SETTING_OPTION_KEYS = {
  color: "color",
  visibility: "visibility",
  opacity: "opacity",
} as const;

export const DEFAULT_SERIES_SETTINGS: Omit<BaseTraceConfig["settings"], "name"> = {
  [DEFAULT_SERIES_SETTING_OPTION_KEYS.color]: "#000000",
  [DEFAULT_SERIES_SETTING_OPTION_KEYS.visibility]: true,
  [DEFAULT_SERIES_SETTING_OPTION_KEYS.opacity]: "1",
};

export const DEFAULT_SERIES_SETTINGS_MAP = {
  [CHART_TYPES.LINE]: {
    ...DEFAULT_SERIES_SETTINGS,
    timeTraceDummy: true,
  } as Omit<BaseTraceConfig<TimeTraceSettings>["settings"], "name">,
  [CHART_TYPES.SCATTER]: { ...DEFAULT_SERIES_SETTINGS } as Omit<BaseTraceConfig<ScatterTraceSettings>["settings"], "name">,
  [CHART_TYPES.BAR]: { ...DEFAULT_SERIES_SETTINGS } as Omit<BaseTraceConfig<BarTraceSettings>["settings"], "name">,
  [CHART_TYPES.AREA]: { ...DEFAULT_SERIES_SETTINGS } as Omit<BaseTraceConfig<AreaTraceSettings>["settings"], "name">,
};
