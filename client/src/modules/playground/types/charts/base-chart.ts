import { CHART_TYPES } from "@/modules/playground/constants/charts";

export type ChartTypes = (typeof CHART_TYPES)[keyof typeof CHART_TYPES];

export type AxisTypes = "x" | "y";

export type AxisConfig = {
  fileId: string;
  column: string;
};

// Combine AtLeastOneAxis with the settings property
export type BaseTraceConfig<SpecificTraceSettings = object> = {
  x?: AxisConfig;
  y?: AxisConfig;
  settings: {
    color: string;
    name: string;
    opacity: number;
    visibility: boolean;
  } & SpecificTraceSettings;
  id: string;
};

export type BaseChartSettings = {
  title: string;
  titleVisibility: boolean;
  legendVisibility: boolean;
  legendPosition: "top" | "bottom";
  xAxisLabel: string;
  xAxisLimits: {
    min: string;
    max: string;
  };
  yAxisLabel: string;
  yAxisLimits: {
    min: string;
    max: string;
  };
};

export type BaseChartConfig<SpecificChartSettings = object, SpecificTraceSettings = object> = {
  type: ChartTypes;
  tracesConfig: Array<BaseTraceConfig<SpecificTraceSettings>>;
  chartSettings: BaseChartSettings & SpecificChartSettings;
};
