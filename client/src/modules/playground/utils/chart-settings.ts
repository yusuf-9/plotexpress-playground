import {
  CHART_TYPES,
  DEFAULT_CHART_SETTINGS,
  DEFAULT_CHART_SETTINGS_MAP,
  DEFAULT_SERIES_SETTINGS,
  DEFAULT_SERIES_SETTINGS_MAP,
} from "../constants/charts";

export function getDefaultChartSettings(chartType: string) {
  switch (chartType) {
    case CHART_TYPES.LINE:
      return DEFAULT_CHART_SETTINGS_MAP[chartType];
    case CHART_TYPES.SCATTER:
      return DEFAULT_CHART_SETTINGS_MAP[chartType];
    case CHART_TYPES.BAR:
      return DEFAULT_CHART_SETTINGS_MAP[chartType];
    case CHART_TYPES.AREA:
      return DEFAULT_CHART_SETTINGS_MAP[chartType];
    default:
      return DEFAULT_CHART_SETTINGS;
  }
}

export function getDefaultTraceSettings(chartType: string) {
  switch (chartType) {
    case CHART_TYPES.LINE:
      return DEFAULT_SERIES_SETTINGS_MAP[chartType];
    case CHART_TYPES.SCATTER:
      return DEFAULT_SERIES_SETTINGS_MAP[chartType];
    case CHART_TYPES.BAR:
      return DEFAULT_SERIES_SETTINGS_MAP[chartType];
    case CHART_TYPES.AREA:
      return DEFAULT_SERIES_SETTINGS_MAP[chartType];
    default:
      return DEFAULT_SERIES_SETTINGS;
  }
}
