import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserProfile } from "@/components/UserProfile";
import GoogleAnalytics from "@/lib/google";
import HitWebCounter from "@/lib/pageCounter";
import React from "react";
import { ReactNode } from "react";

const MainFrame: React.FC<{ children?: ReactNode }> = ({ children }) => (
  <SidebarProvider>
    <AppSidebar />
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="text-foreground hover:text-primary" />
            <div>
              <h1 className="text-sm sm:text-xl font-bold text-foreground">
                LOC II Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Track and manage workspace
              </p>
            </div>
            <HitWebCounter />
            <GoogleAnalytics measurementId="G-8N2G3DQYW2" />
          </div>
          <UserProfile />
        </div>
      </header>

      {/* 👇 Render whatever is passed inside <MainFrame> */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  </SidebarProvider>
);

export default MainFrame;
