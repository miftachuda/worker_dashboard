export type Employee = {
  id: number;
  created_at: string;
  Nama: string;
  Nopek: string;
  Nopek_kpi: string;
  "No HP": string;
  Position: string;
  Alamat: string;
  Status: "Aktif" | "Dinas" | "Cuti"; // you can extend as needed
  Shift: "Harian" | "Shift A" | "Shift B" | "Shift C" | "Shift D"; // restrict if you know all possible values
  last_update: string; // ISO date string
  last_move: string; // ISO date string
  PRL: number;
  type: "Organik" | "Non-Organik"; // extend as needed
};
