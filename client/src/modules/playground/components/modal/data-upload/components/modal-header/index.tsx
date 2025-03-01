import { memo } from "react";
import { DialogHeader, DialogTitle } from "@/common/components/ui/dialog";

const DataModalHeader = () => {
  return (
    <DialogHeader className="px-6 py-4">
      <DialogTitle>Upload Data</DialogTitle>
    </DialogHeader>
  );
};

export default memo(DataModalHeader);
