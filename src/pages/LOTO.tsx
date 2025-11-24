import React, { useEffect, useState } from "react";
import MainFrame from "./MainFrame";
import { pb } from "@/lib/pocketbase";

const LOTO: React.FC = () => {
  const user = pb.authStore.model;

  return (
    <MainFrame>
      <main className="p-4 space-y-4">
        <h1 className="text-xl font-bold">LOTO</h1>
      </main>
    </MainFrame>
  );
};

export default LOTO;
