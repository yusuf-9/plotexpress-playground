import "@/common/styles/index.css";

import { TooltipProvider } from "@/common/components/ui/tooltip";
import Playground from "@/modules/playground";
import ConfirmProvider from "@/common/providers/confirmation";
import { Toaster } from "@/common/components/ui/sonner";

export default function App() {
  return (
    <TooltipProvider>
      <ConfirmProvider>
        <Playground />
      </ConfirmProvider>
      <Toaster />
    </TooltipProvider>
  );
}
