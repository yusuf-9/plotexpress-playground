import { ChartTypes } from "@/modules/playground/types";
import { CHART_TYPES } from "../types";

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
