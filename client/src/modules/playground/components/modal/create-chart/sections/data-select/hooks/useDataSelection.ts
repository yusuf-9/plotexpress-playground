import {
  CellClickedEvent,
  CellMouseOverEvent,
  ColDef,
  ColumnHeaderMouseOverEvent,
} from "ag-grid-community";
import { useCallback, useMemo, useState } from "react";

// constants
import { CHART_TRACE_CONSTRAINTS_MAP } from "@/modules/playground/constants/charts";

// store
import { useStore } from "@/modules/playground/contexts/store.context";

// custom types
import { AxisTypes, Chart, TraceConfig } from "@/modules/playground/types";
import { AgGridReactProps } from "ag-grid-react";

type Props = {
  chartType: Chart["type"];
  allTraces: TraceConfig[];
  completeTraces: TraceConfig[];
  addOrUpdateTrace: (
    traceConfig: {
      x?: TraceConfig["x"];
      y?: TraceConfig["y"];
    },
    traceIndex: number
  ) => void;
};

export default function useDataSelection(props: Props) {
  const { chartType, allTraces, completeTraces, addOrUpdateTrace } = props;

  const uploadedFiles = useStore(store => store.files);

  const axisOptions = useMemo(() => {
    const { xRequired, yRequired } = CHART_TRACE_CONSTRAINTS_MAP[chartType];
    const axisOptions: AxisTypes[] = [];

    if (xRequired) axisOptions.push("x");
    if (yRequired) axisOptions.push("y");

    return axisOptions;
  }, [chartType]);

  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const [activeAxis, setActiveAxis] = useState<"x" | "y">(axisOptions[0]);
  const [selectedTraceIndex, setSelectedTraceIndex] = useState<null | number>(null);
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

  const defaultTraceIndex = completeTraces.length;
  const traceIndexToUse = selectedTraceIndex === null ? defaultTraceIndex : selectedTraceIndex;

  const dataGridDataData = useMemo(() => {
    return uploadedFiles[selectedFileId]?.data ?? [];
  }, [selectedFileId, uploadedFiles]);

  const dataGridColumnDefinitions = useMemo(() => {
    const columnKeys = dataGridDataData.reduce((acc, dataObject) => {
      Object.keys(dataObject).forEach(key => {
        if (!acc.includes(key)) {
          acc.push(key);
        }
      });
      return acc;
    }, []);

    return columnKeys.map((key: string) => ({
      field: key,
      cellClass: () => {
        if (key === hoveredColumn) return "cursor-pointer bg-main/10";

        const tracesOfColumn = allTraces.find(trace => {
          return (
            (trace.x?.fileId === selectedFileId && trace.x.column === key) ||
            (trace.y?.fileId === selectedFileId && trace.y.column === key)
          );
        });
        if (tracesOfColumn) return `cursor-pointer bg-hex-${tracesOfColumn.settings.color?.replace("#", "")}/10`;
        return "cursor-pointer";
      },
      headerClass: () => {
        if (key === hoveredColumn) return "bg-main/10 hover:!bg-main/10 cursor-pointer";

        const tracesOfColumn = allTraces.find(trace => {
          return (
            (trace.x?.fileId === selectedFileId && trace.x.column === key) ||
            (trace.y?.fileId === selectedFileId && trace.y.column === key)
          );
        });
        if (tracesOfColumn)
          return `cursor-pointer hover:!bg-main bg-hex-${tracesOfColumn.settings.color?.replace("#", "")}/10`;
        return "cursor-pointer";
      },
    }));
  }, [allTraces, dataGridDataData, hoveredColumn, selectedFileId]);

  const defaultDataGridColumnProps: ColDef<any, any> = useMemo(() => {
    return {
      editable: false,
      filter: false,
      resizable: true,
    };
  }, []);

  const handleDataGridCellClick = useCallback(
    (event: CellClickedEvent) => {
      addOrUpdateTrace(
        {
          [activeAxis]: {
            fileId: selectedFileId,
            column: event.colDef.field,
          },
        },
        traceIndexToUse
      );
    },
    [addOrUpdateTrace, activeAxis, selectedFileId, traceIndexToUse]
  );

  const handleDataGridCellMouseOver = useCallback((event: CellMouseOverEvent) => {
    setHoveredColumn(event.colDef.field || null);
  }, []);

  const handleDataGridCellMouseOut = useCallback(() => {
    setHoveredColumn(null);
  }, []);

  const handleDataGridCellHeaderMouseOver = useCallback((event: ColumnHeaderMouseOverEvent) => {
    setHoveredColumn(event.column.getId() || null);
  }, []);

  const handleDataGridCellHeaderMouseOut = useCallback(() => {
    setHoveredColumn(null);
  }, []);

  return {
    dataGridProps: {
      rowData: dataGridDataData,
      columnDefs: dataGridColumnDefinitions,
      defaultColDef: defaultDataGridColumnProps,
      suppressRowClickSelection: true,
      suppressCellFocus: true,
      suppressRowHoverHighlight: true,
      suppressHeaderFocus: true,
      onCellClicked: handleDataGridCellClick,
      onCellMouseOver: handleDataGridCellMouseOver,
      onCellMouseOut: handleDataGridCellMouseOut,
      onColumnHeaderMouseOver: handleDataGridCellHeaderMouseOver,
      onColumnHeaderMouseLeave: handleDataGridCellHeaderMouseOut,
    } as AgGridReactProps,
    defaultTraceIndex,
    selectedTraceIndex,
    setSelectedTraceIndex,
    uploadedFiles,
    selectedFileId,
    axisOptions,
    activeAxis,
    setActiveAxis,
    setSelectedFileId,
  };
}
