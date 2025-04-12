import { BaseChartConfig } from "./base-chart";

export type TimeChartSettings = {
  timeSettingDummy: boolean;
};

export type TimeTraceSettings = {
  timeTraceDummy: boolean;
};

export type TimeChartConfig = BaseChartConfig<TimeChartSettings, TimeTraceSettings>;