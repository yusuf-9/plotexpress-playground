import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// components
import LoadingOverlay from "@/common/components/loading-overlay";

// hooks
import { useDependencyInjector } from "../../contexts/dependency-injector.context";

// StoreProvider component
export const LoaderProvider = (props: PropsWithChildren) => {
  const { children} = props;

  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState<number>(10);

  const { appLoader } = useDependencyInjector();

  const handleLoadAppServices = useCallback(async () => {
    if (!appLoader || isAppLoaded) return;

    try {
      await appLoader.loadCachedFilesAndCharts({
        onProgress: (percentage: number) => setLoadingPercentage(percentage),
      });
      setIsAppLoaded(true)
    } catch (error) {
      console.error("Failed to load workspace:", error);
      toast.error("Failed to load the workspace. Please reload the page.", {
        description: error instanceof Error ? error.message : "Something went wrong",
      })
    }
  }, [appLoader, isAppLoaded]);

  useEffect(() => {
    handleLoadAppServices();
  }, [handleLoadAppServices]);

  return isAppLoaded ? children : <LoadingOverlay loadingPercentage={loadingPercentage} />;
};

export default LoaderProvider;
