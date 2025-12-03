// @ts-nocheck
import React from "react";
import Colorize from "./Colorize";

export default function VibData({ data, alarmdata }) {
  function round(value: number | undefined, decimals = 2) {
    if (value === undefined || value === null || Number.isNaN(value)) {
      return 0; // atau "" atau NaN, sesuai kebutuhanmu
    }
    return Number(value).toFixed(decimals);
  }
  const datatoshow = data.vibration[0];
  return (
    <div className="content-center ">
      <div className="flex grid-cols-6 justify-center">
        <div className="text-gray-100 py-5">Position</div>
        <div className="text-xl text-yellow-300 p-5">A</div>
        <div className="text-xl text-yellow-300 p-5">V</div>
        <div className="text-xl text-yellow-300 p-5">H</div>
        <div className="text-xl text-yellow-300 p-5">V</div>
        <div className="text-xl text-yellow-300 p-5">H</div>
      </div>
      <div className="grid grid-cols-6">
        <div className="text-gray-100">Motor</div>
        <div className="content-center">
          <Colorize
            value={round(datatoshow.ma)}
            alarm={alarmdata?.alarm}
            danger={alarmdata?.danger}
          ></Colorize>
        </div>
        <div className="content-center">
          <Colorize
            value={round(datatoshow.mv1)}
            alarm={alarmdata?.alarm}
            danger={alarmdata?.danger}
          ></Colorize>
        </div>
        <div className="content-center">
          <Colorize
            value={round(datatoshow.mh1)}
            alarm={alarmdata?.alarm}
            danger={alarmdata?.danger}
          ></Colorize>
        </div>
        <div className="content-center">
          <Colorize
            value={round(datatoshow.mv2)}
            alarm={alarmdata?.alarm}
            danger={alarmdata?.danger}
          ></Colorize>
        </div>
        <div className="content-center">
          <Colorize
            value={round(datatoshow.mh2)}
            alarm={alarmdata?.alarm}
            danger={alarmdata?.danger}
          ></Colorize>
        </div>
      </div>
      <div className="grid grid-cols-6 py-4">
        <div className="text-gray-100">Pump</div>
        <div className="content-center">
          <Colorize
            value={round(datatoshow.pa)}
            alarm={alarmdata?.alarm}
            danger={alarmdata?.danger}
          ></Colorize>
        </div>
        <div className="content-center">
          <Colorize
            value={round(datatoshow.pv1)}
            alarm={alarmdata?.alarm}
            danger={alarmdata?.danger}
          ></Colorize>
        </div>
        <div className="content-center">
          <Colorize
            value={round(datatoshow.ph1)}
            alarm={alarmdata?.alarm}
            danger={alarmdata?.danger}
          ></Colorize>
        </div>
        <div className="content-center">
          <Colorize
            value={round(datatoshow.pv2)}
            alarm={alarmdata?.alarm}
            danger={alarmdata?.danger}
          ></Colorize>
        </div>
        <span className="content-center">
          <Colorize
            value={round(datatoshow.ph2)}
            alarm={alarmdata?.alarm}
            danger={alarmdata?.danger}
          ></Colorize>
        </span>
      </div>
    </div>
  );
}
