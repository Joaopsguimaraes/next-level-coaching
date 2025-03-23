import React from "react";
import { Dumbbell, Users, ClipboardList, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ModeToggle } from "@/components/ModeToggle";
import { AnimationContainer } from "./Animation";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayoutProvider = ({ children }: AppLayoutProps) => {
  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/customers", label: "Clientes", icon: Users },
    { path: "/protocols", label: "Protocolos", icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="shadow-sm border-b animate-fade-in dark:bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">Next Level</h1>
          </div>
          <ModeToggle />
        </div>
      </header>

      <div className="flex-1 flex">
        <aside className="w-64  border-r bg-card hidden md:block animate-slide-in-left">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                  false
                    ? // item.path === item.path
                      "bg-background text-primary font-medium"
                    : "text-foreground hover:bg-primary hover:text-background"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 overflow-auto bg-zinc-50 dark:bg-card">
          <AnimationContainer>{children}</AnimationContainer>
        </main>
      </div>
    </div>
  );
};
