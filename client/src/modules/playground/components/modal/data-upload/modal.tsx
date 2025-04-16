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

  const {
    fileProcessingState,
    onFileDrop,
    selectedTestFile,
    setSelectedTestFile,
    testFiles,
    loadingTestFiles,
    errorLoadingTestFiles,
    handleLoadTestFile
  } = useFile({ setParsedData });

  const handleNextButtonClick = () => {
    if (!isProcessed && selectedTestFile) {
      handleLoadTestFile();
      return
    }

    handleSaveData(fileName);
    onClose();
  }

  const { error, isProcessed, isProcessing, processingProgress, fileName, processType } = fileProcessingState;
  const shouldRenderDataUploadSection = !isProcessed && !shouldLoadExistingFile;
  const shouldRenderDataEditorSection = Boolean((isProcessed && parsedData) || shouldLoadExistingFile);
  const disableNextButton = (!selectedTestFile && !isProcessed && !shouldLoadExistingFile) || isProcessing;

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
                isProcessed={isProcessed}
                isProcessing={isProcessing}
                processingProgress={processingProgress}
                onFileDrop={onFileDrop}
                selectedTestFile={selectedTestFile}
                setSelectedTestFile={setSelectedTestFile}
                testFiles={testFiles}
                loadingTestFiles={loadingTestFiles}
                errorLoadingTestFiles={errorLoadingTestFiles}
                processType={processType}
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
            disableSave={disableNextButton}
            onSave={handleNextButtonClick}
            nextButtonText={shouldRenderDataEditorSection ? "Save" : "Next"}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
