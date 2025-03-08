import { CHART_TYPES } from "@/modules/playground/constants/charts";

export type ParsedDataObject = {
  [key: string]: any;
};

export type ParsedData = ParsedDataObject[];

export type FileData = {
  [fileUUID: string]: {
    name: string;
    data: ParsedData;
  };
};

export type IndexedDBCachedFile = {
  id: string;
  name: string;
  data: ParsedData;
  lastUpdated: string
}

export type IndexedDBCachedChart = {
  id: string;
  lastUpdated: string
} & ChartConfig;

export type ChartTypes = (typeof CHART_TYPES)[keyof typeof CHART_TYPES];

export type AxisTypes = "x" | "y";

export type AxisConfig = {
  fileId: string;
  column: string;
};

// Combine AtLeastOneAxis with the settings property
export type TraceConfig = {
  x?: AxisConfig;
  y?: AxisConfig;
  settings: {
    color: string;
    name: string;
  };
  id: string;
};

export type ChartConfig = {
  type: ChartTypes;
  tracesConfig: Array<TraceConfig>;
  chartSettings: {
    title: string;
    titleVisibility: boolean;
    legendVisibility: boolean;
    legendPosition: "top" | "bottom";
    xAxisLabel: string;
    xAxisLimits: {
      min: string;
      max: string
    };
    yAxisLabel: string;
    yAxisLimits: {
      min: string;
      max: string
    };
  };
};

export type Chart = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
} & ChartConfig;

export type Workspace = {
  name: string;
  lastUpdated: string;
}
