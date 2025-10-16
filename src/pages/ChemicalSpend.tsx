import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserProfile } from "@/components/UserProfile";
import React from "react";
import MainFrame from "./MainFrame";

const ChemicalSpend: React.FC = () => (
  <MainFrame>
    <main>Chemical Spend in Progress</main>
  </MainFrame>
);

export default ChemicalSpend;
