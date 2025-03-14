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
    <TabsList className="w-full justify-start h-12 px-6 border-b border-b-secondary bg-primary-foreground">
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
              "flex-1 h-full data-[state=active]:font-semibold data-[state=active]:shadow-none !bg-primary-foreground transition-all cursor-pointer",
              isStepDisabled && "!cursor-not-allowed",
            )}
          >
            <span
              className={cn(
                `mr-2 w-6 h-6 rounded-full ${
                  step.value <= currentStep ? "bg-transparent text-primary border border-primary" : "bg-foreground/10 text-accent-foreground"
                } flex items-center justify-center text-sm`,
                isStepActive && "!bg-primary !text-background !border-primary rounded-full"
              )}
            >
              {step.value}
            </span>
            <span className={step.value <= currentStep ? "text-primary" : "text-muted-foreground"}>{step.label}</span>
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
};

export default memo(TabSelectors);
