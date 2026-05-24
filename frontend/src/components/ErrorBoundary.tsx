'use client';
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props { children?: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-900/50 text-red-200 rounded-lg m-4 border border-red-700 font-mono text-sm whitespace-pre-wrap">
          <h2>Something went wrong.</h2>
          <details>
            <summary>Error details</summary>
            {this.state.error?.toString()}
            <br />
            {this.state.error?.stack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}
