import { memo, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AgGridReactProps } from "ag-grid-react";

// components
import { Button } from "@/common/components/ui/button";
import DataEditor from "@/modules/playground/components/data-editor";

// utils
import { cn } from "@/common/utils";

// types
import { FileData } from "@/modules/playground/types";

type Props = {
  isFileColumnCollapsed: boolean;
  setIsFileColumnCollapsed: (collapsed: boolean) => void;
  uploadedFiles: FileData;
  selectedFileId: string;
  setSelectedFileId: (id: string) => void;
  dataGridProps: AgGridReactProps;
};

const DataGrid = (props: Props) => {
  const {
    isFileColumnCollapsed,
    selectedFileId,
    setSelectedFileId,
    setIsFileColumnCollapsed,
    uploadedFiles,
    dataGridProps,
  } = props;

  const fileOptions = useMemo(() => {
    return Object.entries(uploadedFiles).map(([fileKey, fileData]) => {
      return (
        <li key={fileKey}>
          <Button
            variant="outline"
            className={cn(
              "h-auto w-full bg-gradient-to-br overflow-hidden hover:from-[#e6fff7] hover:to-[#ccfbf1] transition-all duration-300 shadow-sm hover:shadow-sm",
              selectedFileId === fileKey ? "from-[#e6fff7] to-[#ccfbf1] shadow-sm" : "from-white to-[#f0f9ff]"
            )}
            onClick={() => setSelectedFileId(fileKey)}
          >
            <span className="w-full text-ellipsis overflow-hidden font-medium ">{fileData?.name}</span>
          </Button>
        </li>
      );
    });
  }, [selectedFileId, setSelectedFileId, uploadedFiles]);

  return (
    <div className="flex-grow flex">
      <div
        className={`relative py-3 px-2 flex flex-col gap-4 bg-gray-50 transition-all duration-300 border-r rounded-bl-lg ${
          isFileColumnCollapsed ? "w-12" : "w-48"
        }`}
      >
        <Button
          variant="ghost"
          className="p-2 absolute right-1 top-1"
          onClick={() => setIsFileColumnCollapsed(!isFileColumnCollapsed)}
        >
          {isFileColumnCollapsed ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
        </Button>
        {!isFileColumnCollapsed && (
          <>
            <h3 className="font-semibold mb-0 text-sm">Uploaded files</h3>
            <ul className="space-y-2 text-sm text-gray-600 w-full">{fileOptions}</ul>
          </>
        )}
      </div>
      <div className="flex-grow bg-white overflow-y-auto ag-theme-quartz [&_.ag-root-wrapper]:rounded-none [&_.ag-root-wrapper]:border-none">
        {selectedFileId ? (
          <DataEditor {...dataGridProps} />
        ) : (
          <div className="flex justify-center items-center h-full w-full">
            <h3 className="text-lg font-semibold mb-1">Select a file to view its data.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(DataGrid);
