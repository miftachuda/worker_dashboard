// @ts-nocheck
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { groupedPumps } from "./listpompa";

export default function SearchBar({ onChange }) {
  const groupStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 15,
  };

  const formatGroupLabel = (data) => (
    <div style={groupStyles}>
      <span className="bg-blue-400 text-white px-3 rounded-md">
        {data.label}
      </span>
      <span className="px-2 rounded-full font-light text-indigo-50 bg-blue-400">
        {data.options.length}
      </span>
    </div>
  );
  const formatOptionLabel = (data) => <div>{data.value} </div>;
  const [query, setquery] = useState();
  useEffect(() => {
    onChange(query);
  }, [query, onChange]);

  return (
    <>
      <div className="flex-grow text-blue-600 w-auto">
        <Select
          onChange={(v) => {
            if (v != null) {
              setquery(v.map((v) => v.label));
            }
          }}
          classNamePrefix="Daftar Pompa"
          defaultValue={null}
          isDisabled={false}
          isClearable={true}
          isRtl={false}
          isSearchable={true}
          name="color"
          options={groupedPumps}
          formatGroupLabel={formatGroupLabel}
          formatOptionLabel={formatOptionLabel}
          placeholder={"Search record"}
          isMulti
        ></Select>
      </div>
    </>
  );
}
