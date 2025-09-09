import { useState } from "react";
import supabase from "../lib/supabaseClient";

export const fetchEmployee = async () => {
  const { data: Manpower_all, error } = await supabase
    .from("Manpower_all")
    .select("*");
  return { data: Manpower_all, error };
};
