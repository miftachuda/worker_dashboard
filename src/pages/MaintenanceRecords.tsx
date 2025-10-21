import React, { useEffect, useState } from "react";
import MainFrame from "./MainFrame";
import { Input } from "@/components/ui/input";
import PocketBase, { RecordModel } from "pocketbase";
import { motion, AnimatePresence } from "framer-motion";
import TimelineCanvas from "@/components/TimelineCanvas";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CreateMaintenanceRecord from "@/components/inputRecordPopup";

const Maintenance: React.FC = () => {
  const [selectedEquipment, setSelectedEquipment] = useState<
    RecordModel[] | null
  >(null);
  const [selectedEquipmentTimeline, setSelectedEquipmentTimeline] =
    useState<RecordModel>();
  const [filteredEquipment, setFilteredEquipment] = useState<RecordModel[]>([]);
  const [listEquipment, setListEquipment] = useState<RecordModel[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [errorDialog, setErrorDialog] = useState<string | null>(null);

  const pb = new PocketBase("https://base.miftachuda.my.id");

  // 🔹 Fetch Equipment List
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const records = await pb.collection("list_equipment").getFullList({
          sort: "created",
        });
        setListEquipment(records);
      } catch (err) {
        setError(err);
        console.error("Error fetching equipment:", err);
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

    try {
      setLoading2(true);
      const records = await pb
        .collection("maintenance_collection")
        .getFullList({
          sort: "created",
          expand: "nametag",
          filter: `nametag.nametag = '${data.nametag}'`,
        });

      setSelectedEquipmentTimeline(data);
      setSelectedEquipment(records);
    } catch (err: any) {
      console.error("Error fetching maintenance data:", err);
      setErrorDialog(err?.message || "Failed to fetch maintenance data.");
    } finally {
      setLoading2(false);
    }
  };

  // 🔹 Go Back to Equipment List
  const handleBack = () => setSelectedEquipment(null);

  // 🔹 Refresh Maintenance Records After Editing
  const refreshMaintenanceRecords = async () => {
    if (!selectedEquipmentTimeline) return;
    const records = await pb.collection("maintenance_collection").getFullList({
      sort: "created",
      expand: "nametag",
      filter: `nametag.nametag = '${selectedEquipmentTimeline.nametag}'`,
    });
    setSelectedEquipment(records);
  };

  return (
    <MainFrame>
      {/* 🔹 Top Loading Bar */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loading-bar"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-[3px] bg-blue-500 z-50"
          />
        )}
      </AnimatePresence>

      {/* 🔹 Error Dialog */}
      <AlertDialog
        open={!!errorDialog}
        onOpenChange={() => setErrorDialog(null)}
      >
        <AlertDialogContent className="bg-slate-900 text-white border border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">
              Fetch Failed
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              {errorDialog}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setErrorDialog(null)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

            <main className="p-6 space-y-6">
              {Object.entries(
                filteredEquipment.reduce((acc, item) => {
                  const prefix = item.nametag.slice(0, 3).toUpperCase(); // first 3 chars
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
                ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} 
                bg-slate-950 text-white font-semibold text-center 
                transition duration-200 ease-in-out 
                hover:bg-slate-900 hover:shadow-lg active:bg-slate-800`}
                          >
                            {data.nametag}
                            <div>
                              <p className="text-sm text-gray-500">
                                {data.description}
                              </p>
                            </div>
                            {loading && (
                              <div className="mt-2 text-xs text-gray-400 animate-pulse">
                                Loading...
                              </div>
                            )}
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

            {/* 🔹 Create Record Popup */}
            <CreateMaintenanceRecord
              items={selectedEquipmentTimeline}
              onCreated={refreshMaintenanceRecords}
            />

            {/* 🔹 Timeline with integrated Edit */}
            <TimelineCanvas
              items={selectedEquipment}
              onReload={refreshMaintenanceRecords}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </MainFrame>
  );
};

export default Maintenance;
