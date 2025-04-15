import { BaseChartConfig } from "./base-chart";

export type ScatterChartSettings = {
};

export type ScatterTraceSettings = {
  markerWidth: number;
  markerType: string;
};

export type ScatterChartConfig = BaseChartConfig<ScatterChartSettings, ScatterTraceSettings>;
