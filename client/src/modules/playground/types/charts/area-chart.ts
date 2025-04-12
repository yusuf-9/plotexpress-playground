import { BaseChartConfig } from "./base-chart";

export type AreaChartSettings = {
  areaSettingDummy: boolean;
};

export type AreaTraceSettings = {
  areaTraceDummy: boolean;
};

export type AreaChartConfig = BaseChartConfig<AreaChartSettings, AreaTraceSettings>;

