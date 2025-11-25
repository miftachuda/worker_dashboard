import React, { useEffect, useState } from "react";
import MainFrame from "./MainFrame";
import { pb } from "@/lib/pocketbase";
import DashboardPage from "@/components/loto/LotoPage";

const LOTO: React.FC = () => {
  const user = pb.authStore.model;

  return (
    <MainFrame>
      <main className="p-4 space-y-4">
        <DashboardPage />
      </main>
    </MainFrame>
  );
};

export default LOTO;
