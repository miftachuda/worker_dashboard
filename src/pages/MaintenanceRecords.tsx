import React, { useEffect, useState } from "react";
import MainFrame from "./MainFrame";
import { Input } from "@/components/ui/input";
import { Maintenancex } from "@/types/Maintenance";
import PocketBase, { RecordModel } from "pocketbase";
import { motion, AnimatePresence } from "framer-motion";
import { Timeline } from "primereact/timeline";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import MaintenanceCard from "@/components/TimelineCard";
import TimelineCanvas from "@/components/TimelineCanvas";

const Maintenance: React.FC = () => {
  const [selectedEquipment, setSelectedEquipment] =
    useState<RecordModel | null>(null);
  const [filteredEquipment, setFilteredEquipment] = useState<RecordModel[]>([]);
  const [listEquipment, setListEquipment] = useState<RecordModel[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<any>(null);
  const pb = new PocketBase("https://base.miftachuda.my.id");

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const records = await pb.collection("list_equipment").getFullList({
          sort: "-created",
        });
        setListEquipment(records);
      } catch (err) {
        setError(err);
        console.error("Error fetching equipment:", err);
      }
    };
    fetchEquipment();
  }, []);

  // Search logic for equipment
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    if (lowerSearch.trim() === "") {
      setFilteredEquipment(listEquipment);
    } else {
      setFilteredEquipment(
        listEquipment.filter((item) => {
          const fields = [item.nametag, item.description];
          return fields
            .filter(Boolean)
            .some((f) => f.toLowerCase().includes(lowerSearch));
        })
      );
    }
  }, [search, listEquipment]);

  const handleClick = (data: RecordModel) => setSelectedEquipment(data);
  const handleBack = () => setSelectedEquipment(null);
  const customizedMarker = (item) => {
    return (
      <span className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1 bg-red-600">
        <i className="bg-red-900"></i>
      </span>
    );
  };

  const customizedContent = (item) => {
    return (
      <MaintenanceCard
        title={item.title}
        description={item.description}
        start_time={item.start_time}
        status={item.status}
        image="bamboo-watch.jpg"
      />
    );
  };

  return (
    <MainFrame>
      <AnimatePresence mode="wait">
        {/* =======================
            PAGE 1: Equipment List
        ======================= */}
        {!selectedEquipment && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {error && <p className="text-red-500">{error.message}</p>}

            <div className="sticky top-4 z-8">
              <div className="ml-9 mr-6">{/* reserved for CreateOrder */}</div>
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
                {filteredEquipment
                  .sort((a, b) => b.nametag.localeCompare(a.nametag))
                  .map((data) => (
                    <motion.div
                      key={data.id}
                      layout
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleClick(data)}
                      className="
                        border select-none
                        rounded-lg 
                        px-4 py-2 
                        shadow-md 
                        bg-slate-950
                        text-white 
                        font-semibold 
                        text-center 
                        cursor-pointer 
                        transition 
                        duration-200 
                        ease-in-out 
                        hover:bg-slate-900
                        hover:shadow-lg 
                        active:bg-slate-800
                        mb-3
                      "
                    >
                      {data.nametag}
                      <div>
                        <p className="text-sm text-gray-500">
                          {data.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </main>
          </motion.div>
        )}

        {/* =======================
            PAGE 2: Equipment Detail
        ======================= */}
        {selectedEquipment && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <button
              onClick={handleBack}
              className="mb-4 px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 active:[transform:scale(0.98)]"
            >
              Back
            </button>

            <TimelineCanvas items={selectedEquipment} />
          </motion.div>
        )}
      </AnimatePresence>
    </MainFrame>
  );
};

export default Maintenance;
