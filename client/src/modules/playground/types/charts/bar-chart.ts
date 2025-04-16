import { BaseChartConfig } from "./base-chart";

export type BarChartSettings = {
};

export type BarTraceSettings = {
  binWidth: number;
};

export type BarChartConfig = BaseChartConfig<BarChartSettings, BarTraceSettings>;
