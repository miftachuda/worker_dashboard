import { AppSidebar } from "@/components/AppSidebar";
import { DateSelector } from "@/components/DateSelector";
import ShiftSelector from "@/components/ShiftSelector";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserProfile } from "@/components/UserProfile";
import { format } from "date-fns";
import React, { useRef, useState } from "react";

const cards = Array.from({ length: 120 }, (_, i) => `Card ${i + 1}`);
const firstDate = new Date(6 - 8 - 2020);
const listshift = [
  ["A1 Malam", "B2 Pagi", "C3 Sore", "D Off Malam"],
  ["A2 Malam", "B3 Pagi", "D1 Sore", "C Off Sore"],
  ["A3 Malam", "C1 Pagi", "D2 Sore", "B Off Pagi"],
  ["B1 Malam", "C2 Pagi", "D3 Sore", "A Off Malam"],
  ["B2 Malam", "C3 Pagi", "A1 Sore", "D Off Sore"],
  ["B3 Malam", "D1 Pagi", "A2 Sore", "C Off Pagi"],
  ["C1 Malam", "D2 Pagi", "A3 Sore", "B Off Malam"],
  ["C2 Malam", "D3 Pagi", "B1 Sore", "A Off Sore"],
  ["C3 Malam", "A1 Pagi", "B2 Sore", "D Off Pagi"],
  ["D1 Malam", "A2 Pagi", "B3 Sore", "C Off Malam"],
  ["D2 Malam", "A3 Pagi", "C1 Sore", "B Off Sore"],
  ["D3 Malam", "B1 Pagi", "C2 Sore", "A Off Pagi"],
];

function getShiftList(date: Date) {
  const diffTime = Math.abs(date.getTime() - firstDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return listshift[diffDays % listshift.length];
}
const chunkCards = (arr: string[], size: number, selectedDate: Date) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

export default function Shift() {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const shiftArray = chunkCards(cards, 4, new Date());
  // Update scroll button visibility
  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (el) {
      setShowLeft(el.scrollLeft > 0);
      setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }
  };

  // Scroll handler
  const scrollBy = (dx: number) => {
    const el = scrollRef.current;
    if (el) {
      el.scrollBy({ left: dx, behavior: "smooth" });
    }
  };

  React.useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
    // eslint-disable-next-line
  }, []);

  function addDays(today: Date, days: number): Date {
    const result = new Date(today);
    result.setDate(result.getDate() + days);
    return result;
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      {/* Full height container, no body scroll */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header fixed at the top */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm z-40 flex items-center justify-between px-6">
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
        </header>

        {/* Main area takes rest of height */}
        <main className="flex-1 bg-[#f5f6fa] p-8 overflow-hidden">
          <div className="flex items-center  space-x-4 mb-2">
            <DateSelector value={selectedDate} onChange={setSelectedDate} />

            <ShiftSelector></ShiftSelector>
          </div>
          <div className="relative w-full h-[40vh] max-h-[40vh]">
            {/* Floating scroll buttons */}
            {showLeft && (
              <button
                onClick={() => scrollBy(-180)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 
                       bg-green-300 text-white w-10 h-10 rounded-xl shadow 
                       flex items-center justify-center text-2xl font-bold"
              >
                ←
              </button>
            )}
            {showRight && (
              <button
                onClick={() => scrollBy(180)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 
                       bg-green-300 text-white w-10 h-10 rounded-xl shadow 
                       flex items-center justify-center text-2xl font-bold"
              >
                →
              </button>
            )}

            {/* 🔑 This is the ONLY scrollable part */}
            <div
              ref={scrollRef}
              className="flex gap-2 h-[40vh] max-h-[40vh] overflow-x-auto overflow-y-hidden items-start px-2"
              style={{ scrollbarWidth: "thin" }}
            >
              {Array.from({ length: 120 }).map((_, colIdx) => {
                const shiftCol = getShiftList(addDays(selectedDate, colIdx));
                return (
                  <div key={colIdx} className="flex flex-col items-center">
                    <div className="text-xs font-semibold mb-1 text-center min-w-[60px] text-black">
                      {format(addDays(selectedDate, colIdx), "dd MMM yy")}
                    </div>
                    {shiftCol.map((shift, rowIdx) => {
                      return (
                        <div
                          key={rowIdx}
                          className="w-[60px] h-[60px] bg-white rounded-lg shadow flex text-orange-500 items-center justify-center font-medium text-sm mb-1"
                        >
                          {shift}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
