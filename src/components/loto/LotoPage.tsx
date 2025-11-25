import LotoCards from "./LotoCards";
import { useEffect, useState } from "react";
import { supabase } from "./SupabaseClient";
import SearchableDropdown from "./SearchSelect";
import PspvCards from "./PspvCards";
type EquipmentType = "LOTO" | "PSPV";

const equipmentData: Record<EquipmentType, string[]> = {
  LOTO: [
    "002P-101A",
    "002P-101B",
    "002P-102A",
    "002P-102B",
    "021FDFan",
    "021E-130M-01",
    "021E-130M-02",
    "021E-130M-03",
    "021E-130M-04",
    "021E-130M-05",
    "021E-130M-06",
    "021E-130M-07",
    "021E-130M-08",
    "021E-130M-09",
    "021E-130M-10",
    "021E-130M-11",
    "021E-130M-12",
    "021F-101",
    "021F-102",
    "021P-102A",
    "021P-102B",
    "021P-102C",
    "021P-103",
    "021P-104",
    "021P-105",
    "021P-106A",
    "021P-106B",
    "021P-107A",
    "021P-107B",
    "021P-109A",
    "021P-109B",
    "021P-110A",
    "021P-110B",
    "021P-111",
    "021P-112A",
    "021P-112B",
    "021P-113A",
    "021P-113B",
    "021P-114A",
    "021P-114B",
    "021P-115",
    "022K-101",
    "022P-102A",
    "022P-102A",
    "022P-103A",
    "022P-103B",
    "022P-104A",
    "022P-104B",
    "022P-105",
    "022P-106A",
    "022P-106B",
    "022P-107A",
    "022P-107B",
    "023E-101M-1",
    "023E-101M-2",
    "023E-101M-3",
    "023E-101M-4",
    "023E-108M-1",
    "023E-108M-2",
    "023E-108M-3",
    "023E-108M-4",
    "023P-104",
    "023P-105A",
    "023P-105B",
    "023P-106",
    "023P-107A",
    "023P-107B",
    "023P-108",
    "023P-109",
    "023P-109A",
    "023P-110A",
    "023P-110B",
    "023P-114",
    "023P-116A",
    "023P-116B",
    "024E-101A",
    "024E-101B",
    "024E-102A",
    "024E-102B",
    "024E-102C",
    "024E-102D",
    "024E-112M-1",
    "024E-112M-2",
    "024E-116M-1",
    "024E-116M-2",
    "024E-116M-3",
    "024E-116M-4",
    "024E-123M-1",
    "024E-123M-2",
    "024E-125M-1",
    "024E-125M-2",
    "024K-101",
    "024K-102",
    "024P-102A",
    "024P-102B",
    "024P-103A",
    "024P-103B",
    "024P-103C",
    "024P-103D",
    "024P-105",
    "024P-106",
    "024P-107A",
    "024P-107B",
    "024P-108",
    "024P-109A",
    "024P-109B",
    "024P-110",
    "024P-111A",
    "024P-111B",
    "024P-112",
    "024P-113A",
    "024P-113B",
    "024P-114",
    "024P-115",
    "024P-116A",
    "024P-116B",
    "024P-117A",
    "024P-117B",
    "024P-119",
    "024P-121A",
    "024P-121B",
    "024S-101A-Drum",
    "024S-101B-Drum",
    "024S-101C-Drum",
    "024S-101D-Drum",
    "024S-101A-Scroll",
    "024S-101B-Scroll",
    "024S-101C-Scroll",
    "024S-101D-Scroll",
    "024S-101A-Lubricator",
    "024S-101B-Lubricator",
    "024S-101C-Lubricator",
    "024S-101D-Lubricator",
    "025F-101-SB-01",
    "025F-101-SB-02",
    "025F-101-SB-03",
    "025F-101-SB-04",
    "025F-101-SB-05",
    "025F-101-SB-06",
    "025F-101-SB-07",
    "025F-101-SB-08",
    "025F-101-SB-09",
    "025F-101-SB-10",
    "025F-101-SB-11",
    "025F-101-SB-12",
    "025F-101-SB-13",
    "025F-101-SB-14",
    "025F-101-SB-15",
    "025F-101-SB-16",
    "025F-101-SB-17",
    "025F-101-SB-18",
    "025P-101A",
    "025P-101B",
    "041P-101A",
    "041P-101B",
    "041P-101C",
    "041P-102A",
    "041P-102B",
    "041P-103A",
    "041P-103B",
    "041P-104A",
    "041P-104B",
    "041P-105",
    "041P-106A",
    "041P-106B",
    "041P-107A",
    "041P-107B",
    "041P-108A",
    "041P-108B",
    "041P-122A",
    "041P-122B",
    "041T-106-Mixer",
    "041T-122-Mixer",
  ],
  PSPV: [
    "021HS-010",
    "021HS-012",
    "021HS-038",
    "021HS-045",
    "021HS-271",
    "021HS-288",
    "022HS-008",
    "022HS-016",
    "022HS-401",
    "024HS-042",
    "024HS-159",
    "024HS-169",
    "025HS-004",
    "025HS-009",
    "025HS-003",
    "002HS-067",
  ],
};
type LotoEntry = {
  id: number;
  created_at: string;
  equipment: string;
  desc: string;
  isActive: boolean;
  lotoNumber: number;
};
type PspvEntry = {
  id: number;
  created_at: string;
  tag_number: string;
  desc: string;
  isActive: boolean;
};

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);

  const [lotoData, setLotoData] = useState<LotoEntry[]>([]);
  const [filteredLotoData, setFilteredLotoData] = useState<LotoEntry[]>([]);
  const [description, setDescription] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<EquipmentType | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string>("");
  const [active, setActive] = useState("active");
  const [lotonumber, setLotonumber] = useState<number | null>(null);

  const [pspvData, setPspvData] = useState<PspvEntry[]>([]);
  const [filteredPspvData, setFilteredPspvData] = useState<PspvEntry[]>([]);
  const [descriptionPspv, setDescriptionPspv] = useState("");
  const [isModalOpenPspv, setModalOpenPspv] = useState(false);
  const [selectedTypePspv, setSelectedTypePspv] =
    useState<EquipmentType | null>(null);
  const [selectedEquipmentPspv, setSelectedEquipmentpspv] =
    useState<string>("");
  const [activePspv, setActivePspv] = useState("active");

  const fetchLotoData = async () => {
    const { data, error } = await supabase.from("loto").select("*");
    if (error) {
      // console.error("Error fetching data:", error.message);
    } else {
      setLotoData(data as LotoEntry[]);
      const filtered = (data as LotoEntry[]).filter((item) => item.isActive);
      setFilteredLotoData(filtered);
    }

    setLoading(false);
    //  console.log(data);
  };
  const fetchPspvData = async () => {
    const { data, error } = await supabase.from("pspv").select("*");
    if (error) {
      //   console.error("Error fetching data:", error.message);
    } else {
      setPspvData(data as PspvEntry[]);
      const filtered = (data as PspvEntry[]).filter((item) => item.isActive);
      setFilteredPspvData(filtered);
    }

    setLoading(false);
    // console.log(data);
  };

  useEffect(() => {
    fetchLotoData();
    fetchPspvData();
  }, []);

  const handleSubmitLoto = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedEquipment == "") {
      setSuccess(false);
      setError("no equipment  selected");
    } else if (!lotonumber) {
      setSuccess(false);
      setError("loto number is empty");
    } else {
      setLoading(true);
      setError("");
      setSuccess(false);
      const { error } = await supabase.from("loto").insert([
        {
          equipment: selectedEquipment,
          desc: description,
          lotoNumber: lotonumber,
        },
      ]);

      if (error) {
        //  console.error("Error inserting data:", error.message);
        setError(error.message);
      } else {
        setSuccess(true);
        setSelectedEquipment("");
        setDescription("");
        setTimeout(() => {
          closeModalLoto();
          setLoading(false); // replace with your actual function
          window.location.reload();
        }, 1000);
      }
    }
  };
  const handleSubmitPSPV = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedEquipmentPspv == "") {
      setSuccess(false);
      setError2("no equipment  selected");
    } else {
      setLoading(true);
      setError2("");
      setSuccess(false);
      const { error } = await supabase.from("pspv").insert([
        {
          tag_number: selectedEquipmentPspv,
          desc: descriptionPspv,
          isActive: true,
        },
      ]);

      if (error) {
        //  console.error("Error inserting data:", error.message);
        setError2(error.message);
      } else {
        setSuccess(true);
        setSelectedEquipmentpspv("");
        setDescriptionPspv("");
        setTimeout(() => {
          closeModalPspv();
          setLoading(false); // replace with your actual function
          window.location.reload();
        }, 1000);
      }
    }
  };

  const openModalLoto = (type: EquipmentType) => {
    setSelectedType(type);
    setModalOpen(true);
    setSelectedEquipment(""); // reset previous selection
    setDescription("");
  };

  const closeModalLoto = () => {
    setModalOpen(false);
    setSelectedType(null);
  };

  const openModalPspv = (type: EquipmentType) => {
    setSelectedTypePspv(type);
    setModalOpenPspv(true);
    setSelectedEquipmentpspv(""); // reset previous selection
    setDescriptionPspv("");
  };

  const closeModalPspv = () => {
    setModalOpenPspv(false);
    setSelectedTypePspv(null);
  };

  return (
    <div className="space-y-6 bg-gray-900 p-6 text-white">
      <h2 className="text-2xl font-bold text-blue-400 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 ">
        {/* LOTO Column */}
        <div className="grid grid-cols-1 content-start gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl h-56">
            <h3 className="text-lg font-semibold mb-2">LOTO Records</h3>
            <div className="flex flex-row gap-12 ">
              <div className="grid grid-rows-1 md:grid-rows-2 lg:grid-rows-2 place-items-center">
                <p className="text-2xl font-bold text-blue-400">Active</p>
                <p className="text-5xl font-bold text-red-600">
                  {lotoData.filter((item) => item.isActive).length}
                </p>
              </div>
              <div className="grid grid-rows-1 md:grid-rows-2 lg:grid-rows-2 place-items-center">
                <p className="text-2xl font-bold text-blue-400">Done</p>
                <p className="text-5xl font-bold text-green-600">
                  {lotoData.filter((item) => !item.isActive).length}
                </p>
              </div>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => openModalLoto("LOTO")}
            >
              Create LOTO Record
            </button>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">List LOTO</h3>
              <div className="flex space-x-2">
                <button
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    active === "active"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                  onClick={() => {
                    const filtered = lotoData.filter((item) => item.isActive);
                    setFilteredLotoData(filtered);
                    setActive("active");
                  }}
                >
                  Active
                </button>
                <button
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    active === "inactive"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                  onClick={() => {
                    const filtered = lotoData.filter((item) => !item.isActive);
                    setFilteredLotoData(filtered);
                    setActive("inactive");
                  }}
                >
                  Done
                </button>
              </div>
            </div>
            <LotoCards
              loading={loading}
              lotoData={filteredLotoData}
              callback={fetchLotoData}
            />
          </div>
        </div>
        {/* Modal LOTO */}
        {isModalOpen && selectedType && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-800 text-white rounded-lg p-6 w-96 max-w-full shadow-lg">
              <h3 className="text-xl font-bold mb-4">
                Create Record ({selectedType})
              </h3>

              <label className="block mb-2 font-semibold">
                Select Equipment
              </label>
              <SearchableDropdown
                selectedType={selectedType}
                equipmentData={equipmentData}
                selectedEquipment={selectedEquipment}
                setSelectedEquipment={setSelectedEquipment}
              />
              {/* <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Equipment --</option>
              {equipmentData[selectedType].map((item, idx) => (
                <option key={idx} value={item}>
                  {item}
                </option>
              ))}
            </select> */}
              <label className="block mb-2 font-semibold">LOTO Number</label>
              <input
                type="number"
                min="1"
                step="1"
                onChange={(e) => {
                  const value = e.target.value;
                  // Only set value if it's a positive integer or empty (to allow deletion)
                  if (/^\d*$/.test(value)) {
                    setLotonumber(Number(value));
                  }
                }}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter LOTO number"
              />

              <label className="block mb-2 font-semibold">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description..."
                rows={4}
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={closeModalLoto}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmitLoto}
                  disabled={
                    (loading && !selectedEquipment) ||
                    !description ||
                    !lotonumber
                  }
                  style={{ padding: "0.5rem 1rem" }}
                  className={`px-4 py-2 rounded text-white 
    ${
      (loading && !selectedEquipment) || !description || !lotonumber
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-green-500 hover:bg-green-600"
    }`}
                >
                  {loading ? "Submitting..." : "Add Record"}
                </button>
              </div>
              {success && (
                <p style={{ color: "green" }}>Entry added successfully!</p>
              )}
              {error && <p style={{ color: "red" }}>Error: {error}</p>}
            </div>
          </div>
        )}

        {/* PSPV Column */}
        <div className="grid grid-cols-1 content-start gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl h-56">
            <h3 className="text-lg font-semibold mb-2">PSPV Records</h3>
            <div className="flex flex-row+++++++++++++++++++++++++++++++++ gap-12">
              <div className="grid grid-rows-1 md:grid-rows-2 lg:grid-rows-2 place-items-center">
                <p className="text-2xl font-bold text-blue-400">Active</p>
                <p className="text-5xl font-bold text-red-600">
                  {" "}
                  {pspvData.filter((item) => item.isActive).length}
                </p>
              </div>
              <div className="grid grid-rows-1 md:grid-rows-2 lg:grid-rows-2 place-items-center">
                <p className="text-2xl font-bold text-blue-400">Done</p>
                <p className="text-5xl font-bold text-green-600">
                  {" "}
                  {pspvData.filter((item) => !item.isActive).length}
                </p>
              </div>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => openModalPspv("PSPV")}
            >
              Create PSPV Record
            </button>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">List PSPV</h3>
              <div className="flex space-x-2">
                <button
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    activePspv === "active"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                  onClick={() => {
                    const filtered = pspvData.filter((item) => item.isActive);
                    setFilteredPspvData(filtered);
                    setActivePspv("active");
                  }}
                >
                  Active
                </button>
                <button
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    activePspv === "inactive"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                  onClick={() => {
                    const filtered = pspvData.filter((item) => !item.isActive);
                    setFilteredPspvData(filtered);
                    setActivePspv("inactive");
                  }}
                >
                  Done
                </button>
              </div>
            </div>
            <PspvCards
              loading={loading}
              lotoData={filteredPspvData}
              callback={fetchLotoData}
            />
          </div>
        </div>
      </div>
      {/* Modal PSPV */}
      {isModalOpenPspv && selectedTypePspv && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white rounded-lg p-6 w-96 max-w-full shadow-lg">
            <h3 className="text-xl font-bold mb-4">
              Create Record ({selectedTypePspv})
            </h3>

            <label className="block mb-2 font-semibold">Select Equipment</label>
            <SearchableDropdown
              selectedType={selectedTypePspv}
              equipmentData={equipmentData}
              selectedEquipment={selectedEquipmentPspv}
              setSelectedEquipment={setSelectedEquipmentpspv}
            />
            <label className="block mb-2 font-semibold">Description</label>
            <textarea
              value={descriptionPspv}
              onChange={(e) => setDescriptionPspv(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description..."
              rows={4}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={closeModalPspv}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmitPSPV}
                disabled={
                  (loading && !selectedEquipmentPspv) || !descriptionPspv
                }
                style={{ padding: "0.5rem 1rem" }}
                className={`px-4 py-2 rounded text-white 
                  ${
                    (loading && !selectedEquipmentPspv) || !descriptionPspv
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
              >
                {loading ? "Submitting..." : "Add Record"}
              </button>
            </div>
            {success && (
              <p style={{ color: "green" }}>Entry added successfully!</p>
            )}
            {error2 && <p style={{ color: "red" }}>Error: {error2}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
