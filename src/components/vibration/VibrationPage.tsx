// @ts-nocheck
import logo from "../../assets/whitel.png";
import plus from "../../assets/plus.svg";
import loc2 from "../../assets/loc2.svg";
import pertamina from "../../assets/pertamina.svg";

import { useEffect, useState } from "react";
import Iterator from "./Iterator";
import Button from "./Button";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import InputData from "./InputData";
import ModalPopUp from "./ModalPopUp";
import Loading from "./Loading";
import SearchBar from "./SearchBar";
import Vibration from "./vibObject";

// PocketBase helpers
import { queryData, addRecord, fetchVib } from "./pb";
//import { addRecord } from "./firebase";

function VibrationPage() {
  const [vibdata, setVibdata] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [datafromcallback, setDatafromcallback] = useState();
  let [refresh, setRefresh] = useState(0);
  const [query, setQuery] = useState();
  const [result, setResult] = useState("Showing all record");
  const [isLoading, setIsLoading] = useState(true);
  const MySwal = withReactContent(Swal);

  function validation() {
    return (
      datafromcallback?.name !== undefined &&
      datafromcallback?.note !== undefined
    );
  }

  function promptsave() {
    Swal.fire({
      title: "Save ?",
      text: "Yakinkan data yang diinput sudah sesuai !",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#19FF19",
      cancelButtonColor: "#FF0D0D",
      confirmButtonText: "Save",
    }).then(async (res) => {
      if (!res.isConfirmed) return;

      if (!validation()) {
        return MySwal.fire("Warning !", "Data belum lengkap", "warning");
      }

      // Show loading alert
      Swal.fire({
        title: "Saving...",
        text: "Please wait",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await addRecord(datafromcallback);
        await refreshData();

        setToggle(false);
        setRefresh((prev) => prev + 1);

        Swal.fire("Saved !", "Record Successfully created", "success");
      } catch (err) {
        Swal.fire("Error", "Failed to save data!", "error");
        console.error(err);
      }
    });
  }
  const refreshData = async () => {
    const data = await fetchVib();
    setVibdata(data);
  };
  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    async function initPB() {
      try {
        if (query?.length > 0) {
          const trimmed = query.map((v) => v.split(" ")[0]);
          const records = await queryData(trimmed, controller.signal);
          setVibdata(records ?? []);
          setResult(`Showing records for : ${trimmed.join(", ")}`);
        } else {
          const records = await fetchVib(controller.signal);
          setVibdata(records ?? []);
          setResult(`Showing All records (${records.length})`);
        }
      } catch (err) {
        if (err.name === "AbortError") return; // Fetch dibatalkan, aman
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    initPB();

    return () => {
      controller.abort(); // Batalkan fetch sebelumnya dengan benar
    };
  }, [query, refresh]);

  return (
    <>
      <ModalPopUp param={toggle} set={setToggle}>
        <div className="text-black p-4 bg-indigo-200 rounded-xl">
          <InputData
            sendfromchild={(newdata) => setDatafromcallback(newdata)}
            refresh={refresh}
            initvalue={new Vibration()}
          />
          <div className="flex gap-3 justify-end">
            <Button text="Save" callback={promptsave} />
            <Button text="Close" callback={() => setToggle(false)} />
          </div>
        </div>
      </ModalPopUp>

      <div className="flex flex-col overflow-hidden">
        <header className="bg-main-for shadow-lg h-20 flex flex-row items-center">
          <div
            onClick={() => setToggle(true)}
            className="flex-none hover:bg-gray-800 px-4 hover:shadow-md cursor-pointer mr-5 pr-10 py-4 flex flex-row items-center"
          >
            <img src={plus} alt="Logo" className="px-2 py-0 h-14 w-auto" />
            <div className="text-indigo-50 font-extrabold text-lg">
              Create Record
            </div>
          </div>

          <SearchBar onChange={(v) => setQuery(v)} />
          <div className="w-60"></div>
        </header>

        <div className="scrollbar overflow-hidden scrollbar-thumb-rounded-xl hover:scrollbar-thumb-blue-400 scrollbar-thumb-blue-300 scrollbar-track-blue-200">
          <div className="font-light italic text-blue-400 w-screen text-center">
            {result}
          </div>

          {isLoading ? (
            <Loading />
          ) : (
            <Iterator vibdata={vibdata} refreshcallback={refreshData} />
          )}
        </div>
      </div>
    </>
  );
}

export default VibrationPage;
