"use client";

import {
  ClipboardListIcon,
  ClipboardSignatureIcon,
  DatabaseIcon,
  Dumbbell,
  FileUser,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { NavDocuments } from "./NavDocuments";
import { NavMain } from "./NavMain";
import { NavSecondary } from "./NavSecondary";
import { NavUser } from "./NavUser";

const data = {
  user: {
    name: "João Guimarães",
    email: "joaovpsguimaraes@gmail.com",
    avatar: "https://github.com/Joaopsguimaraes.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Clientes",
      url: "/customer",
      icon: UsersIcon,
    },
    {
      title: "Protocolos",
      url: "/protocol",
      icon: ClipboardListIcon,
    },
    {
      title: "Anamneses",
      url: "/anamnese",
      icon: ClipboardSignatureIcon,
    },
    {
      title: "Arquivos",
      url: "/files",
      icon: FolderIcon,
    },
  ],

  navSecondary: [
    {
      title: "Configurações",
      url: "/settings",
      icon: SettingsIcon,
    },
    {
      title: "FAQ",
      url: "/faq",
      icon: HelpCircleIcon,
    },
  ],
  reports: [
    {
      name: "Dados registrados",
      url: "/reports/registers",
      icon: DatabaseIcon,
    },
    {
      name: "Protocolos",
      url: "/reports/protocol",
      icon: ClipboardListIcon,
    },
    {
      name: "Clientes",
      url: "/reports/customer",
      icon: FileUser,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" className="bg-primary" {...props}>
      <SidebarHeader className="bg-primary">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 bg-primary hover:bg-primary/90"
              variant="outline"
            >
              <Link href="/dashboard">
                <div className="flex items-center space-x-2">
                  <Dumbbell className="h-6 w-6 text-primary-foreground" />
                  <h1 className="text-xl font-bold text-primary-foreground">
                    Next Level
                  </h1>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-primary">
        <NavMain items={data.navMain} />
        <NavDocuments items={data.reports} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="bg-primary">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
