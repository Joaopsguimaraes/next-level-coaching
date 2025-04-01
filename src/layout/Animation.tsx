"use client";

import { useLoadingAnimations } from "@/hooks/use-loading-animations";
import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export function AnimationContainer({ children }: PropsWithChildren) {
  const { isLoading } = useLoadingAnimations();

  return (
    <div
      className={cn(
        "flex-1 p-5 overflow-auto",
        isLoading ? "opacity-0" : "opacity-100 animate-fade-in"
      )}
    >
      {children}
    </div>
  );
}
