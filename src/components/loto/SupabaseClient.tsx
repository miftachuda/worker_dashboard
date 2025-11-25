import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rgwjowrezjtspgyuyopz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnd2pvd3Jlemp0c3BneXV5b3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNTMyNTIsImV4cCI6MjA1OTgyOTI1Mn0.OGQgZIKaDhG_CzyQVvHVdkPn5hUmox_C20Qz-N-GLpw";
export const supabase = createClient(supabaseUrl, supabaseKey);
