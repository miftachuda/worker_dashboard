import { useEffect, useRef } from "react";
import { Employee } from "../../types/Employee";

interface WorkerPopupProps {
  shift: string;
  workers: Employee[];
  anchor: { x: number; y: number };
  onClose: () => void;
}

export default function WorkerPopup({
  shift,
  workers,
  anchor,
  onClose,
}: WorkerPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  // ✅ Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* dark backdrop */}
      <div className="absolute inset-0 bg-black/20" />

      {/* anchored popup */}
      <div
        ref={popupRef}
        style={{
          position: "absolute",
          top: anchor.y + 10, // little offset
          left: anchor.x,
        }}
        className="bg-white rounded-xl shadow-lg p-3 w-[250px] max-h-[250px] overflow-y-auto"
      >
        <h2 className="font-bold mb-2 text-sm">Workers on Shift {shift}</h2>
        {workers.length > 0 ? (
          workers.map((w, i) => (
            <div
              key={i}
              className="cursor-default px-1 py-0.5 hover:bg-gray-100 rounded"
            >
              {w.Nama}
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-sm italic">No workers</div>
        )}
      </div>
    </div>
  );
}
