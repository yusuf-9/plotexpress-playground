import { BaseChartConfig } from "./base-chart";

export type ScatterChartSettings = {
  scatterSettingDummy: boolean;
};

export type ScatterTraceSettings = {
  scatterTraceDummy: boolean;
};

export type ScatterChartConfig = BaseChartConfig<ScatterChartSettings, ScatterTraceSettings>;
