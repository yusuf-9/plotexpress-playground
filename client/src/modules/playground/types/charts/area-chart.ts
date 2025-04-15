import { BaseChartConfig } from "./base-chart";

export type AreaChartSettings = {
};

export type AreaTraceSettings = {
  traceWidth: number;
  markerVisibility: boolean;
  markerWidth: number;
  marketType: string;
  fillOpacity: number;
};

export type AreaChartConfig = BaseChartConfig<AreaChartSettings, AreaTraceSettings>;

