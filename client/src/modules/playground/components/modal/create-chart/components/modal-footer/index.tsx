import { Button } from "@/client/common/components/ui/button";
import React, { memo } from "react";

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
    <div className="flex-shrink-0 px-6 py-4 flex justify-between items-center border-t bg-gray-50">
      <Button
        onClick={onPrevious}
        variant="outline"
        disabled={disablePreviousStep}
      >
        Previous
      </Button>
      <Button
        className="bg-[#0f9d58] text-white hover:bg-[#0b8043]"
        disabled={disableNextStep}
        onClick={onNext}
      >
        {isLastStep ? "Finish" : "Next"}
      </Button>
    </div>
  );
};

export default memo(ModalFooter);
