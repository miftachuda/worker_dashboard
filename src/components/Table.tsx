import { RowHead } from "@/types/RowHead";
import { useCallback, useEffect, useState } from "react";
const firstDate = new Date("2022-12-31");
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

type TableProps<T> = {
  data: RowHead[];
  columns: { key: keyof T; header: string }[];
  year: number;
  month: number; // 1–12
  onSelectionChange: Function;
};

function Table<T>({
  data,
  columns,
  year,
  month,
  onSelectionChange,
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
          selectedCoords.push({ row, col, rowData: data[row] });
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

  return (
    <div className="w-full">
      <div className="overflow-x-auto sm:overflow-x-visible">
        <table className=" table-auto w-full min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-900">
            <tr>
              {columns.map((col, colIndex) => {
                if (colIndex === 0 || colIndex === 1) {
                  // Kolom 1 dan 2 digabung dengan rowspan
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
                if (colIndex === 0 || colIndex === 1) {
                  // Kolom 1 & 2 tidak usah diulang karena sudah digabung
                  return null;
                }

                // Kolom lain tetap tampil di baris kedua
                else {
                  const date = new Date(year, month - 1, colIndex - 1);
                  const diffTime = date.getTime() - firstDate.getTime();
                  const index =
                    Math.floor(diffTime / (1000 * 60 * 60 * 24)) % 12;
                  return (
                    <th
                      key={String(col.key) + "-row2"}
                      className="px-1 py-1 text-center text-sm font-semibold border-b"
                    >
                      {masukapaA[index]}
                    </th>
                  );
                }
              })}
            </tr>
          </thead>
          <tbody className="border border-s-green-300">
            {data.length > 0 ? (
              data
                .slice() // 1. Create a shallow copy to avoid mutating the original array
                .sort((a, b) => b.PRL - a.PRL)
                .map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-blue-950 ">
                    {columns.map((col, colIndex) => (
                      <td
                        key={String(col.key)}
                        className="px-1 py-1 text-center whitespace-nowrap text-sm border-green-400 border"
                        style={{
                          width:
                            colIndex === 1
                              ? "12%" // kolom ke-2
                              : `${70 / (columns.length - 1)}%`, // sisanya dibagi rata
                        }}
                      >
                        {col.key === "id"
                          ? rowIndex + 1
                          : col.header === "Nama"
                          ? String(row.name)
                          : ""}
                      </td>
                    ))}
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
