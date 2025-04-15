import { useCallback, useMemo, useState } from "react";
import { nanoid } from "nanoid";

// constants
import { FinalChartConfig, BaseChartConfig } from "@/modules/playground/types";
import { CHART_TRACE_CONSTRAINTS_MAP } from "@/modules/playground/constants/charts";
import { DEFAULT_COLOR_MAP } from "@/modules/playground/constants/colors";
import { STEPS } from "../constants";

// hooks
import { useStore } from "@/modules/playground/contexts/store.context";
import { useDependencyInjector } from "@/modules/playground/contexts/dependency-injector.context";

// utils
import { getDefaultChartSettings, getDefaultTraceSettings } from "@/modules/playground/utils/chart-settings";

type Props = {
  onClose: () => void;
};

export default function useCreateChartFlow(props: Props) {
  const { onClose } = props;

  const { dataManager } = useDependencyInjector();

  const chartToBeEditedId = useStore(store => store.chartToBeEditedId);
  const setEditChartId = useStore(store => store.setChartToBeEditedId);
  const chartToBeEdited = useStore(store => store.charts?.find(chart => chart.i === chartToBeEditedId));

  const [chartConfig, setChartConfig] = useState<{
    type: FinalChartConfig["type"] | undefined;
    tracesConfig: FinalChartConfig["tracesConfig"];
    chartSettings: FinalChartConfig["chartSettings"];
  }>({
    type: chartToBeEdited?.type ?? undefined,
    tracesConfig: chartToBeEdited?.tracesConfig ?? [],
    chartSettings: chartToBeEdited?.chartSettings ?? getDefaultChartSettings(chartToBeEdited?.type ?? ""),
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

  const handleChartTypeSelect = useCallback((selectedChartType: FinalChartConfig["type"]) => {
    setChartConfig(prev => ({
      ...prev,
      type: selectedChartType,
      chartSettings: getDefaultChartSettings(selectedChartType),
    }));
    setCurrentStep(prev => prev + 1);
  }, []);

  const handleChartSettingsChange = useCallback((newChartSettings: FinalChartConfig["chartSettings"]) => {
    setChartConfig(prev => ({
      ...prev,
      chartSettings: { ...prev.chartSettings, ...newChartSettings },
    }));
  }, []);

  const addOrUpdateTrace = useCallback(
    (traceConfig: { x?: FinalChartConfig["tracesConfig"][number]["x"]; y?: FinalChartConfig["tracesConfig"][number]["y"] }, traceIndex: number) => {
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
                    ...getDefaultTraceSettings(chartType),
                    name: "Trace " + prev.tracesConfig.length,
                    color: DEFAULT_COLOR_MAP[traceIndex],
                  },
                  id: nanoid(),
                },
              ],
            };
          // if an existing trace is to be updated
          case traceIndex > -1 && traceIndex < prev.tracesConfig.length:
            return {
              ...prev,
              tracesConfig: prev.tracesConfig.map((traceConfigObject, index) => {
                if (traceIndex !== index) {
                  return traceConfigObject;
                }

                return {
                  ...traceConfigObject,
                  ...traceConfig,
                };
              }),
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
    (item: keyof FinalChartConfig["tracesConfig"][number]["settings"], newValue: string, traceIndex: number,) => {
      setChartConfig(prev => {
        if (traceIndex < 0 || traceIndex >= prev.tracesConfig.length) {
          return prev;
        }

        return {
          ...prev,
          tracesConfig: prev.tracesConfig.map((traceConfigObject, index) => {
            if (traceIndex !== index) {
              return traceConfigObject;
            }

            return {
              ...traceConfigObject,
              settings: {
                ...traceConfigObject.settings,
                [item]: newValue,
              },
            };
          }),
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
        ...(chartConfig as BaseChartConfig),
      });
      onClose();
      return;
    }

    dataManager.addChart(chartConfig as BaseChartConfig);
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
    setEditChartId
  };
}
