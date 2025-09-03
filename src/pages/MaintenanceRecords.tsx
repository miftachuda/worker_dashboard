import React, { useEffect, useState } from "react";
import MainFrame from "./MainFrame";
import supabase from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Maintenancex } from "@/types/Maintenance";

const Maintenance: React.FC = () => {
  const [data, setData] = useState<Maintenancex[]>([]);
  const [filteredData, setFilteredData] = useState<Maintenancex[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: Maintenances, error } = await supabase
        .from("Maintenances")
        .select("*");
      if (error) setError(error);
      else {
        setData(Maintenances || []);
        setFilteredData(Maintenances || []);
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
        data.filter((item) => {
          // start with top-level fields
          let fields: string[] = [item.name];

          // add nested record fields
          item.record.record.forEach((rec) => {
            fields.push(rec.shift);
            fields.push(rec.period);
            fields.push(...rec.description);
          });

          return fields
            .filter(Boolean) // remove null/undefined
            .some((field) => field.toLowerCase().includes(lowerSearch));
        })
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
            placeholder="Search Maintenance..."
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
            .map((data, index) => {
              return (
                <div key={data.id} className="border p-4 rounded-lg shadow">
                  {data.name}
                  <div>
                    {Array.isArray(data.record.record) &&
                      data.record.record.map((rec, idx) => {
                        console.log("rec:", rec);
                        return (
                          <div key={idx} className="mt-2 p-2 border-t">
                            <p>
                              <strong>Shift:</strong> {rec.shift}
                            </p>
                            <p>
                              <strong>Period:</strong> {rec.period}
                            </p>

                            {rec.description?.length > 0 && (
                              <ul className="list-disc ml-6 mt-1">
                                {rec.description.map((desc, i) => (
                                  <li key={i}>{desc}</li>
                                ))}
                              </ul>
                            )}

                            {rec.photos?.length > 0 && (
                              <div className="flex gap-2 mt-2">
                                {rec.photos.map((url, i) => (
                                  <img
                                    key={i}
                                    src={url}
                                    alt={`photo-${i}`}
                                    className="w-20 h-20 object-cover rounded"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
        </div>
      </main>
    </MainFrame>
  );
};
// <OrderCard key={order.id} {...order} num={index + 1} />
export default Maintenance;
