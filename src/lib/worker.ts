import { pb } from "../lib/pocketbase";
import { Person } from "@/types/Person";

export const fetchEmployee = async (): Promise<{
  data: Person[] | null;
  error: any;
}> => {
  try {
    const records = await pb.collection("manpower").getFullList();

    const mapped: Person[] = records.map((r: any) => ({
      id: r.id, // PocketBase id = string → convert ke number
      nomor: r.nomor,
      created: r.created,
      Nama: r.nama,
      Nopek: r.nopek,
      Nopek_kpi: r.nopek_kpi,
      "No HP": r["no hp"],
      Position: r.position,
      Alamat: r.alamat,
      Status: r.status,
      Shift: r.shift,
      last_update: r.last_update,
      last_move: r.last_move,
      PRL: r.prl,
      type: r.type,
    }));

    return { data: mapped, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
