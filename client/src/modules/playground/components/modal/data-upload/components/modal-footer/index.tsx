import { memo } from "react";
import { Button } from "@/common/components/ui/button";

type Props = {
  onClose: () => void;
  disableSave: boolean;
  onSave: () => void;
};

const DataModalFooter = (props: Props) => {
  const { onClose, disableSave, onSave } = props;
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
        className="bg-[#0f9d58] text-white hover:bg-[#0b8043]"
        onClick={() => onSave()}
      >
        Save
      </Button>
    </div>
  );
};

export default memo(DataModalFooter);
