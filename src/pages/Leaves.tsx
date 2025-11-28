import React, { useEffect, useState } from "react";
import MainFrame from "./MainFrame";
import PlusInputButton from "@/components/leaves/PlusInputButton";
import { Leavex } from "@/types/Leavex";
import { differenceInDays, format, parseISO } from "date-fns";
import { Input } from "@/components/ui/input";
import { fetchEmployee } from "@/lib/worker";
import { Employee } from "@/types/Employee";
import { Person } from "@/types/Person";
import UserTableWrapper from "@/components/leaves/UserTableWrapper";
import { Cell } from "@/types/Cell";
import PopupDialog from "@/components/leaves/PopUp";
import { pb } from "@/lib/pocketbase";

/* ============ CONVERTER Person → Employee ============ */
const personToEmployee = (p: Person): Employee => ({
  id: p.id,
  nomor: p.nomor,
  created_at: p.created,
  Nama: p.Nama,
  Nopek: p.Nopek,
  Nopek_kpi: p.Nopek_kpi,
  "No HP": p["No HP"],
  Position: p.Position,
  Alamat: p.Alamat,
  Status: p.Status as Employee["Status"],
  Shift: p.Shift as Employee["Shift"],
  last_update: p.last_update,
  last_move: p.last_move,
  PRL: p.PRL,
  type: p.type === "TAD" || p.type === "Expert" ? "Non-Organik" : "Organik",
});

// ================= COMPONENT =================
const Leave: React.FC = () => {
  const [data, setData] = useState<Leavex[]>([]);
  const [employee, setEmployee] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<Leavex[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [popupData, setPopupData] = useState<Cell[] | null>(null);

  /* ============ FETCH LEAVES ============ */
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const records = await pb.collection("leaves").getFullList<Leavex>({
          sort: "-created",
        });
        setData(records);
        setFilteredData(records);
      } catch (err) {
        setError(err as Error);
      }
    };

    fetchLeaves();
  }, []);

  /* ============ FETCH EMPLOYEE (FIXED) ============ */
  useEffect(() => {
    fetchEmployee().then(({ data, error }) => {
      if (error) {
        setError(error);
      } else {
        const converted: Employee[] = (data || []).map(personToEmployee);
        setEmployee(converted);
      }
    });
  }, []);

  /* ============ SEARCH FILTER ============ */
  useEffect(() => {
    const lowerSearch = search.toLowerCase().trim();

    if (!lowerSearch) {
      setFilteredData(data);
      return;
    }

    const result = data.filter((leave) =>
      leave.nama?.toLowerCase().includes(lowerSearch)
    );

    setFilteredData(result);
  }, [search, data]);

  /* ============ CALLBACK ============ */
  const callback = (x: Cell[]) => {
    setPopupData(x);
    setIsOpen(true);
  };

  return (
    <MainFrame>
      <PopupDialog
        isOpen={isOpen}
        selected={popupData}
        onClose={() => setIsOpen(false)}
      />

      <main className="p-6 space-y-4">
        <Input
          type="text"
          placeholder="Search leave..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />

        <UserTableWrapper users={employee} callback={callback} />
      </main>
    </MainFrame>
  );
};

export default Leave;
