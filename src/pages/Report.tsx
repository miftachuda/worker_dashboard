import React, { useEffect, useState } from "react";
import MainFrame from "./MainFrame";
import { Input } from "@/components/ui/input";
import { Reportx } from "@/types/Report";
import { pb } from "@/lib/pocketbase";
import ReportCard from "@/components/reports/ReportCard";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { CreateReport } from "@/components/reports/CreateReport";
import { sendNotif } from "@/lib/sendnotif";

dayjs.extend(customParseFormat);

const Report: React.FC = () => {
  const [report, setReport] = useState<Reportx[]>([]);
  const [filteredReport, setFilteredReport] = useState<Reportx[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<any>(null);

  /** ---------------------------
   * FETCH & NORMALIZE REPORTS
   * --------------------------- */
  const fetchReports = async () => {
    try {
      const records = await pb.collection("reports").getFullList<Reportx>({
        sort: "created",
        filter: "isSubmit = true",
      });

      // Normalize content (parse once, correct object shape)
      const normalized = records.map((r) => {
        const raw =
          typeof r.content === "string" ? JSON.parse(r.content) : r.content;

        const normalizedContent = Object.fromEntries(
          Object.entries(raw || {}).map(([key, value]) => [
            key,
            Array.isArray(value) ? value : [String(value ?? "")],
          ])
        );

        return {
          ...r,
          content: normalizedContent, // always object in React state
        };
      });

      setReport(normalized);
      setFilteredReport(normalized);
    } catch (err) {
      console.error("Error fetching report:", err);
      setError(err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  /** ---------------------------
   * SEARCH FILTER
   * --------------------------- */
  useEffect(() => {
    const lower = search.toLowerCase().trim();

    if (!lower) {
      setFilteredReport(report);
      return;
    }

    const filtered = report.filter((rep) => {
      const values = Object.values(rep.content)
        .flatMap((v) => (Array.isArray(v) ? v : [v]))
        .join(" ")
        .toLowerCase();

      return values.includes(lower);
    });

    setFilteredReport(filtered);
  }, [search, report]);

  /** ---------------------------
   * RENDER
   * --------------------------- */
  return (
    <MainFrame>
      {error && <p className="text-red-500">{error.message}</p>}

      <CreateReport />

      <div className="sticky top-4 z-10 ml-9 mr-6">
        <Input
          type="text"
          placeholder="Search report..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      <main>
        <div className="w-full grid">
          {filteredReport
            .sort((a, b) => b.created.localeCompare(a.created))
            .map((rep) => {
              const content = rep.content; // ✅ stable, no re-parsing
              const formatTanggal = (isoString) => {
                const date = new Date(isoString);

                const hari = date.toLocaleDateString("id-ID", {
                  weekday: "long",
                });
                const tanggal = date.getDate();
                const bulan = date.toLocaleDateString("id-ID", {
                  month: "long",
                });
                const tahun = date.getFullYear();

                const capitalize = (str) =>
                  str.charAt(0).toUpperCase() + str.slice(1);

                return `${capitalize(hari)}, ${tanggal}-${capitalize(
                  bulan
                )}-${tahun}`;
              };
              return (
                <ReportCard
                  key={rep.id}
                  date={dayjs(rep.date).format("DD-MMM-YYYY")}
                  shift={rep.shift}
                  data={content}
                  onChange={async (updated) => {
                    const updatedData: Reportx = {
                      ...rep,
                      content: updated, // keep object in React
                    };

                    // Save stringified version to PocketBase
                    await pb.collection("reports").update(rep.id.toString(), {
                      ...updatedData,
                      content: JSON.stringify(updated),
                    });
                    await sendNotif({
                      title: "[Report] Updated",
                      page: "reports",
                      message: `${updatedData.shift}- ${formatTanggal(
                        updatedData.date
                      )} has been updated.`,
                    });

                    // Update React state
                    setReport((prev) =>
                      prev.map((r) => (r.id === rep.id ? updatedData : r))
                    );
                  }}
                />
              );
            })}
        </div>
      </main>
    </MainFrame>
  );
};

export default Report;
