import React, { useEffect, useState } from "react";
import MainFrame from "./MainFrame";
import { Input } from "@/components/ui/input";
import { RecordModel } from "pocketbase";
import { motion, AnimatePresence } from "framer-motion";
import TimelineCanvas from "@/components/maintenance_records/TimelineCanvas";
import CreateMaintenanceRecord from "@/components/maintenance_records/createMaintenanceRecordPopup";
import { pb } from "@/lib/pocketbase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Maintenance: React.FC = () => {
  const [selectedEquipment, setSelectedEquipment] = useState<
    RecordModel[] | null
  >(null);
  const [selectedEquipmentTimeline, setSelectedEquipmentTimeline] =
    useState<RecordModel>();
  const [filteredEquipment, setFilteredEquipment] = useState<RecordModel[]>([]);
  const [listEquipment, setListEquipment] = useState<RecordModel[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  // 🔹 Fetch Equipment List
  useEffect(() => {
    const fetchEquipment = async () => {
      setLoading(true);
      try {
        const records = await pb
          .collection("list_equipment")
          .getFullList({ sort: "created" });
        setListEquipment(records);
      } catch (err) {
        console.error("Error fetching equipment:", err);
        toast.error("Failed to fetch equipment list");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, []);

  // 🔹 Search Logic
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

  // 🔹 Handle Click on Equipment Card
  const handleClick = async (data: RecordModel) => {
    if (loading2) return;
    setLoading2(true);
    try {
      const records = await pb
        .collection("maintenance_collection")
        .getFullList({
          sort: "created",
          expand: "nametag",
          filter: `nametag.nametag = '${data.nametag}'`,
        });
      setSelectedEquipmentTimeline(data);
      setSelectedEquipment(records);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch maintenance records");
      setLoading2(false);
    } finally {
      setLoading2(false);
    }
  };

  // 🔹 Go Back to Equipment List
  const handleBack = () => setSelectedEquipment(null);

  // 🔹 Refresh Maintenance Records After Editing
  const refreshMaintenanceRecords = async () => {
    if (!selectedEquipmentTimeline) return;
    try {
      const records = await pb
        .collection("maintenance_collection")
        .getFullList({
          sort: "created",
          expand: "nametag",
          filter: `nametag.nametag = '${selectedEquipmentTimeline.nametag}'`,
        });
      setSelectedEquipment(records);
      toast.success("Records refreshed");
    } catch {
      toast.error("Failed to refresh records");
    }
  };

  return (
    <MainFrame>
      {/* 
        ✅ Wrapper with relative positioning 
        ensures overlay stays inside MainFrame's content
      */}
      <div className="relative w-full h-full min-h-[calc(100vh-8rem)] overflow-y-auto">
        <AnimatePresence>
          {(loading || loading2) && (
            <motion.div
              key="loading-spinner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-40"
            >
              <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

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
              className="p-6"
            >
              <div className="sticky top-4 z-10 ml-9 mr-6">
                <Input
                  type="text"
                  placeholder="Search Maintenance..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                />
              </div>

              <main className="p-6 space-y-6 ">
                {Object.entries(
                  filteredEquipment.reduce((acc, item) => {
                    const prefix = item.nametag.slice(0, 3).toUpperCase();
                    if (!acc[prefix]) acc[prefix] = [];
                    acc[prefix].push(item);
                    return acc;
                  }, {} as Record<string, typeof filteredEquipment>)
                )
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([prefix, items], i) => (
                    <div
                      key={prefix}
                      className={`p-4 rounded-2xl border-2 shadow-inner transition-colors duration-200 
                      ${
                        i % 3 === 0
                          ? "border-blue-500/50 bg-blue-950/20"
                          : i % 3 === 1
                          ? "border-emerald-500/50 bg-emerald-950/20"
                          : "border-fuchsia-500/50 bg-fuchsia-950/20"
                      }`}
                    >
                      <h2 className="text-lg font-bold mb-3 text-white tracking-widest">
                        {prefix}
                      </h2>

                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {items
                          .sort((a, b) => a.nametag.localeCompare(b.nametag))
                          .map((data) => (
                            <motion.div
                              key={data.id}
                              layout
                              whileHover={!loading ? { scale: 1.02 } : {}}
                              whileTap={!loading ? { scale: 0.98 } : {}}
                              onClick={
                                !loading ? () => handleClick(data) : undefined
                              }
                              className={`border select-none rounded-lg px-4 py-2 shadow-md 
                                ${
                                  loading
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                                } 
                                bg-slate-950 text-white font-semibold text-center 
                                transition duration-200 ease-in-out 
                                hover:bg-slate-900 hover:shadow-lg active:bg-slate-800`}
                            >
                              {data.nametag}
                              <p className="text-sm text-gray-500">
                                {data.description}
                              </p>
                            </motion.div>
                          ))}
                      </div>
                    </div>
                  ))}
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
                className="mb-4 px-4 py-2 mx-5 bg-slate-900 text-white rounded hover:bg-slate-800 active:[transform:scale(0.98)]"
              >
                ← Back
              </button>

              <CreateMaintenanceRecord
                items={selectedEquipmentTimeline}
                onCreated={refreshMaintenanceRecords}
              />

              <TimelineCanvas
                items={selectedEquipment}
                onReload={refreshMaintenanceRecords}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainFrame>
  );
};

export default Maintenance;
