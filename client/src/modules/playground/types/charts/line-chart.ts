import { BaseChartConfig } from "./base-chart";

export type LineChartSettings = {
};

export type LineTraceSettings = {
  traceWidth: number;
  markerVisibility: boolean;
  markerWidth: number;
  markerType: string;
};

export type LineChartConfig = BaseChartConfig<LineChartSettings, LineTraceSettings>;