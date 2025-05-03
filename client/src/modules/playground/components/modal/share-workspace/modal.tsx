// components
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/common/components/ui/dialog";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";

// hooks
import useDataUpload from "./hooks/use-data-upload";
import { useMemo } from "react";
import { toast } from "sonner";

type Props = {
  onClose: () => void;
};

export default function ShareWorkspaceModal(props: Props) {
  const { onClose } = props;

  const { shareLink, uploadState, uploadStep } = useDataUpload();

  const loaderJSX = useMemo(() => {
    const heading = (
      <h2 className="text-2xl font-bold text-center text-foreground mb-8">Your share link will be ready shortly</h2>
    );
    switch (true) {
      case Boolean(uploadState.error):
        return (
          <div className="flex flex-col gap-5">
            <h3 className="text-2xl font-bold text-center text-destructive">Failed to generate share link!</h3>
            <p className="text-center text-destructive-foreground mb-2 text-sm">{uploadState.error}</p>
          </div>
        );
      case Boolean(uploadStep === "completed" && shareLink.length):
        return (
          <>
            <h2 className="text-2xl font-bold text-center text-foreground mb-6">Your share link is ready!</h2>
            <div className="w-full max-w-md flex flex-col items-center">
              <div className="flex w-full gap-2">
                <Input
                  className="flex-grow"
                  value={shareLink}
                  readOnly
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    toast("Share link copied to clipboard");
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          </>
        );
      default:
        return (
          <>
            {heading}
            <div className="w-full max-w-md flex flex-col items-center">
              <div className="mb-6">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <>
                <div className="text-lg font-medium mb-2">{uploadState.percentageCompletion}%</div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{ width: `${uploadState.percentageCompletion}%` }}
                  />
                </div>
              </>
              <div className="text-center text-muted-foreground mb-2 text-sm">{uploadStep.split("-").join(" ")}...</div>
            </div>
          </>
        );
    }
  }, [shareLink, uploadState.error, uploadState.percentageCompletion, uploadStep]);

  return (
    <Dialog open={true}>
      <DialogContent className="!w-[80vw] !max-w-[1000px] h-[80vh] max-h-[800px] p-0 flex flex-col">
        <DialogHeader className="px-6 py-4">
          <DialogTitle className="text-foreground">Share Workspace</DialogTitle>
        </DialogHeader>
        <div className="flex-grow flex flex-col items-center justify-center px-8">{loaderJSX} </div>
        {/* Custom Modal Footer */}
        <div className="px-8 py-4 border-t border-border flex">
          <Button
            variant="destructive"
            onClick={onClose}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
