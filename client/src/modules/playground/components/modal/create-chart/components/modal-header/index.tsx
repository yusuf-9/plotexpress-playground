import React, { memo } from "react";
import { DialogDescription, DialogHeader, DialogTitle } from "@/client/common/components/ui/dialog";

type Props = {};

const DataModalHeader = (props: Props) => {
  return (
    <DialogHeader className="px-6 py-4 bg-gray-50">
      <DialogTitle>Create a New Chart</DialogTitle>
      <DialogDescription>Follow the steps to create your custom chart.</DialogDescription>
    </DialogHeader>
  );
};

export default memo(DataModalHeader);
