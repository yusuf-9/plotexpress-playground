"use client";

import { Suspense, lazy } from "react";

// store
import { useStore } from "@/modules/playground/contexts/store.context";

// Lazy load the modal
const CreateChartModal = lazy(() => import("./modal"));

export default function CreateChartModalLoader() {
  const isCreateChartModalOpen = useStore(store => store.isChartEditorModalOpen);
  const setIsCreateChartModalOpen = useStore(store => store.setIsChartEditorModalOpen);

  return (
    <Suspense fallback={null}>
      {isCreateChartModalOpen && <CreateChartModal onClose={() => setIsCreateChartModalOpen(false)} />}
    </Suspense>
  );
}
