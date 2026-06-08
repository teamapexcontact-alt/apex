"use client";

import { type ReactNode } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SmoothScroll } from "@/components/providers/SmoothScroll";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <SmoothScroll>{children}</SmoothScroll>
    </ErrorBoundary>
  );
}
