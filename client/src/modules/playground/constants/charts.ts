import { ChartTypes } from "../types";

export const CHART_TYPES = Object.freeze({
  LINE: "line",
  SCATTER: "scatter",
  BAR: "bar",
  AREA: "area",
  // HISTOGRAM: "histogram",
  // PIE: "pie",
  // RADAR: "radar",
  // FLOW: "flow",
  // TREND: "trend",

});

export const CHART_TRACE_CONSTRAINTS_MAP: {
  [key in ChartTypes]: {
    xRequired: boolean;
    yRequired: boolean;
  };
} = {
  // Known charts
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
