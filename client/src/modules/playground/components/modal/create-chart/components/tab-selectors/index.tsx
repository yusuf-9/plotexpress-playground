import { TabsList, TabsTrigger } from "@/common/components/ui/tabs";
import { memo } from "react";
import { STEPS } from "../../constants";
import { cn } from "@/common/utils";

type Props = {
  currentStep: number;
  onStepChange: (step: number) => void;
  checkIfStepIsDisabled: (step: number) => boolean;
};

const TabSelectors = (props: Props) => {
  const { currentStep, onStepChange, checkIfStepIsDisabled } = props;
  return (
    <TabsList className="w-full justify-start h-12 bg-gray-50 px-6 border-b">
      {Object.values(STEPS).map(step => {
        const isStepDisabled = checkIfStepIsDisabled(step.value);
        const isStepActive = step.value === currentStep;
        return (
          <TabsTrigger
            key={step.value}
            value={step.value.toString()}
            disabled={isStepDisabled}
            onClick={() => onStepChange(step.value)}
            className={cn(
              "flex-1 h-full data-[state=active]:font-semibold data-[state=active]:bg-gray-50 data-[state=active]:shadow-none transition-all",
              isStepDisabled && "!cursor-not-allowed"
            )}
          >
            <span
              className={cn(
                `mr-2 w-6 h-6 rounded-full ${
                  step.value <= currentStep ? "bg-[#0f9d58] text-background" : "bg-gray-300 text-accent-foreground"
                } flex items-center justify-center text-sm`,
                isStepActive && "!bg-background !text-primary border border-primary rounded-full"
              )}
            >
              {step.value}
            </span>
            <span className={step.value <= currentStep ? "text-[#0f9d58]" : "text-muted-foreground"}>{step.label}</span>
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
};

export default memo(TabSelectors);
