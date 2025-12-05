// @ts-nocheck
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { groupedPumps } from "./listpompa";
import InputPoint from "./InputPoint";
import { ChakraProvider, Grid, Stack } from "@chakra-ui/react";

import { system } from "./theme";
//themes

//main function
function InputData({ sendfromchild, initvalue }) {
  const initvaluecopy = Object.create(initvalue);
  const [datatopush, setdatatopush] = useState(initvaluecopy);
  let initvaluedata = initvaluecopy.vibration[0];
  let initvalueobj = initvaluecopy
    ? {
        label: initvalue?.name,
      }
    : null;

  //callbacktrigger
  useEffect(() => {
    sendfromchild(datatopush);
  }, [sendfromchild, datatopush]);

  const groupStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 15,
  };
  const groupBadgeStyles = {
    backgroundColor: "#EBECF0",
    borderRadius: "2em",
    color: "#172B4D",
    display: "inline-block",
    fontSize: 12,
    fontWeight: "normal",
    lineHeight: "1",
    minWidth: 1,
    padding: "0.16666666666667em 0.5em",
    textAlign: "center",
  };
  const formatGroupLabel = (data) => (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
  );
  const upHandler = <div style={{ color: "blue" }}>+</div>;
  const downHandler = <div style={{ color: "red" }}>-</div>;
  let positionm = ["ma", "mv1", "mh1", "mv2", "mh2"];
  let positionp = ["pa", "pv1", "ph1", "pv2", "ph2"];

  //returnJSX
  return (
    <div className="w-auto h-auto rounded-md p-4 bg-white text-xs md:text-sm text-black">
      <div className="flex ">
        <div className=" p-2 text-sm">Pilih Equipment</div>

        <Select
          onChange={(v) => {
            if (v != null) {
              datatopush.name = v.label;
            }
          }}
          className="basic-single flex-grow"
          classNamePrefix="Daftar Pompa"
          defaultValue={initvalueobj}
          isDisabled={false}
          isClearable={true}
          isRtl={false}
          isSearchable={true}
          name="color"
          options={groupedPumps}
          formatGroupLabel={formatGroupLabel}
          upHandler={upHandler}
          downHandler={downHandler}
        ></Select>
      </div>
      <div className="p-2">
        <ChakraProvider value={system}>
          <div className="flex flex-row justify-around">
            <div className="font-bold text-xs md:text-lg text-blue-600 ">A</div>
            <div className="font-bold text-xs md:text-lg text-blue-600 ">V</div>
            <div className="font-bold text-xs md:text-lg text-blue-600 ">H</div>
            <div className="font-bold text-xs md:text-lg text-blue-600 ">V</div>
            <div className="font-bold text-xs md:text-lg text-blue-600 ">H</div>
          </div>
          <Stack>
            <div className="font-bold text-xs text-blue-600">Motor</div>
            <Grid templateColumns="repeat(5, 1fr)" gap={6}>
              {positionm.map((val, i) => {
                return (
                  <InputPoint
                    callback={(e) => {
                      datatopush.vibration[0][val] = e;
                    }}
                    initvalue={initvaluedata?.[val]}
                    key={i}
                  />
                );
              })}
            </Grid>
            <div className="font-bold text-xs text-blue-600">Pump</div>
            <Grid templateColumns="repeat(5, 1fr)" gap={6}>
              {positionp.map((val, i) => {
                return (
                  <InputPoint
                    callback={(e) => {
                      datatopush.vibration[0][val] = e;
                    }}
                    initvalue={initvaluedata?.[val]}
                    key={i}
                  />
                );
              })}
            </Grid>
            <textarea
              defaultValue={initvalue?.note}
              onChange={(v) => {
                datatopush.note = v.target.value;
              }}
              className="bg-gray-50 py-2 hover:border-blue-500 focus:outline-none text-xs md:text-sm text-gray-800 rounded-lg border-gray-300 px-2 border-2 h-20"
            ></textarea>
          </Stack>
        </ChakraProvider>
      </div>
    </div>
  );
}

export default InputData;
