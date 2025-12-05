// @ts-nocheck
import React, { useState } from "react";
import VibData from "./VibData";
import Button from "./Button";
import dateFormat from "dateformat";
import moment from "moment";
import newicon from "../../assets/new.svg";
import InputData from "./InputData";
import { editRecord, deleteRecord } from "./pb";
import ModalPopUp from "./ModalPopUp";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import pumpAlarm from "./pumpAlarm";

//main function
function CardVib({ data, refreshcallback }) {
  let [toggle, settoggle] = useState(false);
  let [datafromcallback, setdatafromcallback] = useState();
  let MySwal = withReactContent(Swal);
  let pumpAlarmdata = pumpAlarm.find(
    (e) => e.pump === data.name?.split(" ")[0]
  );
  // console.log(pumpAlarmdata);

  function validation() {
    if (
      typeof datafromcallback.name != "undefined" &&
      typeof datafromcallback.note != "undefined"
    )
      return true;
    return false;
  }
  function deletecard() {
    Swal.fire({
      title: "Delete ?",
      text: "Record akan dihapus !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#19FF19",
      cancelButtonColor: "#FF0D0D",
      confirmButtonText: "Proceed",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      // SHOW LOADING
      Swal.fire({
        title: "Deleting...",
        text: "Please wait",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await deleteRecord(data.id);
        await refreshcallback();

        Swal.fire("Deleted!", "Record successfully deleted", "success");
      } catch (error) {
        Swal.fire("Fail!", "Failed deleting Record", "warning");
      }
    });
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
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      if (!validation()) {
        return MySwal.fire(
          "Warning!",
          "Data yang dimasukkan belum lengkap",
          "warning"
        );
      }

      // SHOW LOADING
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
        await editRecord({ data: datafromcallback, docid: data.id });
        await refreshcallback();
        settoggle(false);

        Swal.fire("Saved!", "Record successfully updated", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed updating Record", "error");
      }
    });
  }

  //returnJSX
  if (data.created == null) return <div></div>;
  else {
    const createdAt = data.created ? new Date(data.created) : null;
    const updatedAt = data.updated ? new Date(data.updated) : null;

    const isSameTime =
      createdAt && updatedAt && createdAt.getTime() === updatedAt.getTime();

    // Date display
    const dateformat = createdAt
      ? new Intl.DateTimeFormat("id-ID", {
          weekday: "long",
          day: "2-digit",
          month: "long", // mmmm full month
          year: "numeric",
        })
          .format(createdAt)
          .replace(/^\w/, (c) => c.toUpperCase())
      : "-";

    // Time ago
    const timerel = createdAt ? moment(createdAt).fromNow() : "-";

    // Duration in minutes (Infinity if no created date)
    const duration = createdAt
      ? moment(Date.now()).diff(createdAt, "minutes")
      : Infinity;

    // Last edited display
    function lastedited() {
      if (!updatedAt || isSameTime) return "-";
      return moment(updatedAt).fromNow();
    }
    return (
      <div className="p-0">
        <ModalPopUp param={toggle}>
          <div className=" text-black p-4 bg-indigo-200 rounded-xl">
            <InputData
              sendfromchild={(newdata) => {
                setdatafromcallback(newdata);
              }}
              refresh={refreshcallback}
              initvalue={data}
            />
            <div className="flex content-evenly justify-end">
              <Button text="Save" callback={promptsave}></Button>
              <Button
                text="Close"
                callback={() => {
                  settoggle(false);
                }}
              ></Button>
            </div>
          </div>
        </ModalPopUp>
        <div className="bg-gray-800 relative transform hover:scale-105 transition duration-500 ease-in-out rounded-lg px-10 py-5 mt-4 mx-7 shadow-xl hover:shadow-2xl ">
          <div className="flex justify-between">
            <div className=" font-bold text-2xl text-lime-50">
              {data.name?.split(" ")[0]}
              {duration < 1440 ? (
                <img
                  className="absolute top-0 right-0 h-16"
                  src={newicon}
                  alt="new"
                ></img>
              ) : (
                <div></div>
              )}
            </div>
            <div className=" flex flex-col text-sm text-gray-100 justify-center items-center">
              {dateformat}
              <div>{timerel}</div>
            </div>
          </div>
          <div>
            <VibData data={data} alarmdata={pumpAlarmdata}>
              {" "}
            </VibData>
          </div>
          <div className="text-xs ">Keterangan</div>
          <div className="h-auto flex flex-wrap">
            <div className="px-2 py-1 bg-red-1 text-red-600 rounded-sm m-1 text-xs content-center">
              Danger :{" "}
              <span className="font-black">{pumpAlarmdata?.danger}</span>
            </div>
            <div className="px-2 py-1 bg-orange-1 text-red-400 rounded-sm m-1  text-xs content-center">
              Alarm : <span className="font-black">{pumpAlarmdata?.alarm}</span>
            </div>

            <div className="px-2 py-1 w-auto border-green-100 border-solid  border-2 text-green-200 rounded-sm m-1  text-xs content-center">
              {pumpAlarmdata?.power} HP
            </div>
          </div>
          <div className="text-xs text-gray-100">Note</div>
          <div className="bg-gray-500 text-xs text-gray-100 rounded-lg border-gray-800 px-2 border-2 h-20">
            {data.note}
          </div>
          <span className=" rounded-sm m-1  text-xs italic content-center">
            {`edited : ${lastedited()}`}
          </span>
          <div className="flex content-evenly justify-end">
            <Button
              text="Edit"
              callback={() => {
                settoggle(true);
              }}
            ></Button>
            <Button text="Delete" callback={() => deletecard()}></Button>
          </div>
        </div>
      </div>
    );
  }
}

export default CardVib;
