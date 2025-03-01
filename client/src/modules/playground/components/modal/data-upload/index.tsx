import { Suspense, lazy } from "react";

// store
import { useStore } from "@/modules/playground/contexts/store.context";

// Lazy load the modal
const DataUploadModal = lazy(() => import("./modal"));

export default function DataUploadModalLoader() {
  const isDataUploadModalOpen = useStore(store => store.isDataUploadModalOpen);
  const setIsDataUploadModalOpen = useStore(store => store.setIsDataUploadModalOpen);

  return (
    <Suspense fallback={null}>
      {isDataUploadModalOpen && <DataUploadModal onClose={() => setIsDataUploadModalOpen(false)} />}
    </Suspense>
  );
}
