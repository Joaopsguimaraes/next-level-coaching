import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { AnimationContainer } from "./Animation";
import { AppSidebar } from "./AppSidebar";
import { SiteHeader } from "./SiteHeader";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayoutProvider = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex-1 overflow-auto bg-accent">
          <AnimationContainer>{children}</AnimationContainer>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
