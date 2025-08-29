import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserProfile } from "@/components/UserProfile";
import React from "react";

const Report: React.FC = () => (
  <SidebarProvider>
    <AppSidebar />
    <div className="flex-1 flex flex-col">
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="text-foreground hover:text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Worker Monitoring Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Track and manage workforce
              </p>
            </div>
          </div>
          <UserProfile />
        </div>
      </header>
      <main>Main Content</main>
    </div>
  </SidebarProvider>
);

export default Report;
