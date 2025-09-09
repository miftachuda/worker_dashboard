import { DateSelector } from "@/components/DateSelector";
import ShiftSelector from "@/components/ShiftSelector";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import React, { useRef, useState } from "react";
import MainFrame from "./MainFrame";
import ModeSelector from "@/components/ModeSelector";
import { getShiftList, getShiftList2 } from "../lib/shift";
import { findHariLiburByDate, HariLibur, loadHariLibur } from "@/lib/libur";
import { Employee } from "../types/Employee";

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
  const [holidays, setHolidays] = useState<HariLibur[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [worker, setWorker] = useState<Employee[]>([]);

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
      <main className="flex-1 bg-[#f5f6fa] p-2 overflow-hidden">
        <div className="flex items-center  flex-col md:flex-row gap-1 space-x-2 mb-2">
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
        <div className="relative w-full h-auto  max-h-full sm:h-[53vh] sm:max-h-[53vh]">
          {/* Floating scroll buttons */}
          {showLeft && (
            <button
              onClick={() => scrollBy(-180)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 
                       bg-green-300 text-white w-10 h-10 rounded-xl shadow 
                       items-center justify-center text-2xl font-bold hidden sm:flex"
            >
              ←
            </button>
          )}
          {showRight && (
            <button
              onClick={() => scrollBy(180)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 
                       bg-green-300 text-white w-10 h-10 rounded-xl shadow 
                       items-center justify-center text-2xl font-bold hidden sm:flex"
            >
              →
            </button>
          )}

          {/* 🔑 This is the ONLY scrollable part */}
          <div
            ref={scrollRef}
            className="flex flex-col items-center sm:flex-row gap-2 h-auto  max-h-full sm:h-[53vh] sm:max-h-[53vh] overflow-x-hidden overflow-y-auto sm:overflow-x-auto sm:overflow-y-hidden sm:items-start px-2"
            style={{ scrollbarWidth: "thin" }}
          >
            {Array.from({ length: 120 }).map((_, colIdx) => {
              const day = addDays(selectedDate, colIdx);
              if (selectedMode === "Mode 1") {
                var shiftCol = getShiftList(day);
              } else {
                var shiftCol = getShiftList2(day);
              }
              const tanggal_merah = holidays
                ? findHariLiburByDate(day, holidays)
                : null;
              const hari = format(day, "EEEE", { locale: id });
              return (
                <div
                  key={colIdx}
                  className={`flex flex-col items-center justify-center w-auto ${
                    tanggal_merah || hari === "Sabtu" || hari === "Minggu"
                      ? "bg-red-500/50 rounded-sm"
                      : "bg-green-300/30 rounded-sm"
                  }`}
                >
                  <div className="flex flex-row sm:flex-col gap-x-1 gap-y-0">
                    <div className="text-[10px] sm:text-[9px] font-semibold sm:font-normal text-center  text-black">
                      {hari}
                    </div>
                    <div className="text-[10px] font-semibold text-center  text-black">
                      {format(day, "dd MMM yy")}
                    </div>
                  </div>
                  <div
                    className={`text-[6px] z-10 w-full min-h-7 font-semibold py-1 mb-1 text-center text-black 
                       ${tanggal_merah ? "bg-red-400" : "bg-none"}`}
                  >
                    {tanggal_merah?.event_name ?? ""}
                  </div>
                  <div className="flex z-0 flex-row mx-3 sm:mx-1 sm:flex-col w-auto gap-5">
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
                        <div className="relative group" key={rowIdx}>
                          <div
                            style={
                              {
                                "--overlay-color": overlayColor,
                              } as React.CSSProperties
                            }
                            className={`w-[60px] h-[60px] rounded-xl flex flex-col items-center justify-center font-medium text-sm mb-1 relative overflow-hidden cursor-pointer ${prop} 
                                ${
                                  shift.startsWith("A")
                                    ? `${textColorA} bg-[linear-gradient(90deg,_#8e2de2_0%,_#4a00e0_50%,_#4159d0_100%)] shadow-[0_0_20px_#92FE9D] before:bg-green-500/40`
                                    : shift.startsWith("B")
                                    ? `${textColorB} bg-[linear-gradient(90deg,_#ff7e5f_0%,_#feb47b_50%,_#ff416c_100%)] before:bg-red-500/40`
                                    : shift.startsWith("C")
                                    ? `${textColorC} bg-[linear-gradient(90deg,#00d2ff_0%,#3a47d5_100%)] shadow-[0_0_20px_#3a47d5] before:bg-blue-400/40`
                                    : `${textColorD} bg-[linear-gradient(90deg,#f8ff00_0%,#3ad59f_100%)] shadow-[0_0_20px_#3ad59f] before:bg-yellow-400/40`
                                } 
                                before:content-[''] before:absolute before:inset-0 before:rounded-xl before:p-[2px] before:-z-10 before:blur-md bg-gray-600
                              `}
                          >
                            <div className="flex flex-col z-10">
                              <div className="text-center px-1 font-extrabold">
                                {shift.slice(0, 2)}
                              </div>
                              <div className="text-center px-1 font-extralight text-[10px]">
                                {shift.slice(2)}
                              </div>
                            </div>

                            <div
                              className="absolute inset-0 rounded-xl"
                              style={{
                                backgroundColor: "var(--overlay-color)",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </MainFrame>
  );
}
