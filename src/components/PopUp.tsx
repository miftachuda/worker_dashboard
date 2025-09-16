import { Cell } from "@/types/Cell";
import React from "react";

type PopupDialogProps = {
  isOpen: boolean;
  selected?: Cell[];
  onClose: () => void;
};
type GroupedCells = {
  name: string;
  items: Cell[];
};

function groupByNameToArray(cells: Cell[] | undefined | null): GroupedCells[] {
  if (!Array.isArray(cells)) return []; // protect against non-array
  const map = new Map<string, Cell[]>();

  for (const cell of cells) {
    if (!map.has(cell.name)) {
      map.set(cell.name, []);
    }
    map.get(cell.name)!.push(cell);
  }

  return Array.from(map, ([name, items]) => ({ name, items }));
}
const PopupDialog: React.FC<PopupDialogProps> = ({
  isOpen,
  selected,
  onClose,
}) => {
  if (!isOpen) return null; // don’t render if not open
  const record = groupByNameToArray(selected);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-80 text-center">
        {record.map((group) => (
          <div key={group.name} className="mb-4 p-2 border rounded">
            <h3 className="text-slate-900 font-bold text-lg">{group.name}</h3>
            <div className="pl-4">
              {group.items.map((cell) => (
                <div
                  key={cell.name}
                  className="text-slate-900 text-left text-sm"
                >
                  {cell.day} - {cell.month}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PopupDialog;
