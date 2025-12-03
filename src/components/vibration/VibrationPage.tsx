// @ts-nocheck
import logo from "../../assets/whitel.png";
import plus from "../../assets/plus.svg";
import loc2 from "../../assets/loc2.svg";
import pertamina from "../../assets/pertamina.svg";

// 1. IMPORT onSnapshot from firestore
import { onSnapshot } from "firebase/firestore";

import { queryData, streamData, addRecord } from "./firebase";
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

function VibrationPage() {
  const [vibdata, setVibdata] = useState();
  let [toggle, setToggle] = useState(false);
  let [datafromcallback, setDatafromcallback] = useState();
  let MySwal = withReactContent(Swal);
  let [refresh, setRefresh] = useState(0);
  let [query, setQuery] = useState();
  let [result, setResult] = useState("Showing all record");
  const [isLoading, setIsLoading] = useState(true);

  function validation() {
    if (
      typeof datafromcallback.name != "undefined" &&
      typeof datafromcallback.note != "undefined"
    )
      return true;
    return false;
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
    }).then((result) => {
      if (result.isConfirmed && validation()) {
        addRecord(datafromcallback);
        setToggle(false);
        setRefresh((prev) => prev + 1);
        return MySwal.fire("Saved !", "Record Succesfully created", "success");
      }
      if (result.isConfirmed && !validation()) {
        return MySwal.fire(
          "Warning !",
          "Data yang dimasukkan belum lengkap",
          "warning"
        );
      }
    });
  }

  // 2. FIXED useEffect Logic for Firebase v9
  useEffect(() => {
    let unsubscribe;
    setIsLoading(true); // <-- start loading every time query changes

    function init() {
      if (query?.length > 0) {
        const newque = query.map((v) => v.split(" ")[0]);
        setResult(`Showing records for : ${newque.join(", ")}`);

        const q = queryData(query);
        unsubscribe = onSnapshot(
          q,
          (doc) => {
            setIsLoading(false); // <-- FIRESTORE HAS RETURNED

            if (doc.empty) {
              setVibdata([]); // empty result, not loading anymore
              return;
            }

            const vibra = doc.docs.map((d) => ({
              ...d.data(),
              id: d.id,
            }));

            setVibdata(vibra);
          },
          (error) => console.log(error)
        );
      } else {
        setResult("Showing All records");

        unsubscribe = onSnapshot(
          streamData,
          (doc) => {
            setIsLoading(false); // <-- FIRESTORE HAS RETURNED

            if (doc.empty) {
              setVibdata([]); // empty result
              return;
            }

            const vibra = doc.docs.map((d) => ({
              ...d.data(),
              id: d.id,
            }));

            setVibdata(vibra);
          },
          (error) => console.log(error)
        );
      }
    }

    init();

    return () => unsubscribe && unsubscribe();
  }, [query]);
  //returnJSX
  return (
    <>
      <ModalPopUp param={toggle} set={setToggle}>
        <div className=" text-black p-4 bg-indigo-200 rounded-xl">
          <InputData
            sendfromchild={(newdata) => {
              setDatafromcallback(newdata);
            }}
            refresh={refresh}
            initvalue={new Vibration()}
          />
          <div className="flex content-evenly justify-end">
            <Button text="Save" callback={promptsave}></Button>
            <Button
              text="Close"
              callback={() => {
                setToggle(false);
                /// console.log(vibdata);
              }}
            ></Button>
          </div>
        </div>
      </ModalPopUp>
      <div className="flex flex-col  overflow-hidden">
        <header className="bg-main-for shadow-lg h-20 flex flex-row items-center ">
          {/* <div className="flex-none">
            <a href="http://localhost:3000">
              <img src={logo} alt="Logo" className=" px-2 py-0 h-14 w-auto " />
            </a>
          </div> */}
          <div
            onClick={() => setToggle(true)}
            className="flex-none hover:bg-gray-800 px-4 hover:shadow-md cursor-pointer mr-5 pr-10 py-4 flex flex-row items-center"
          >
            <img
              src={plus}
              alt="Logo"
              className=" px-2 py-0 h-14 w-auto hover:bg-opacity-95 "
            />
            <div className="text-indigo-50 font-extrabold text-lg">
              {" "}
              Create Record{" "}
            </div>
          </div>
          <SearchBar onChange={(v) => setQuery(v)} />
          <div className="w-60"></div>
        </header>
        <div className="scrollbar overflow-y-hidden scrollbar-thumb-rounded-xl  hover:scrollbar-thumb-blue-400 scrollbar-thumb-blue-300 scrollbar-track-blue-200">
          <div className="font-light italic text-blue-400 w-screen text-center">
            {result}
          </div>
          <div className="flex flex-row">
            {isLoading ? <Loading /> : <Iterator vibdata={vibdata} />}
          </div>
        </div>

        {/* <footer className="h-auto pb-2 bg-gray-100 shadow-lg text-gray-800 flex justify-between items-center content-between">
          <div className="flex flex-row">
            <img
              src={pertamina}
              alt="logo"
              className=" pl-10 py-1 h-14 w-auto "
            ></img>
            <img
              src={loc2}
              alt="logo"
              className=" pl-5 py-1 h-14 w-auto "
            ></img>
          </div>
          <div className="px-10">
            Created with 💙 by Miftachul Huda{" "}
            <div className="font-extralight italic">
              miftachul.huda@pertamina.com
            </div>
          </div>
        </footer> */}
      </div>
    </>
  );
}

export default VibrationPage;
