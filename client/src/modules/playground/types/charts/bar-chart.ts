import { BaseChartConfig } from "./base-chart";

export type BarChartSettings = {
  barSettingDummy: boolean;
};

export type BarTraceSettings = {
  barTraceDummy: boolean;
};

export type BarChartConfig = BaseChartConfig<BarChartSettings, BarTraceSettings>;
