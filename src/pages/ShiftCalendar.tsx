import { DateSelector } from "@/components/DateSelector";
import ShiftSelector from "@/components/ShiftSelector";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import React, { useRef, useState } from "react";
import MainFrame from "./MainFrame";
import ModeSelector from "@/components/ModeSelector";
import { getShiftList, getShiftList2 } from "../lib/shift";

export default function Shift() {
  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    1 // hour, minute, second
  );
  const [selectedDate, setSelectedDate] = React.useState<Date>(startOfDay);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
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
  const [selectedShift, setSelectedShift] = useState("A");
  const [selectedMode, setSelectedMode] = useState("Mode 1");
  return (
    <MainFrame>
      <main className="flex-1 bg-[#f5f6fa] p-8 overflow-hidden">
        <div className="flex items-center  space-x-4 mb-2">
          <DateSelector value={selectedDate} onChange={setSelectedDate} />

          <ShiftSelector
            selectedShift={selectedShift}
            onShiftChange={setSelectedShift}
          />
          <ModeSelector
            selectedMode={selectedMode}
            onModeChange={setSelectedMode}
          />
        </div>
        <div className="relative w-full h-[43vh] max-h-[43vh]">
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
            className="flex gap-2 h-[43vh] max-h-[43vh] overflow-x-auto overflow-y-hidden items-start px-2"
            style={{ scrollbarWidth: "thin" }}
          >
            {Array.from({ length: 120 }).map((_, colIdx) => {
              const day = addDays(selectedDate, colIdx);
              if (selectedMode === "Mode 1") {
                var shiftCol = getShiftList(day);
              } else {
                var shiftCol = getShiftList2(day);
              }
              return (
                <div key={colIdx} className="flex flex-col items-center">
                  <div className="text-xs font-semibold mb-1 text-center min-w-[60px] text-black">
                    {format(day, "dd MMM yy")}
                  </div>
                  <div className="text-xs font-semibold mb-1 text-center min-w-[60px] text-black">
                    {format(day, "EEEE", { locale: id })}
                  </div>
                  {shiftCol.map((shift, rowIdx) => {
                    var prop = "bg-none";
                    var textColorA = "text-white";
                    var textColorB = "text-white";
                    var textColorC = "text-white";
                    var textColorD = "text-white";
                    if (selectedShift == shift.slice(0, 1)) {
                      prop = "";
                      textColorA = "text-white";
                      textColorB = "text-white";
                      textColorC = "text-white";
                      textColorD = "text-white";
                    } else {
                      textColorA = "text-purple-400";
                      textColorB = "text-orange-400";
                      textColorC = "text-blue-400";
                      textColorD = "text-lime-400";
                    }
                    if (
                      shift.split(" ")[1] == "Off" &&
                      selectedMode == "Mode 2"
                    ) {
                      var overlayColor = "rgba(0,0,0,0.5)";
                    }
                    if (
                      shift.split(" ")[1] == "Off" &&
                      selectedMode == "Mode 1"
                    ) {
                      var overlayColor = "rgba(0,0,128,0.3)";
                    }
                    return (
                      <div
                        key={rowIdx}
                        style={
                          {
                            "--overlay-color": overlayColor,
                          } as React.CSSProperties
                        }
                        className={`w-[60px] h-[60px] rounded-xl flex items-center justify-center font-medium text-sm mb-1 relative overflow-hidden ${prop} 
                              ${
                                shift.startsWith("A")
                                  ? `${textColorA} bg-[linear-gradient(90deg,_#8e2de2_0%,_#4a00e0_50%,_#4159d0_100%)] shadow-[0_0_20px_#92FE9D] before:bg-green-500/40`
                                  : shift.startsWith("B")
                                  ? `${textColorB} bg-[linear-gradient(90deg,_#ff7e5f_0%,_#feb47b_50%,_#ff416c_100%)] before:bg-red-500/40`
                                  : shift.startsWith("C")
                                  ? `${textColorC} bg-[linear-gradient(90deg,#00d2ff_0%,#3a47d5_100%)] shadow-[0_0_20px_#3a47d5] before:bg-blue-400/40`
                                  : `${textColorD} bg-[linear-gradient(90deg,#f8ff00_0%,#3ad59f_100%)] shadow-[0_0_20px_#3ad59f] before:bg-yellow-400/40 `
                              } 
                              before:content-[''] before:absolute before:inset-0 before:rounded-xl before:p-[2px] before:-z-10 before:blur-md bg-gray-600
                            `}
                      >
                        <div className="flex flex-col">
                          <div className="z-10 text-center px-1 font-extrabold">
                            {shift.slice(0, 2)}
                          </div>
                          <div className="z-10 text-center px-1 font-extralight text-[10px]">
                            {shift.slice(2, shift.length)}
                          </div>
                        </div>
                        <div
                          className="absolute inset-0 rounded-xl"
                          style={{ backgroundColor: "var(--overlay-color)" }}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </MainFrame>
  );
}
