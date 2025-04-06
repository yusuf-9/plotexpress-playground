// components
import { Dialog, DialogContent } from "@/common/components/ui/dialog";
import ModalHeader from "./components/modal-header";
import ModalFooter from "./components/modal-footer";

// sections
import DataUploadSection from "./sections/data-upload";
import DataEditorSection from "@/modules/playground/components/data-editor";

// hooks
import useFile from "./hooks/useFile";
import useData from "./hooks/useData";
import { useTheme } from "@/common/providers/theme";

// utils
import { cn } from "@/common/utils";

type Props = {
  onClose: () => void;
};

export default function DataUploadModal(props: Props) {
  const { onClose } = props;

  const { theme } = useTheme();

  const {
    parsedData,
    columnDefinitions,
    dataEditorRef,
    setParsedData,
    handleSaveData,
    setEditableFileId,
    shouldLoadExistingFile,
    defaultColumnProps,
  } = useData();
  const { fileUploadState, onFileDrop, selectedTestFile, setSelectedTestFile, testFiles, loadingTestFiles, errorLoadingTestFiles } = useFile({ setParsedData });

  const { error, isUploaded, isUploading, uploadProgress, fileName } = fileUploadState;
  const shouldRenderDataUploadSection = !fileUploadState.isUploaded && !shouldLoadExistingFile;
  const shouldRenderDataEditorSection = Boolean((fileUploadState.isUploaded && parsedData) || shouldLoadExistingFile);

  return (
    <Dialog
      open={true}
      onOpenChange={() => {
        onClose();
        setEditableFileId("");
      }}
    >
      <DialogContent
        className="!w-[80vw] !max-w-[1000px] h-[80vh] max-h-[800px] p-0"
        aria-describedby="data upload modal"
      >
        <div className="h-full flex flex-col">
          <ModalHeader />
          <div
            className={cn(
              "flex-grow flex flex-col ag-theme-quartz",
              theme === "dark" ? "ag-theme-quartz-dark" : "ag-theme-quartz"
            )}
          >
            {shouldRenderDataUploadSection && (
              <DataUploadSection
                error={error}
                isUploaded={isUploaded}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                onFileDrop={onFileDrop}
                selectedTestFile={selectedTestFile}
                setSelectedTestFile={setSelectedTestFile}
                testFiles={testFiles}
                loadingTestFiles={loadingTestFiles}
                errorLoadingTestFiles={errorLoadingTestFiles}
              />
            )}
            {shouldRenderDataEditorSection && (
              <DataEditorSection
                rowData={parsedData!}
                columnDefs={columnDefinitions}
                ref={dataEditorRef}
                singleClickEdit
                defaultColDef={defaultColumnProps}
              />
            )}
          </div>
          <ModalFooter
            onClose={onClose}
            disableSave={!fileUploadState.isUploaded && !shouldLoadExistingFile}
            onSave={() => {
              handleSaveData(fileName);
              onClose();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
