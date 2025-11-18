import { Dayjs } from "dayjs";

export default interface ReportForm {
  date: Dayjs; // <-- FIXED
  shift: string;
  isSubmit: boolean;
  content: {
    "002": string[];
    "021": string[];
    "022": string[];
    "023": string[];
    "024": string[];
    "025": string[];
    "041": string[];
    note: string[];
  };
}
