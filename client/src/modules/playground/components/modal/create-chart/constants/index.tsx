import { CHART_TYPES } from "@/modules/playground/constants/charts";
import { BarChart3, LineChart, ScatterChart, AreaChart } from "lucide-react";

export const chartTypes = [
  { icon: BarChart3, label: "Bar", key: CHART_TYPES.BAR },
  { icon: LineChart, label: "Line", key: CHART_TYPES.LINE },
  { icon: ScatterChart, label: "Scatter", key: CHART_TYPES.SCATTER },
  { icon: AreaChart, label: "Area", key: CHART_TYPES.AREA },
];

export const STEPS = {
  CHART_TYPE_SELECT: { label: "Choose Chart Type", value: 1 },
  DATA_SELECT: { label: "Select Data Source", value: 2 },
  CUSTOMIZATION: { label: "Customize", value: 3 },
};
