import React, { useEffect, useState } from "react";
import MainFrame from "./MainFrame";
import { Orderx } from "@/types/Order";
import { pb } from "@/lib/pocketbase";
import { Input } from "@/components/ui/input";
import { OrderCard } from "@/components/orders/OrderCard";
import { CreateOrder } from "@/components/orders/CreateOrder";
import { motion, AnimatePresence } from "framer-motion";

const Orders: React.FC = () => {
  const [data, setData] = useState<Orderx[]>([]);
  const [filteredData, setFilteredData] = useState<Orderx[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const records = await pb.collection("orders").getFullList<Orderx>({
          sort: "-created", // descending by created
        });

        const mapped = records.map((r: any) => ({
          ...r,
          created: r.created, // samakan dengan field lama kalau perlu
        }));

        setData(mapped);
        setFilteredData(mapped);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
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
            .filter(Boolean)
            .some((field) => field.toLowerCase().includes(lowerSearch))
        )
      );
    }
  }, [search, data]);

  return (
    <MainFrame>
      {error && <p className="text-red-500">{error.message}</p>}

      <div className="sticky top-4 z-8">
        <div className="ml-9 mr-6">
          <CreateOrder
            onCreated={(newOrder) => setData((prev) => [newOrder, ...prev])}
          />
        </div>
      </div>

      <div className="sticky top-16 z-10">
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

      <main className="p-6 relative min-h-[300px]">
        <AnimatePresence>
          {loading && (
            <motion.div
              key="spinner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center bg-transparent"
            >
              <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredData.map((order, index) => (
              <OrderCard key={order.id} {...order} num={index + 1} />
            ))}
          </div>
        )}
      </main>
    </MainFrame>
  );
};

export default Orders;
