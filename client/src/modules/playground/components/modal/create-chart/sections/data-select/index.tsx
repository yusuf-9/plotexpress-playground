import { memo } from "react";
import DataSummary from "./components/data-summary";
import DataGrid from "./components/data-grid";
import useDataSelection from "./hooks/useDataSelection";
import useDataSelectUi from "./hooks/useDataSelectUi";
import { Chart, TraceConfig } from "@/modules/playground/types";

type Props = {
  chartType: Chart["type"];
  completeTraces: TraceConfig[];
  allTraces: TraceConfig[];
  addOrUpdateTrace: (
    traceConfig: {
      x?: TraceConfig["x"];
      y?: TraceConfig["y"];
    },
    traceIndex: number
  ) => void;
  deleteTrace: (traceIndex: number) => void;
  editTraceSettingsItem: (newValue: string, traceIndex: number, item: keyof TraceConfig["settings"]) => void;
};

const DataSelectSection = (props: Props) => {
  const { addOrUpdateTrace, chartType, allTraces, completeTraces, deleteTrace, editTraceSettingsItem } = props;

  const {
    uploadedFiles,
    selectedFileId,
    activeAxis,
    axisOptions,
    selectedTraceIndex,
    setSelectedTraceIndex,
    setActiveAxis,
    setSelectedFileId,
    dataGridProps,
  } = useDataSelection({
    chartType,
    allTraces,
    completeTraces,
    addOrUpdateTrace,
  });

  const { isFileColumnCollapsed, setIsFileColumnCollapsed } = useDataSelectUi();
  
  return (
    <>
      <DataSummary
        activeAxis={activeAxis}
        axisOptions={axisOptions}
        onAxisOptionClick={setActiveAxis}
        traces={completeTraces}
        uploadedFiles={uploadedFiles}
        selectedTraceIndex={selectedTraceIndex}
        onTraceEdit={setSelectedTraceIndex}
        onTraceDelete={deleteTrace}
        onTraceSettingsItemEdit={editTraceSettingsItem}
      />
      <DataGrid
        dataGridProps={dataGridProps}
        isFileColumnCollapsed={isFileColumnCollapsed}
        setIsFileColumnCollapsed={setIsFileColumnCollapsed}
        uploadedFiles={uploadedFiles}
        selectedFileId={selectedFileId}
        setSelectedFileId={setSelectedFileId}
      />
    </>
  );
};

export default memo(DataSelectSection);
