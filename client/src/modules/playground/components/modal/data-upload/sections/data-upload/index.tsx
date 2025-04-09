import { memo, useMemo } from "react";
import { AlertCircle, Upload, ChevronDown, FileText, Loader2, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

// components
import { Progress } from "@/common/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/common/components/ui/alert";
import { Separator } from "@/common/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { Button } from "@/common/components/ui/button";

// types
import { TestFile } from "@/modules/playground/types/files";
import { FileProcessingState } from "../../types";

type Props = {
  error: FileProcessingState["error"];
  isProcessing: FileProcessingState["isProcessing"];
  isProcessed: FileProcessingState["isProcessed"];
  processingProgress: FileProcessingState["processingProgress"];
  onFileDrop: (acceptedFiles: File[]) => Promise<void>;
  selectedTestFile: TestFile | null;
  setSelectedTestFile: (file: TestFile | null) => void;
  testFiles: TestFile[];
  loadingTestFiles: boolean;
  errorLoadingTestFiles: string | null;
  processType: FileProcessingState["processType"];
};

const DataUploadSection = (props: Props) => {
  const {
    error,
    isProcessing,
    isProcessed,
    processingProgress,
    onFileDrop,
    selectedTestFile,
    setSelectedTestFile,
    testFiles,
    loadingTestFiles,
    errorLoadingTestFiles,
    processType,
  } = props;
  
  console.log({error})

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onFileDrop,
    noClick: false,
    noKeyboard: false,
  });

  const filesByCategory = useMemo(() => {
    return testFiles.reduce((acc, file) => {
      acc[file.category] = acc[file.category] || [];
      acc[file.category].push(file);
      return acc;
    }, {} as Record<string, TestFile[]>);
  }, [testFiles]);

  return (
    <>
      {error && (
        <div className="px-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      <div className="flex flex-col gap-6 px-12 py-4 w-full">
        <h2 className="text-center font-bold text-xl">Got a file to upload?</h2>
        <div
          {...getRootProps()}
          className="border-2 flex-grow flex items-center justify-center border-dashed border-foreground/30 rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
        >
          <input {...getInputProps()} />
          {isProcessing && (
            <div className="space-y-2 w-full">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{processType === "upload" ? "Processing file..." : "Loading test file..."}</span>
                <span className="text-sm font-medium">{processingProgress?.toString()}%</span>
              </div>
              <Progress
                value={processingProgress}
                className="w-full"
              />
            </div>
          )}
          {!isProcessed && !isProcessing && (
            <div className="text-foreground">
              <Upload className="mx-auto h-12 w-12" />
              <p className="mt-2 text-lg">Drag &lsquo;n&rsquo; drop a file here, or click to select a file</p>
              <p className="mt-1 text-sm text-muted-foreground">Supported file types: CSV, XLS, XLSX</p>
            </div>
          )}
        </div>

        <div className="flex gap-10 w-full overflow-hidden max-w-full items-center">
          <Separator className="w-full flex-1" />
          <h2 className="text-center font-bold text-xl">OR</h2>
          <Separator className="w-full flex-1" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-center font-bold text-xl">Browse Sample Datasets</h2>
          <p className="text-muted-foreground text-center">Get started quickly with our curated sample datasets</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={selectedTestFile ? "default" : "outline"}
                  className="flex items-center justify-between min-w-48 shadow-sm hover:shadow-md transition-shadow text-lg"
                >
                  {selectedTestFile ? (
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      <span>{selectedTestFile.label}</span>
                    </div>
                  ) : (
                    "Browse Datasets"
                  )}
                  <ChevronDown className="w-5 h-5 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 min-h-[200px] flex flex-col"
                side="top"
              >
                {loadingTestFiles && (
                  <div className="flex items-center justify-center flex-grow">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                )}
                {errorLoadingTestFiles && (
                  <div className="flex items-center justify-center flex-grow">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-destructive" />
                      <p className="text-destructive text-lg">{errorLoadingTestFiles}</p>
                    </div>
                  </div>
                )}
                {!loadingTestFiles && !errorLoadingTestFiles && (
                  <>
                    <DropdownMenuLabel className="font-semibold text-lg">Categories</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.entries(filesByCategory).map(([category, files]) => (
                      <DropdownMenuGroup key={category}>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <span className="capitalize text-lg">{category}</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent className="max-w-[300px]">
                              <DropdownMenuLabel className="font-semibold text-lg">Files</DropdownMenuLabel>
                              <Separator />
                              {files.map(file => (
                                <DropdownMenuItem
                                  className="flex items-start gap-2 cursor-pointer"
                                  onClick={() => setSelectedTestFile(file)}
                                >
                                  <FileText className="w-5 h-5 mx-2 my-2" />
                                  <div className="flex flex-col gap-0">
                                    <span className="text-lg">{file.label}</span>
                                    <span className="text-sm text-muted-foreground">{file.description}</span>
                                  </div>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      </DropdownMenuGroup>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {selectedTestFile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedTestFile(null)}
                className="hover:bg-destructive/10 dark:bg-destructive/40"
              >
                <X className="h-5 w-5 text-destructive" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(DataUploadSection);
