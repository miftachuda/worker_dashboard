import React, { useEffect, useState } from "react";
import MainFrame from "./MainFrame";
import supabase from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Maintenancex } from "@/types/Maintenance";
import PocketBase, { RecordModel } from "pocketbase";
import { motion, AnimatePresence } from "framer-motion";

const Maintenance: React.FC = () => {
  const [data, setData] = useState<Maintenancex[]>([]);
  const [filteredData, setFilteredData] = useState<Maintenancex[]>([]);
  const [selectedEquipment, setSelectedEquipment] =
    useState<RecordModel | null>(null);
  const [filteredEquipment, setFilteredEquipment] = useState<RecordModel[]>([]);
  const [listEquipment, setListEquipment] = useState<RecordModel[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<any>(null);
  const pb = new PocketBase("https://base.miftachuda.my.id");

  // Fetch equipment list from PocketBase
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const records = await pb.collection("list_equipment").getFullList({
          sort: "-created",
        });
        setListEquipment(records);
      } catch (err) {
        console.error("Error fetching equipment:", err);
      }
    };
    fetchEquipment();
  }, []);

  // Fetch maintenance data from Supabase
  useEffect(() => {
    const fetchMaintenances = async () => {
      const { data: Maintenances, error } = await supabase
        .from("Maintenances")
        .select("*");
      if (error) setError(error);
      else {
        setData(Maintenances || []);
        setFilteredData(Maintenances || []);
      }
    };
    fetchMaintenances();
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

            <div className="border rounded-lg p-6 shadow-md bg-slate-950 text-white">
              <h2 className="text-2xl font-bold mb-2">
                {selectedEquipment.nametag}
              </h2>
              <p className="text-gray-400 mb-4">
                {selectedEquipment.description}
              </p>

              <div className="text-sm text-gray-300">
                <p>ID: {selectedEquipment.id}</p>
                {/* Add more fields as needed */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainFrame>
  );
};

export default Maintenance;

// {filteredData
//             .sort((a, b) => b.created_at.localeCompare(a.created_at))
//             .map((data, index) => {
//               return (
//                 <div key={data.id} className="border p-4 rounded-lg shadow">
//                   {data.name}
//                   <div>
//                     {Array.isArray(data.record.record) &&
//                       data.record.record.map((rec, idx) => {
//                         console.log("rec:", rec);
//                         return (
//                           <div key={idx} className="mt-2 p-2 border-t">
//                             <p>
//                               <strong>Shift:</strong> {rec.shift}
//                             </p>
//                             <p>
//                               <strong>Period:</strong> {rec.period}
//                             </p>

//                             {rec.description?.length > 0 && (
//                               <ul className="list-disc ml-6 mt-1">
//                                 {rec.description.map((desc, i) => (
//                                   <li key={i}>{desc}</li>
//                                 ))}
//                               </ul>
//                             )}

//                             {rec.photos?.length > 0 && (
//                               <div className="flex gap-2 mt-2">
//                                 {rec.photos.map((url, i) => (
//                                   <img
//                                     key={i}
//                                     src={url}
//                                     alt={`photo-${i}`}
//                                     className="w-20 h-20 object-cover rounded"
//                                   />
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })}
//                   </div>
//                 </div>
//               );
//             })}
