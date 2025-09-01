import { format } from "date-fns";
export interface HariLibur {
  event_date: string; // "YYYY-MM-DD"
  event_name: string;
  is_natianal_holiday: boolean;
}

let cachedLibur: HariLibur[] | null = null; // store result after first load

/**
 * Fetch holidays once and cache them
 */
export async function loadHariLibur(): Promise<HariLibur[]> {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/miftachuda/libur_api/refs/heads/main/data/holidays.json"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    cachedLibur = await response.json();
    return cachedLibur;
  } catch (error) {
    console.error("Error fetching API:", error);
    return [];
  }
}

/**
 * Find holiday by Date object (uses cached data)
 */
export function findHariLiburByDate(
  date: Date,
  liburList: HariLibur[]
): HariLibur | null {
  // will only fetch once
  const formattedDate = format(date, "yyyy-MM-dd");
  return (
    liburList.find((libur) => {
      return libur.event_date === formattedDate;
    }) ?? null
  );
}
