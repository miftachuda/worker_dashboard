import React, { useEffect, useState } from "react";
import MainFrame from "./MainFrame";
import PlusInputButton from "@/components/leaves/PlusInputButton";
import supabase from "@/lib/supabaseClient";
import { Leavex } from "@/types/Leavex";
import { differenceInDays, format, parseISO } from "date-fns";
import { Input } from "@/components/ui/input";
import { fetchEmployee } from "@/lib/worker";
import { Employee } from "@/types/Employee";
import UserTableWrapper from "@/components/leaves/UserTableWrapper";
import { Cell } from "@/types/Cell";
import PopupDialog from "@/components/leaves/PopUp";
//upload test
const Leave: React.FC = () => {
  const [data, setData] = useState<Leavex[]>([]);
  const [employee, setEmployee] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<Leavex[]>([]);
  const [error, setError] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [popupData, setPopupData] = useState<Cell[] | null>(null);

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
  function callback(x) {
    const data = x as Cell[];
    setPopupData(data);
    setIsOpen(true);
    console.log(data);
  }
  return (
    <MainFrame>
      <PopupDialog
        isOpen={isOpen}
        selected={popupData}
        onClose={() => setIsOpen(false)}
      />
      <main className="p-6 space-y-4 ">
        <Input
          type="text"
          placeholder="Search leave..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />

        <UserTableWrapper users={employee} callback={callback} />
        {/* <div>
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
        </div> */}
      </main>
    </MainFrame>
  );
};

export default Leave;
