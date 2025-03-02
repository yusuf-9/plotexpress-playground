import { useMemo } from "react";

// components
import { Dialog, DialogContent } from "@/common/components/ui/dialog";
import ModalHeader from "./components/modal-header";
import { Tabs } from "@/common/components/ui/tabs";
import TabSelectors from "./components/tab-selectors";
import ModalFooter from "./components/modal-footer";
import { TooltipProvider } from "@/common/components/ui/tooltip";
import SectionWrapper from "./components/section-wrapper";
import Chart from "../../chart";

// sections
import ChartSelectSection from "./sections/chart-select";
import DataSelectSection from "./sections/data-select";
import ChartCustomizationSection from "./sections/chart-customization";

// hooks
import useCreateChartFlow from "./hooks/use-create-chart-flow";
import useChartPreview from "./hooks/use-chart-preview";

// constants
import { DEFAULT_GRID_PANEL_DIMENSIONS } from "@/modules/playground/constants";

type Props = {
  onClose: () => void;
};

export default function CreateChartModal(props: Props) {
  const { onClose } = props;

  const {
    chartType,
    currentStep,
    allTraces,
    completeTraces,
    addOrUpdateTrace,
    deleteTrace,
    editTraceSettingsItem,
    handleChartTypeSelect,
    handleStepChange,
    finalizeChartSelection,
    handleLoadNextStep,
    handleLoadPreviousStep,
    checkIfStepIsDisabled,
    isLastStep,
    disablePreviousStep,
    disableNextStep,
    chartSettings,
    handleChartSettingsChange,
  } = useCreateChartFlow({ onClose });

  const { chartAPI, setChartPreviewRef } = useChartPreview();

  const chartPreview = useMemo(() => {
    if (currentStep !== 2 && currentStep !== 3) return null;
    if (!completeTraces.length) return null;

    return (
      <div className="flex-grow flex flex-col w-full h-full">
        <h2 className="text-lg font-semibold text-foreground px-4">
          {chartSettings?.titleVisibility ? chartSettings?.title : ""}
        </h2>
        <Chart
          chart={{
            i: "preview",
            ...DEFAULT_GRID_PANEL_DIMENSIONS,
            tracesConfig: completeTraces,
            type: chartType!,
            chartSettings: chartSettings,
          }}
          chartAPI={chartAPI}
          setRef={setChartPreviewRef}
        />
      </div>
    );
  }, [chartAPI, chartSettings, chartType, completeTraces, currentStep, setChartPreviewRef]);

  return (
    <Dialog
      open={true}
      onOpenChange={() => onClose()}
    >
      <DialogContent className="!w-[90vw] !max-w-[1800px] h-[90vh] flex flex-col p-0 bg-background overflow-hidden gap-0">
        <TooltipProvider>
          <ModalHeader />
          <Tabs
            value={currentStep.toString()}
            className="flex-grow flex flex-col"
          >
            <TabSelectors
              currentStep={currentStep}
              onStepChange={handleStepChange}
              checkIfStepIsDisabled={checkIfStepIsDisabled}
            />
            {currentStep === 1 && (
              <ChartSelectSection
                onChartSelect={handleChartTypeSelect}
                tabValue={currentStep.toString()}
                selectedChartType={chartType}
              />
            )}
            {(currentStep === 2 || currentStep === 3) && chartType && (
              <SectionWrapper
                tabValue={currentStep.toString()}
                chartPreviewJsx={chartPreview}
                sectionJsx={
                  currentStep === 2 ? (
                    <DataSelectSection
                      chartType={chartType}
                      completeTraces={completeTraces}
                      allTraces={allTraces}
                      addOrUpdateTrace={addOrUpdateTrace}
                      deleteTrace={deleteTrace}
                      editTraceSettingsItem={editTraceSettingsItem}
                    />
                  ) : (
                    <ChartCustomizationSection
                      chartSettings={chartSettings}
                      setChartSettings={handleChartSettingsChange}
                    />
                  )
                }
              />
            )}
          </Tabs>
          <ModalFooter
            isLastStep={isLastStep}
            disablePreviousStep={disablePreviousStep}
            onNext={isLastStep ? finalizeChartSelection : handleLoadNextStep}
            onPrevious={handleLoadPreviousStep}
            disableNextStep={disableNextStep}
          />
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
}
