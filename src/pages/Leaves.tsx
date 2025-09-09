import React, { useEffect, useState } from "react";
import MainFrame from "./MainFrame";
import PlusInputButton from "@/components/PlusInputButton";
import supabase from "@/lib/supabaseClient";
import { Leavex } from "@/types/Leavex";
import { differenceInDays, format, parseISO } from "date-fns";
import { Input } from "@/components/ui/input";
import { fetchEmployee } from "@/lib/worker";
import { Employee } from "@/types/Employee";
import UserTableWrapper from "@/components/UserTableWrapper";
import { Nama } from "@/types/Nama";

const Leave: React.FC = () => {
  const [data, setData] = useState<Leavex[]>([]);
  const [employee, setEmployee] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<Leavex[]>([]);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: Orders, error } = await supabase.from("Leaves").select("*");
      if (error) setError(error);
      else {
        setData(Orders || []);
        setFilteredData(Orders || []);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    fetchEmployee().then(({ data, error }) => {
      setEmployee(data || []);
    });
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    if (lowerSearch.trim() === "") {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter((order) =>
          [order.Nama]
            .filter(Boolean)
            .some((field) => field.toLowerCase().includes(lowerSearch))
        )
      );
    }
  }, [search, data]);
  return (
    <MainFrame>
      <main className="p-6 space-y-4 ">
        <Input
          type="text"
          placeholder="Search order..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
        <PlusInputButton
          onAdd={(v) => console.log(v)}
          placeholder="Add leave type"
        />
        <div>
          {filteredData.map((leave, index) => {
            const start = parseISO(leave.From);
            const end = parseISO(leave.To);
            const daysDifference = differenceInDays(end, start);
            const from = format(start, "dd-MM-yyyy");
            const to = format(end, "dd-MM-yyyy");
            return (
              <div key={index}>
                <div>{leave.Nama}</div>
                <div className="flex gap-2">
                  <div>{from}</div>
                  <div>----</div>
                  <div>{to}</div>
                </div>
                <div>{leave.Jenis_Leave}</div>
                <div>{`${daysDifference} days`}</div>
              </div>
            );
          })}
        </div>
        <UserTableWrapper users={employee} />
      </main>
    </MainFrame>
  );
};

export default Leave;
