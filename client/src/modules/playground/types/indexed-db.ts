import { BaseChartConfig } from ".";
import { ParsedData } from "./data";

export type IndexedDBCachedFile = {
  id: string;
  name: string;
  data: ParsedData;
  lastUpdated: string;
};

export type IndexedDBCachedChart = {
  id: string;
  lastUpdated: string;
} & BaseChartConfig;
