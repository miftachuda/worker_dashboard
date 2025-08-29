import { useState } from "react";
import {
  Users,
  BarChart3,
  Settings,
  Home,
  Calendar,
  FileText,
  Bell,
  Plus,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Main", url: "/", icon: Home },
  { title: "Workers", url: "/workers", icon: Users },
  { title: "Leaves", url: "/leaves", icon: BarChart3 },
  { title: "Shift Cal", url: "/shift", icon: Calendar },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Notifications", url: "/notifications", icon: Bell },
];

const adminItems = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Add Feature", url: "/add-feature", icon: Plus },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  // const getNavCls = ({ isActive }: { isActive: boolean }) =>
  // `flex items-center p-2 rounded-md transition-colors ${
  //   isActive
  //     ? "bg-primary text-white"
  //     : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
  // }`;
  // const getNavCls = ({ isActive }: { isActive: boolean }) =>
  //   `flex items-center p-2 rounded-md transition-colors ${
  //     isActive
  //       ? "bg-primary text-muted-foreground hover:bg-accent hover:text-accent-foreground"
  //       : "text-muted-foreground hover:bg-grey-700"
  //   }`;
  return (
    <Sidebar
      className={`${
        collapsed ? "w-16" : "w-64"
      } transition-all duration-300 border-r border-border`}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar">
        {/* Logo/Brand */}
        <div className="p-4 border-b border-border">
          {!collapsed ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">
                Lube Oil Complex II
              </span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "hidden" : ""}>
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink to={item.url} end>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        className={`flex items-center p-2 rounded-md transition-colors ${
                          isActive
                            ? "bg-primary text-gray-900 hover:bg-accent hover:text-gray-600"
                            : "text-muted-foreground hover:bg-grey-700"
                        }`}
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon
                          className={`h-5 w-5 ${
                            collapsed ? "mx-auto" : "mr-3"
                          }`}
                        />
                        {!collapsed && (
                          <span className="font-medium">{item.title}</span>
                        )}
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "hidden" : ""}>
            Admin
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink to={item.url} end>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        className={`flex items-center p-2 rounded-md transition-colors ${
                          isActive
                            ? "bg-primary text-gray-900 hover:bg-accent hover:text-gray-900"
                            : "text-muted-foreground hover:bg-grey-700"
                        }`}
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon
                          className={`h-5 w-5 ${
                            collapsed ? "mx-auto" : "mr-3"
                          }`}
                        />
                        {!collapsed && (
                          <span className="font-medium">{item.title}</span>
                        )}
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
