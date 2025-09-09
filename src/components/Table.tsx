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
  data: T[];
  columns: { key: keyof T; header: string }[];
  year: number;
  month: number; // 1–12
};

function Table<T>({ data, columns, year, month }: TableProps<T>) {
  console.log(year, month);
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
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-blue-950 ">
                  {columns.map((col, colIndex) => (
                    <td
                      key={String(col.key)}
                      className="px-1 py-1 whitespace-nowrap text-sm border-green-400 border"
                      style={{
                        width:
                          colIndex === 1
                            ? "12%" // kolom ke-2
                            : `${70 / (columns.length - 1)}%`, // sisanya dibagi rata
                      }}
                    >
                      {col.key === "id" ? rowIndex + 1 : String(row[col.key])}
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
