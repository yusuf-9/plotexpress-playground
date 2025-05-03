import { Suspense, lazy } from "react";

// store
import { useStore } from "@/modules/playground/contexts/store.context";

// Lazy load the modal
const ShareWorkspaceModal = lazy(() => import("./modal"));

export default function ShareWorkspaceModalLoader() {
  const isShareWorkspaceModalOpen = useStore(store => store.isShareWorkspaceModalOpen);
  const setIsShareWorkspaceModalOpen = useStore(store => store.setIsShareWorkspaceModalOpen);

  return (
    <Suspense fallback={null}>
      {isShareWorkspaceModalOpen && <ShareWorkspaceModal onClose={() => setIsShareWorkspaceModalOpen(false)} />}
    </Suspense>
  );
}
