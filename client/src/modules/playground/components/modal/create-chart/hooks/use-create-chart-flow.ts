import { useCallback, useMemo, useState } from "react";
import { nanoid } from "nanoid";

// constants
import { Chart, ChartConfig, TraceConfig } from "@/modules/playground/types";
import { CHART_TRACE_CONSTRAINTS_MAP } from "@/modules/playground/constants/charts";
import { DEFAULT_COLOR_MAP } from "@/modules/playground/constants/colors";
import { STEPS } from "../constants";

// hooks
import { useStore } from "@/modules/playground/contexts/store.context";
import { useDependencyInjector } from "@/modules/playground/contexts/dependency-injector.context";

type Props = {
  onClose: () => void;
};

export default function useCreateChartFlow(props: Props) {
  const { onClose } = props;

  const { dataManager } = useDependencyInjector();

  const chartToBeEditedId = useStore(store => store.chartToBeEditedId);
  const chartToBeEdited = useStore(store => store.charts?.find(chart => chart.i === chartToBeEditedId));

  const [chartConfig, setChartConfig] = useState<{
    type: Chart["type"] | undefined;
    tracesConfig: Chart["tracesConfig"];
    chartSettings: Chart["chartSettings"];
  }>({
    type: chartToBeEdited?.type ?? undefined,
    tracesConfig: chartToBeEdited?.tracesConfig ?? [],
    chartSettings: chartToBeEdited?.chartSettings ?? {
      title: "",
      titleVisibility: true,
      legendVisibility: true,
      legendPosition: "top",
      xAxisLabel: "",
      xAxisLimits: {
        min: "",
        max: "",
      },
      yAxisLabel: "",
      yAxisLimits: {
        min: "",
        max: "",
      },
    },
  });

  const [currentStep, setCurrentStep] = useState<(typeof STEPS)[keyof typeof STEPS]["value"]>(
    chartToBeEdited ? STEPS.DATA_SELECT.value : STEPS.CHART_TYPE_SELECT.value
  );

  const chartType = chartConfig.type;
  const chartSettings = chartConfig.chartSettings;
  const completeTraces = chartConfig.tracesConfig.filter(traceConfigObject => {
    if (!chartType) return false;

    const { xRequired, yRequired } = CHART_TRACE_CONSTRAINTS_MAP[chartType];
    switch (true) {
      case xRequired && yRequired:
        return Boolean(traceConfigObject?.x && traceConfigObject?.y);
      case xRequired && !yRequired:
        return Boolean(traceConfigObject?.x);
      case !xRequired && yRequired:
        return Boolean(traceConfigObject?.y);
      default:
        return false;
    }
  });

  const checkIfStepIsDisabled = useCallback(
    (step: number) => {
      switch (true) {
        case step === STEPS.CHART_TYPE_SELECT.value:
          return false;
        case step === STEPS.DATA_SELECT.value:
          return !chartConfig.type;
        case step === STEPS.CUSTOMIZATION.value:
          return !completeTraces.length;
        default:
          return false;
      }
    },
    [chartConfig.type, completeTraces.length]
  );

  const disablePreviousStep = currentStep <= STEPS.CHART_TYPE_SELECT.value;
  const disableNextStep = useMemo(() => {
    switch (currentStep) {
      case STEPS.CHART_TYPE_SELECT.value:
        return !chartConfig.type;
      case STEPS.DATA_SELECT.value:
        return !completeTraces.length;
      case STEPS.CUSTOMIZATION.value:
        return false;
      default:
        return false;
    }
  }, [chartConfig.type, completeTraces.length, currentStep]);
  const isLastStep = currentStep >= STEPS.CUSTOMIZATION.value;

  const handleChartTypeSelect = useCallback((selectedChartType: Chart["type"]) => {
    setChartConfig(prev => ({
      ...prev,
      type: selectedChartType,
    }));
    setCurrentStep(prev => prev + 1);
  }, []);

  const handleChartSettingsChange = useCallback((newChartSettings: Chart["chartSettings"]) => {
    setChartConfig(prev => ({
      ...prev,
      chartSettings: { ...prev.chartSettings, ...newChartSettings },
    }));
  }, []);

  const addOrUpdateTrace = useCallback(
    (traceConfig: { x?: TraceConfig["x"]; y?: TraceConfig["y"] }, traceIndex: number) => {
      if (!chartType) return;

      setChartConfig(prev => {
        switch (true) {
          // if a new trace is to be added
          case traceIndex === prev.tracesConfig.length:
            return {
              ...prev,
              tracesConfig: [
                ...prev.tracesConfig,
                {
                  ...traceConfig,
                  settings: {
                    color: DEFAULT_COLOR_MAP[traceIndex],
                    name: "Trace " + prev.tracesConfig.length,
                  },
                  id: nanoid(),
                },
              ],
            };
          // if an existing trace is to be updated
          case traceIndex > -1 && traceIndex < prev.tracesConfig.length:
            return {
              ...prev,
              tracesConfig: prev.tracesConfig.reduce((acc: Array<TraceConfig>, traceConfigObject, index) => {
                if (traceIndex !== index) {
                  acc.push(traceConfigObject);
                  return acc;
                }

                acc.push({
                  ...traceConfigObject,
                  ...traceConfig,
                });
                return acc;
              }, []),
            };
          default:
            return prev;
        }
      });
    },
    [chartType]
  );

  const deleteTrace = useCallback((traceIndex: number) => {
    setChartConfig(prev => {
      if (traceIndex < 0 || traceIndex >= prev.tracesConfig.length) {
        return prev;
      }

      return {
        ...prev,
        tracesConfig: prev.tracesConfig.filter((_, index) => {
          return traceIndex !== index;
        }),
      };
    });
  }, []);

  const editTraceSettingsItem = useCallback(
    (newValue: string, traceIndex: number, item: keyof TraceConfig["settings"]) => {
      setChartConfig(prev => {
        if (traceIndex < 0 || traceIndex >= prev.tracesConfig.length) {
          return prev;
        }

        return {
          ...prev,
          tracesConfig: prev.tracesConfig.reduce((acc: Array<TraceConfig>, traceConfigObject, index) => {
            if (traceIndex !== index) {
              acc.push(traceConfigObject);
              return acc;
            }

            acc.push({
              ...traceConfigObject,
              settings: {
                ...traceConfigObject.settings,
                [item]: newValue,
              },
            });
            return acc;
          }, []),
        };
      });
    },
    []
  );

  const handleStepChange = useCallback((newStep: number) => {
    setCurrentStep(newStep);
  }, []);

  const handleLoadPreviousStep = useCallback(() => {
    if (disablePreviousStep) return;
    setCurrentStep(prev => prev - 1);
  }, [disablePreviousStep]);

  const handleLoadNextStep = useCallback(() => {
    if (disableNextStep) return;

    setCurrentStep(prev => prev + 1);
  }, [disableNextStep]);

  const finalizeChartSelection = useCallback(async () => {
    if (chartToBeEdited) {
      dataManager.updateChart(chartToBeEditedId, {
        ...chartToBeEdited,
        ...(chartConfig as ChartConfig),
      });
      onClose();
      return;
    }

    dataManager.addChart(chartConfig as ChartConfig);
    onClose();
  }, [chartConfig, chartToBeEdited, chartToBeEditedId, dataManager, onClose]);

  return {
    currentStep,
    chartType,
    completeTraces,
    allTraces: chartConfig.tracesConfig,

    traces: completeTraces,
    isLastStep,
    disablePreviousStep,
    disableNextStep,
    chartSettings,
    handleStepChange,
    handleChartTypeSelect,
    handleChartSettingsChange,
    addOrUpdateTrace,
    deleteTrace,
    editTraceSettingsItem,
    finalizeChartSelection,
    handleLoadPreviousStep,
    handleLoadNextStep,
    checkIfStepIsDisabled,
  };
}
