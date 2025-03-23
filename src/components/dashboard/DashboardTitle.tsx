"use client";

import { useLoadingAnimations } from "@/hooks/use-loading-animations";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChartArea, FilePlus, UserRoundPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "../ui/card";

export function DashboardTitle() {
  const router = useRouter();
  const { isLoading } = useLoadingAnimations();

  return (
    <Card
      className={cn(
        "flex  flex-row px-4 items-center justify-between transform transition-all duration-500 delay-100",
        isLoading ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
      )}
    >
      <CardTitle
        className={cn(
          "transform inline-flex items-center gap-1 transition-all duration-500 delay-100 text-2xl font-bold tracking-tight",
          isLoading ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
        )}
      >
        <ChartArea className="size-5" />
        Dashboard
      </CardTitle>
      <div
        className={cn(
          "flex space-x-2 transform transition-all duration-500 delay-100",
          isLoading ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
        )}
      >
        <Button onClick={() => router.push("/customers/new")}>
          <UserRoundPlus className="mr-2 h-4 w-4" /> Adicionar cliente
        </Button>
        <Button onClick={() => router.push("/protocols/new")}>
          <FilePlus className="mr-2 h-4 w-4" /> Novo protocolo
        </Button>
      </div>
    </Card>
  );
}
