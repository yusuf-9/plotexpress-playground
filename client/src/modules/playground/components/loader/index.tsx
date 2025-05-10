import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// components
import LoadingOverlay from "@/common/components/loading-overlay";

// hooks
import { useDependencyInjector } from "../../contexts/dependency-injector.context";

// StoreProvider component
export const LoaderProvider = (props: PropsWithChildren) => {
  const { children } = props;

  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState<number>(10);
  const [loadingText, setLoadingText] = useState<string>('Loading..');

  const { appLoader } = useDependencyInjector();

  const handleLoadAppServices = useCallback(async () => {
    if (!appLoader || isAppLoaded) return;

    try {
      await appLoader.loadApp({
        onProgress: (percentage: number) => setLoadingPercentage(percentage),
        setLoadingText
      });
    } catch (error) {
      console.error("Failed to load workspace:", error);
      toast.error("Failed to load the workspace...", {
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsAppLoaded(true);
    }
  }, [appLoader, isAppLoaded]);

  useEffect(() => {
    handleLoadAppServices();
  }, [handleLoadAppServices]);

  return isAppLoaded ? children : <LoadingOverlay loadingPercentage={loadingPercentage} loadingText={loadingText} />;
};

export default LoaderProvider;
