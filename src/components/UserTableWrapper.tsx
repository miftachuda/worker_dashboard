import React, { useState } from "react";
import UserTable from "./UserTable";
import { Employee } from "@/types/Employee";
import { RowHead } from "@/types/RowHead";

const UserTableWrapper: React.FC<{ users: Employee[] }> = ({ users }) => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1–12
  const [shift, setShift] = useState("Shift A");

  // generate year options (e.g., 5 years back & forward)
  const years = Array.from(
    { length: 11 },
    (_, i) => today.getFullYear() - 5 + i
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const shifts = ["Shift A", "Shift B", "Shift C", "Shift D", "Harian"];
  const users_filterd = users.filter((x) => {
    return x.Shift == shift;
  });
  const users_convert: RowHead[] = users_filterd.map((x, i) => ({
    id: i, // use shift name as unique id
    name: x.Nama,
    PRL: x.PRL,
  }));
  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex gap-4 bg-transparent">
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border px-2 py-1 rounded bg-gray-900"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border px-2 py-1 rounded bg-gray-900"
        >
          {months.map((m, idx) => (
            <option key={idx + 1} value={idx + 1}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={shift}
          onChange={(e) => setShift(e.target.value)}
          className="border px-2 py-1 rounded bg-gray-900"
        >
          {shifts.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <UserTable users={users_convert} year={year} month={month} />
    </div>
  );
};

export default UserTableWrapper;
