import { Button } from "@/common/components/ui/button";
import { Download, Share2 } from "lucide-react";

export default function ActionsSidebarSection() {
  return (
    <div className="flex flex-col">
      <h3 className="font-semibold mb-2 text-foreground">Actions</h3>
      <div className="flex flex-col gap-2">
        <Button
          variant="default"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button
          variant="default"
        >
          <Download className="mr-2 h-4 w-4" />
          Export charts
        </Button>
      </div>
    </div>
  );
}
