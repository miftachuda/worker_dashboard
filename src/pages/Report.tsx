import React, { useEffect, useState } from "react";
import MainFrame from "./MainFrame";
import supabase from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Reportx } from "@/types/Report";

const Report: React.FC = () => {
  const [data, setData] = useState<Reportx[]>([]);
  const [filteredData, setFilteredData] = useState<Reportx[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: Reports, error } = await supabase
        .from("Reports")
        .select("*");
      if (error) setError(error);
      else {
        setData(Reports || []);
        setFilteredData(Reports || []);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    if (lowerSearch.trim() === "") {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter((order) =>
          [order.content]
            .filter(Boolean) // remove undefined/null
            .some((field) => field.toLowerCase().includes(lowerSearch))
        )
      );
    }
  }, [search, data]);

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
        <div className="p-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredData
            .sort((a, b) => b.created_at.localeCompare(a.created_at))
            .map((order, index) => (
              <div></div>
              // <OrderCard key={order.id} {...order} num={index + 1} />
            ))}
        </div>
      </main>
    </MainFrame>
  );
};

export default Report;
