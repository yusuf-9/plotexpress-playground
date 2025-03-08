import { memo } from "react";
import { DialogDescription, DialogHeader, DialogTitle } from "@/common/components/ui/dialog";


const DataModalHeader = () => {
  return (
    <DialogHeader className="px-6 py-4">
      <DialogTitle>Create a New Chart</DialogTitle>
      <DialogDescription>Follow the steps to create your custom chart.</DialogDescription>
    </DialogHeader>
  );
};

export default memo(DataModalHeader);
