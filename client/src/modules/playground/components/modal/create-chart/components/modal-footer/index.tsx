import { memo } from "react";
import { Button } from "@/common/components/ui/button";

type Props = {
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
  disablePreviousStep: boolean;
  disableNextStep: boolean;
};

const ModalFooter = (props: Props) => {
  const { disableNextStep, onNext, onPrevious, isLastStep, disablePreviousStep } = props;
  return (
    <div className="flex-shrink-0 px-6 py-4 flex justify-between items-center border-t border-t-secondary bg-primary-foreground">
      <Button
        onClick={onPrevious}
        variant="outline"
        disabled={disablePreviousStep}
      >
        Previous
      </Button>
      <Button
        variant="default"
        disabled={disableNextStep}
        onClick={onNext}
      >
        {isLastStep ? "Finish" : "Next"}
      </Button>
    </div>
  );
};

export default memo(ModalFooter);
