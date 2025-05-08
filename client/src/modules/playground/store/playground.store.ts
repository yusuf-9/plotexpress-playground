import { create } from "zustand";

// constants
import { DEFAULT_GRID_PANEL_DIMENSIONS } from "../constants";

// types
import { Chart, FileData, ParsedData, FinalChartConfig } from "../types";
import { Workspace } from "@/modules/playground/types";
import { TestFile } from "@/modules/playground/types/files";

// utils
import { generateUUID } from "@/common/utils";

export interface PlaygroundStore {
  // workspace state
  workspace: Workspace;
  setWorkspace: (workspace: Workspace) => void;

  // chartState
  charts: Chart[];
  addChart: (chart: FinalChartConfig) => Chart;
  removeChart: (i: string) => void;
  updateChart: (i: string, chart: Chart) => void;
  setCharts: (charts: Chart[]) => void;

  // editable chart state
  chartToBeEditedId: string;
  setChartToBeEditedId: (chartId: string) => void;

  // files state
  files: FileData;
  addFileData: (fileName: string, fileData: ParsedData) => string;
  removeFileData: (fileUUID: string) => void;
  updateFileData: (fileUUID: string, fileData: ParsedData) => void;
  setFiles: (files: FileData) => void;
  updateFileId: (newFileId: string, oldFileId: string) => void;
  testFiles: TestFile[];
  setTestFiles: (testFiles: TestFile[]) => void;

  // editable file state
  fileToBeEditedId: string;
  setFileToBeEditedId: (fileUUID: string) => void;

  // modalStates
  isChartEditorModalOpen: boolean;
  setIsChartEditorModalOpen: (payload: boolean) => void;
  isDataUploadModalOpen: boolean;
  setIsDataUploadModalOpen: (payload: boolean) => void;
  isShareWorkspaceModalOpen: boolean;
  setIsShareWorkspaceModalOpen: (payload: boolean) => void;

  // shared workspace status state
  isSharedWorkspace: boolean;
  setIsSharedWorkspace: (payload: boolean) => void;
}

const createPlaygroundStore = () => {
  return create<PlaygroundStore>(set => ({
    // workspace state
    workspace: {
      name: "",
      lastUpdated: "",
    },
    setWorkspace: (workspace: Workspace) => set({ workspace }),

    // chart states
    charts: [],
    addChart: chart => {
      const newChart = {
        ...chart,
        i: generateUUID(),
        ...DEFAULT_GRID_PANEL_DIMENSIONS,
      };

      set(prevState => ({
        charts: [...prevState.charts, newChart],
      }));

      return newChart;
    },
    removeChart: (i: string) =>
      set(prevState => ({
        charts: prevState.charts.filter(chart => chart.i !== i),
      })),
    updateChart: (i: string, chart: Chart) => {
      set(prevState => ({
        charts: prevState.charts.map(chartItem => (chartItem.i === i ? chart : chartItem)),
      }));
    },
    setCharts: (charts: Array<Chart>) => {
      set({
        charts: charts,
      });
    },

    // data state
    files: {},
    addFileData: (fileName: string, fileData: ParsedData) => {
      const newFileUUID = generateUUID();
      set(prevState => ({
        files: {
          ...prevState.files,
          [newFileUUID]: {
            name: fileName,
            data: fileData,
          },
        },
      }));
      return newFileUUID;
    },
    removeFileData: (fileUUID: string) => {
      set(prevStore => ({
        files: Object.entries(prevStore.files).reduce((acc: FileData, [fileKey, fileData]) => {
          if (fileUUID === fileKey) return acc;

          acc[fileKey] = fileData;
          return acc;
        }, {}),
      }));
    },
    updateFileData: (fileUUID: string, fileData: ParsedData) => {
      set(prevStore => {
        return {
          files: {
            ...prevStore.files,
            [fileUUID]: {
              ...prevStore.files[fileUUID],
              data: fileData,
            },
          },
        };
      });
    },
    setFiles: (files: FileData) => {
      set({
        files: files,
      });
    },
    updateFileId: (newFileId: string, oldFileId: string) => {
      set(prevStore => ({
        files: Object.entries(prevStore.files).reduce((acc: FileData, [fileKey, fileData]) => {
          if (fileKey === oldFileId) {
            acc[newFileId] = fileData;
          } else {
            acc[fileKey] = fileData;
          }
          return acc;
        }, {}),
      }));
    },
    testFiles: [],
    setTestFiles: (testFiles: TestFile[]) => {
      set({
        testFiles: testFiles,
      });
    },

    // editable chart state
    chartToBeEditedId: "",
    setChartToBeEditedId: (chartId: string) =>
      set({
        chartToBeEditedId: chartId,
      }),

    // editable file state
    fileToBeEditedId: "",
    setFileToBeEditedId: (fileUUID: string) =>
      set({
        fileToBeEditedId: fileUUID,
      }),

    // modal states
    isChartEditorModalOpen: false,
    setIsChartEditorModalOpen: (payload: boolean) =>
      set({
        isChartEditorModalOpen: payload,
      }),
    isDataUploadModalOpen: false,
    setIsDataUploadModalOpen: (payload: boolean) =>
      set({
        isDataUploadModalOpen: payload,
      }),
    isShareWorkspaceModalOpen: false,
    setIsShareWorkspaceModalOpen: (payload: boolean) =>
      set({
        isShareWorkspaceModalOpen: payload,
      }),

    // shared workspace state
    isSharedWorkspace: false,
    setIsSharedWorkspace: (payload: boolean) =>
      set({
        isSharedWorkspace: payload
      })
  }));
};

export default createPlaygroundStore;
