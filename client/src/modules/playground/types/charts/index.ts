import { AreaChartConfig } from "./area-chart";
import { BarChartConfig } from "./bar-chart";
import { BaseChartConfig } from "./base-chart"
import { ScatterChartConfig } from "./scatter-chart";
import { TimeChartConfig } from "./time-chart";

export * from "./base-chart";
export * from "./time-chart";
export * from "./scatter-chart";
export * from "./area-chart";
export * from "./bar-chart";

export type FinalChartConfig = TimeChartConfig | ScatterChartConfig | AreaChartConfig | BarChartConfig | BaseChartConfig;

export type Chart = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
} & FinalChartConfig;