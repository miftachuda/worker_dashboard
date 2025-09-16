import { RowHead } from "@/types/RowHead";
import { useCallback, useEffect, useState } from "react";

const masukapaA = [
  "Off",
  "S1",
  "S2",
  "S3",
  "Off",
  "P1",
  "P2",
  "P3",
  "Off",
  "M1",
  "M2",
  "M3",
];
const masukapaH = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];
const headerStyles = {
  Off: {
    color: "#ff4564",
    backgroundColor: "#053F20",
  },
  Sabtu: {
    color: "#ff4564",
    backgroundColor: "#053F20",
  },
  Minggu: {
    color: "#ff4564",
    backgroundColor: "#053F20",
  },
  S1: {},
  S2: {},
  S3: {},
  P1: {},
  P2: {},
  P3: {},
  M1: {},
  M2: {},
  M3: {},
};
const defaultStyle = {};

type TableProps<T> = {
  data: RowHead[];
  columns: { key: keyof T; header: string }[];
  year: number;
  month: number; // 1–12
  onSelectionChange: Function;
  shift: string;
};

function Table<T>({
  data,
  columns,
  year,
  month,
  onSelectionChange,
  shift,
}: TableProps<T>) {
  const [isDragging, setIsDragging] = useState(false);
  const [startCell, setStartCell] = useState(null); // { row: number, col: number }
  const [endCell, setEndCell] = useState(null);

  const handleMouseDown = (rowIndex, colIndex) => {
    // We only want to select the date columns, not "No" or "Nama"
    if (colIndex < 2) return;
    setIsDragging(true);
    const cell = { row: rowIndex, col: colIndex };
    setStartCell(cell);
    setEndCell(cell);
  };

  // MouseOver: Updates the selection area while dragging
  const handleMouseOver = (rowIndex, colIndex) => {
    if (isDragging) {
      // Prevent selection from spilling into the first two columns
      if (colIndex < 2) return;
      setEndCell({ row: rowIndex, col: colIndex });
    }
  };

  // MouseUp: Finalizes the selection and triggers the callback
  const handleMouseUp = useCallback(() => {
    if (isDragging && startCell && endCell) {
      const selectedCoords = [];
      // Determine the boundaries of the selection rectangle
      const minRow = Math.min(startCell.row, endCell.row);
      const maxRow = Math.max(startCell.row, endCell.row);
      const minCol = Math.min(startCell.col, endCell.col);
      const maxCol = Math.max(startCell.col, endCell.col);

      // Collect all coordinates within the selection
      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          const day = col - 1;
          const name = data[row].name;
          selectedCoords.push({
            name,
            shift,
            day,
            month,
            year,
            rowData: data[row],
          });
        }
      }

      // Pass the final coordinates to the parent component
      if (onSelectionChange) {
        onSelectionChange(selectedCoords);
      }
    }

    // Reset state to end the drag selection
    setIsDragging(false);
    setStartCell(null);
    setEndCell(null);
  }, [isDragging, startCell, endCell, data, onSelectionChange]);

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseUp]);
  const isCellSelected = (rowIndex, colIndex) => {
    if (!isDragging || !startCell || !endCell) return false;
    const minRow = Math.min(startCell.row, endCell.row);
    const maxRow = Math.max(startCell.row, endCell.row);
    const minCol = Math.min(startCell.col, endCell.col);
    const maxCol = Math.max(startCell.col, endCell.col);
    return (
      rowIndex >= minRow &&
      rowIndex <= maxRow &&
      colIndex >= minCol &&
      colIndex <= maxCol
    );
  };
  function getIndex(colIndex: number, firstDate: Date): string {
    const date = new Date(year, month - 1, colIndex - 1);
    const diffTime = date.getTime() - firstDate.getTime();
    const index = Math.floor(diffTime / (1000 * 60 * 60 * 24)) % 12;
    return masukapaA[index] || "";
  }
  function findShift(colIndex: number, shift: string): string {
    var firstDate = new Date("2022-12-31");
    if (colIndex === 0 || colIndex === 1) {
      return "";
    } else {
      if (shift == "Shift A") {
        return getIndex(colIndex, firstDate);
      } else if (shift == "Shift B") {
        firstDate.setDate(firstDate.getDate() + 3);
        return getIndex(colIndex, firstDate);
      } else if (shift == "Shift C") {
        firstDate.setDate(firstDate.getDate() + 6);
        return getIndex(colIndex, firstDate);
      } else if (shift == "Shift D") {
        firstDate.setDate(firstDate.getDate() + 9);
        return getIndex(colIndex, firstDate);
      } else {
        const date = new Date(year, month - 1, colIndex - 1);
        const diffTime = date.getTime() - new Date("2023-01-01").getTime();
        const index = Math.floor(diffTime / (1000 * 60 * 60 * 24)) % 7;
        return masukapaH[index] || "";
      }
    }
  }

  return (
    <div className="w-full select-none">
      <div className="overflow-x-auto sm:overflow-x-visible">
        <table className="table-auto w-full min-w-full border-separate border-spacing-0 rounded-lg">
          <thead className="bg-gray-900">
            {/* This is your original header rendering logic */}
            <tr>
              {columns.map((col, colIndex) => {
                if (colIndex === 0 || colIndex === 1) {
                  const date = new Date(year, month, colIndex);
                  return (
                    <th
                      key={String(col.key)}
                      rowSpan={2}
                      className="px-1 py-1 text-center text-sm font-semibold border-b"
                    >
                      {col.header}
                    </th>
                  );
                }
                return (
                  <th
                    key={String(col.key)}
                    className="px-1 py-1 text-center text-sm font-semibold border-b"
                  >
                    {col.header}
                  </th>
                );
              })}
            </tr>
            <tr>
              {columns.map((col, colIndex) => {
                if (colIndex < 2) return null;
                const shiftHeader = findShift(colIndex, shift);

                return (
                  <th
                    key={`${String(col.key)}-row2`}
                    className="px-1 py-1 text-center text-xs font-semibold border-b border-gray-600"
                  >
                    {shiftHeader.slice(0, 3)}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="border border-s-green-300">
            {data.length > 0 ? (
              data
                .slice()
                .sort((a, b) => b.PRL - a.PRL)
                .map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-blue-950">
                    {columns.map((col, colIndex) => {
                      const shiftHeader = findShift(colIndex, shift);
                      const isSelected = isCellSelected(rowIndex, colIndex);
                      const cellClasses = `
                                                px-1 py-1 text-center whitespace-nowrap text-sm border border-gray-700
                                                transition-colors duration-100

                                                ${
                                                  colIndex > 1
                                                    ? "cursor-cell"
                                                    : "cursor-default"
                                                }
                                            `;
                      return (
                        <td
                          key={`${rowIndex}-${colIndex}`}
                          className={cellClasses}
                          onMouseDown={() =>
                            handleMouseDown(rowIndex, colIndex)
                          }
                          onMouseOver={() =>
                            handleMouseOver(rowIndex, colIndex)
                          }
                          style={{
                            ...(headerStyles[shiftHeader] || defaultStyle), // Apply the base styles first
                            ...(isSelected && {
                              backgroundColor: "#2563eb",
                              color: "white",
                            }),
                            width:
                              colIndex === 1
                                ? "12%"
                                : `${70 / (columns.length - 1)}%`, // Apply your specific width, which will override any width from the base styles
                          }}
                        >
                          {col.key === "id"
                            ? rowIndex + 1
                            : col.header === "Nama"
                            ? String(row.name)
                            : ""}
                        </td>
                      );
                    })}
                  </tr>
                ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-2 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
