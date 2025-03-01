import { Button } from "@/common/components/ui/button";
import { Download, Share2 } from "lucide-react";

export default function ActionsSidebarSection() {
  return (
    <div className="flex flex-col">
      <h3 className="font-semibold mb-2 text-gray-700">Actions</h3>
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-center bg-main !text-white hover:bg-main-dark"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button
          variant="outline"
          className="w-full justify-center bg-main !text-white hover:bg-main-dark"
        >
          <Download className="mr-2 h-4 w-4" />
          Export charts
        </Button>
      </div>
    </div>
  );
}
