import React, { useEffect, useState } from "react";
import MainFrame from "./MainFrame";
import { Input } from "@/components/ui/input";
import { Reportx } from "@/types/Report";
import { pb } from "@/lib/pocketbase";
import ReportCard from "@/components/reports/ReportCard";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { CreateReport } from "@/components/reports/CreateReport";

dayjs.extend(customParseFormat);
const Report: React.FC = () => {
  const [report, setReport] = useState<Reportx[]>([]);
  const [filteredReport, setFilteredReport] = useState<Reportx[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<any>(null);
  const fetchReports = async () => {
    try {
      const records = await pb.collection("reports").getFullList<Reportx>({
        sort: "created",
        filter: "isSubmit = true",
      });
      setReport(records);
      setFilteredReport(records);
    } catch (err) {
      console.error("Error fetching chemical usage:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();

    if (!lowerSearch.trim()) {
      setFilteredReport(report);
      return;
    }

    setFilteredReport(
      report.filter((order) => {
        const text =
          typeof order.content === "string"
            ? order.content
            : JSON.stringify(order.content ?? {});

        return text.toLowerCase().includes(lowerSearch);
      })
    );
  }, [search, report]);

  return (
    <MainFrame>
      {error && <p className="text-red-500">{error.message}</p>}
      <div className="sticky top-4 z-8 ">
        <div className="ml-9 mr-6">
          {/* <CreateOrder
            onCreated={(newOrder) => setData((prev) => [newOrder, ...prev])}
          /> */}
        </div>
      </div>
      <CreateReport />
      <div className="sticky top-4 z-10 ">
        <div className="ml-9 mr-6">
          <Input
            type="text"
            placeholder="Search report..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      <main>
        <div className="w-full grid ">
          {filteredReport
            .sort((a, b) => b.created.localeCompare(a.created))
            .map((report, index) => {
              const content =
                typeof report.content === "string"
                  ? JSON.parse(report.content)
                  : report.content;

              return (
                <ReportCard
                  key={index}
                  date={dayjs(report.date).format("DD-MMM-YYYY")}
                  shift={report.shift}
                  data={content}
                  onChange={async (updated) => {
                    report.content = JSON.stringify(updated);
                    await pb
                      .collection("reports")
                      .update(report.id.toString(), report);
                    console.log("Updated:", updated);
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
