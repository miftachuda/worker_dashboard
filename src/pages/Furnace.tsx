import React, { useEffect, useState } from "react";
import MainFrame from "./MainFrame";
import { pb } from "@/lib/pocketbase";

const Furnace: React.FC = () => {
  const user = pb.authStore.model;
  return (
    <MainFrame>
      <main className="p-4 space-y-4">
        <iframe
          src="https://furnace.miftachuda.my.id/"
          style={{ width: "100%", height: "100vh", border: "none" }}
          title="Furnace App"
          allow="fullscreen"
        />
      </main>
    </MainFrame>
  );
};

export default Furnace;
