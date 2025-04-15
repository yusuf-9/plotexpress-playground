import { BaseChartConfig } from "./base-chart";

export type TimeChartSettings = {
};

export type TimeTraceSettings = {
  traceWidth: number;
  markerVisibility: boolean;
  markerWidth: number;
  markerType: string;
};

export type TimeChartConfig = BaseChartConfig<TimeChartSettings, TimeTraceSettings>;