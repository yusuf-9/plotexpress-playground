import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "../ui/button";

interface Props {
  children: ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  isResetting?: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    isResetting: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      isResetting: false,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error);
    console.error("Error info:", errorInfo);
  }

  private handleReset = () => {
    this.setState({ isResetting: true });
    setTimeout(() => {
      this.setState({ hasError: false, error: undefined, isResetting: false });
    }, 1000);
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 border border-destructive rounded-sm">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-destructive font-bold text-2xl">Something went wrong</h1>
            <p className="text-base text-destructive font-normal">{this.state.error?.message}</p>
          </div>
          {this.state.isResetting ? (
             <Button
              variant={"ghost"}
              onClick={this.handleReset}
              disabled
            >
                Resetting...
            </Button>
          ) : (
            <Button
              variant={"ghost"}
              onClick={this.handleReset}
            >
              Reset state
            </Button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
