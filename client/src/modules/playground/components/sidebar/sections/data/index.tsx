import { useCallback, useMemo } from "react";
import { Edit2, Trash2, Upload } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { useStore } from "@/modules/playground/contexts/store.context";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/common/components/ui/tooltip";
import { Separator } from "@/common/components/ui/separator";
import { ScrollArea } from "@/common/components/ui/scroll-area";
import { useConfirm } from "@/common/providers/confirmation";
import { useDependencyInjector } from "@/modules/playground/contexts/dependency-injector.context";

type Props = {
  openDataEditor: () => void;
};

export default function DataSidebarSection(props: Props) {
  const { openDataEditor } = props;

  const { confirm } = useConfirm();
  const { dataManager } = useDependencyInjector();

  const filesMap = useStore(store => store.files);
  const setFileToBeEditedId = useStore(store => store.setFileToBeEditedId);

  const handleEditFile = useCallback(
    (fileKey: string) => {
      setFileToBeEditedId(fileKey);
      openDataEditor();
    },
    [openDataEditor, setFileToBeEditedId]
  );

  const handleDeleteFile = useCallback(
    (fileId: string) => {
      confirm({
        title: "Delete file",
        description: "Are you sure you want to delete this file? It will be deleted permanently.",
        onConfirm: () => {
          dataManager.deleteFile(fileId);
        },
        onCancel: () => {},
      });
    },
    [confirm, dataManager]
  );

  const filesJSX = useMemo(() => {
    return Object.entries(filesMap).map(([fileKey, file], index) => (
      <div
        key={index}
        className="flex items-center justify-between overflow-x-hidden pl-3 pr-1 py-2 bg-[#e6f4ea] rounded-md hover:bg-[#d0e8d8] transition-colors duration-200"
      >
        <div className="flex items-center flex-grow overflow-x-hidden">
          {/* <FileText className="flex-shrink-0 h-5 w-5 mr-3 text-[#0f9d58]" /> */}
          <span className="text-sm font-medium truncate text-gray-800">{file.name}</span>
        </div>
        <div className="flex space-x-1 flex-shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex-shrink-0 h-6 w-6 rounded-full hover:bg-[#c8e6c9]"
                onClick={() => handleEditFile(fileKey)}
              >
                <Edit2 className="flex-shrink-0  h-4 w-4 text-[#0f9d58]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit file</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex-shrink-0 h-6 w-6 rounded-full hover:bg-[#c8e6c9]"
                onClick={() => handleDeleteFile(fileKey)}
              >
                <Trash2 className="flex-shrink-0  h-4 w-4 text-[#0f9d58]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete file</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    ));
  }, [filesMap, handleDeleteFile, handleEditFile]);

  return (
    <TooltipProvider>
      <div className="flex flex-col">
        <h3 className="font-semibold mb-2 text-gray-700">Data Upload</h3>
        <Button
          variant="outline"
          className="w-full justify-center bg-main !text-white hover:bg-main-dark"
          onClick={openDataEditor}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Data
        </Button>
      </div>
      <Separator className="my-6" />
      <h4 className="text-base font-semibold mb-2 text-gray-800">Uploaded Files</h4>
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-2">{filesJSX}</div>
      </ScrollArea>
    </TooltipProvider>
  );
}
