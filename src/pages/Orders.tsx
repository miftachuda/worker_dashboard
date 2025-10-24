import React, { useEffect, useState } from "react";
import MainFrame from "./MainFrame";
import { Orderx } from "@/types/Order";
import supabase from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { OrderCard } from "@/components/orders/OrderCard";
import { CreateOrder } from "@/components/orders/CreateOrder";

const Orders: React.FC = () => {
  const [data, setData] = useState<Orderx[]>([]);
  const [filteredData, setFilteredData] = useState<Orderx[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: Orders, error } = await supabase.from("Orders").select("*");
      if (error) setError(error);
      else {
        setData(Orders || []);
        setFilteredData(Orders || []);
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
          [order.description]
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
          <CreateOrder
            onCreated={(newOrder) => setData((prev) => [newOrder, ...prev])}
          />
        </div>
      </div>
      <div className="sticky top-16 z-10 ">
        <div className="ml-9 mr-6">
          <Input
            type="text"
            placeholder="Search order..."
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
              <OrderCard key={order.id} {...order} num={index + 1} />
            ))}
        </div>
      </main>
    </MainFrame>
  );
};

export default Orders;
