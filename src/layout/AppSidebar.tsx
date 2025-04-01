"use client";

import {
  ClipboardListIcon,
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
      url: "/customers",
      icon: UsersIcon,
    },
    {
      title: "Protocolos",
      url: "/protocols",
      icon: ClipboardListIcon,
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
      url: "/reports/protocols",
      icon: ClipboardListIcon,
    },
    {
      name: "Clientes",
      url: "/reports/customers",
      icon: FileUser,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <div className="flex items-center space-x-2">
                  <Dumbbell className="h-6 w-6 text-primary" />
                  <h1 className="text-xl font-bold text-primary">Next Level</h1>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.reports} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
