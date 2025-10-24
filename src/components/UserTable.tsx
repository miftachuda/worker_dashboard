import React from "react";
import Table from "./shift_calender/Table";
import { RowHead } from "@/types/RowHead";
type UserTableProps = {
  users: RowHead[];
  year?: number;
  month?: number; // 1–12
  shift: string;
  callback: Function;
};

const UserTable: React.FC<UserTableProps> = ({
  users,
  year,
  month,
  shift,
  callback,
}) => {
  // default to current month if not provided
  const today = new Date();
  const activeYear = year ?? today.getFullYear();
  const activeMonth = month ?? today.getMonth() + 1; // convert to 1–12

  // get total days in selected month
  const daysInMonth = new Date(activeYear, activeMonth, 0).getDate();

  // static columns
  const baseColumns = [
    { key: "id", header: "No" },
    { key: "name", header: "Nama" },
  ];

  // dynamic day columns
  const dayColumns = Array.from({ length: daysInMonth }, (_, i) => ({
    key: `day_${i + 1}`,
    header: String(i + 1),
  }));

  const columns = [...baseColumns, ...dayColumns];

  // extend users with empty day values
  const extendedUsers: RowHead[] = users.map((u) => {
    const dayData: Record<string, string> = {};
    for (let d = 1; d <= daysInMonth; d++) {
      dayData[`day_${d}`] = "";
    }
    return { ...u, ...dayData };
  });

  return (
    <Table
      data={extendedUsers}
      columns={columns}
      year={year}
      month={month}
      onSelectionChange={callback}
      shift={shift}
    />
  );
};

export default UserTable;
