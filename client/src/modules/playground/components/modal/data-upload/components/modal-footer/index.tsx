import { memo } from "react";
import { Button } from "@/common/components/ui/button";

type Props = {
  onClose: () => void;
  disableSave: boolean;
  onSave: () => void;
  nextButtonText: string;
};

const DataModalFooter = (props: Props) => {
  const { onClose, disableSave, onSave, nextButtonText } = props;
  return (
    <div className="flex justify-end space-x-2 p-4 border-t">
      <Button
        variant="outline"
        onClick={() => onClose()}
      >
        Cancel
      </Button>
      <Button
        disabled={disableSave}
        variant="default"
        onClick={() => onSave()}
      >
        {nextButtonText}
      </Button>
    </div>
  );
};

export default memo(DataModalFooter);
