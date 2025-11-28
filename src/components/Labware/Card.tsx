import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SampleLimit } from "@/types/SampleLimit";

const groupColors = [
  "border-emerald-500/40 shadow-emerald-500/30",
  "border-blue-500/40 shadow-blue-500/30",
  "border-pink-500/40 shadow-pink-500/30",
  "border-orange-500/40 shadow-orange-500/30",
  "border-purple-500/40 shadow-purple-500/30",
  "border-cyan-500/40 shadow-cyan-500/30",
];

const DarkSampleGroups: React.FC<{
  data: any;
  loading?: boolean;
  limit: SampleLimit[];
}> = ({ data, loading = false, limit }) => {
  if (loading || !data || !data.samples) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-neutral-900 text-gray-300">
        <div className="w-8 h-8 border-4 border-emerald-500/40 border-t-emerald-400 rounded-full animate-spin mb-3"></div>
        <p>Loading data...</p>
      </div>
    );
  }
  const [mode023, setMode023] = useState<any>(null);
  const [mode024, setMode024] = useState<any>(null);

  useEffect(() => {
    fetchPHDData(payload023)
      .then((res) => setMode023(res))
      .catch((err) => console.error(err));
    fetchPHDData(payload024)
      .then((res) => setMode024(res))
      .catch((err) => console.error(err));
  }, []);

  const { samples, shift } = data;
  interface PHDRequest {
    SampleInterval: number;
    GetEnum: boolean;
    ResampleMethod: string;
    MinimumConfidence: number;
    MaxRows: number;
    TimeFormat: number;
    ReductionData: string;
    TagName: string[];
    StartTime: string;
    EndTime: string;
    OutputTimeFormat: number;
    EventSequence: number;
  }
  const payload024: PHDRequest[] = [
    {
      SampleInterval: 900000,
      GetEnum: false,
      ResampleMethod: "Around",
      MinimumConfidence: 0,
      MaxRows: 100,
      TimeFormat: 6,
      ReductionData: "snapshot",
      TagName: [
        "024FQI_001DA.PV",
        "024FQI_001DB.PV",
        "024FQI_001MA.PV",
        "024FQI_001MB.PV",
        "024FQI_001LA.PV",
        "024FQI_001LB.PV",
      ],
      StartTime: "NOW",
      EndTime: "NOW",
      OutputTimeFormat: 6,
      EventSequence: 0,
    },
  ];
  const payload023: PHDRequest[] = [
    {
      SampleInterval: 900000,
      GetEnum: false,
      ResampleMethod: "Around",
      MinimumConfidence: 0,
      MaxRows: 100,
      TimeFormat: 6,
      ReductionData: "snapshot",
      TagName: [
        "023FQI_004DA.PV",
        "023FQI_004DB.PV",
        "023FQI_004MA.PV",
        "023FQI_004MB.PV",
        "023FQI_004LA.PV",
        "023FQI_004LB.PV",
      ],
      StartTime: "NOW",
      EndTime: "NOW",
      OutputTimeFormat: 6,
      EventSequence: 0,
    },
  ];
  async function fetchPHDData(payload: PHDRequest[]) {
    try {
      const response = await fetch("https://phd.miftachuda.my.id/GetData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("PHD Fetch Error:", error);
      throw error;
    }
  }

  // Group samples by first 3 chars
  const grouped = Object.entries(samples).reduce((acc: any, [id, sample]) => {
    const prefix = id.substring(0, 3);
    if (!acc[prefix]) acc[prefix] = {};
    acc[prefix][id] = sample;
    return acc;
  }, {});
  function getLimitBySampleAndParam(
    data: SampleLimit[],
    sampleCode: string,
    paramName: string
  ): { low: number; high: number; isNumber: boolean } | null {
    const found = data.find(
      (item) => item.sample_code === sampleCode && item.param_name === paramName
    );

    if (!found) return null;

    return {
      low: found.low_limit,
      high: found.high_limit,
      isNumber: found.isNumber,
    };
  }
  function parseLimit(val: unknown): number {
    if (val === null || val === undefined) return NaN;

    if (typeof val === "string") {
      if (val.trim() === "") return NaN;
      return Number(val);
    }

    if (typeof val === "number") {
      return val;
    }

    return NaN;
  }

  type TagData = {
    TagName: string;
    Value: number[];
  };

  function detectModeStrict(datafeed: TagData[]): string | null {
    const hasLA = datafeed.some(
      (d) => d.TagName.includes("LA") && d.Value[0] !== 0
    );
    const hasLB = datafeed.some(
      (d) => d.TagName.includes("LB") && d.Value[0] !== 0
    );
    const hasMA = datafeed.some(
      (d) => d.TagName.includes("MA") && d.Value[0] !== 0
    );
    const hasMB = datafeed.some(
      (d) => d.TagName.includes("MB") && d.Value[0] !== 0
    );
    const hasDA = datafeed.some(
      (d) => d.TagName.includes("DA") && d.Value[0] !== 0
    );
    const hasDB = datafeed.some(
      (d) => d.TagName.includes("DB") && d.Value[0] !== 0
    );

    if (hasLA || hasLB) return "LMO";
    if (hasMA || hasMB) return "MMO";
    if (hasDA || hasDB) return "DAO";

    return null;
  }
  let feed023: string | null = null;
  let feed024: string | null = null;
  if (mode023 && mode023.length > 0) {
    feed023 = detectModeStrict(mode023);
  }
  if (mode024 && mode024.length > 0) {
    feed024 = detectModeStrict(mode024);
  }
  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 p-2 overflow-hidden">
      <h1 className="text-xl font-semibold mb-1 text-center">
        Shift: <span className="text-emerald-500">{shift}</span>
      </h1>

      <div className="space-y-4">
        {Object.entries(grouped).map(([prefix, groupSamples], idx) => (
          <div
            key={prefix}
            className={`p-3 rounded-xl border bg-neutral-800/60 shadow-md ${
              groupColors[idx % groupColors.length]
            }`}
          >
            <h2 className="text-lg font-bold mb-2 text-center text-emerald-300">
              Unit {prefix}
            </h2>

            <div
              className="
                grid 
                gap-2
                grid-cols-[repeat(auto-fit,minmax(200px,1fr))]
                justify-items-stretch
              "
            >
              {Object.entries(groupSamples).map(
                ([sampleId, sampleData]: any) => {
                  const { sampleName, ...properties } = sampleData;

                  return (
                    <Card
                      key={sampleId}
                      className="bg-neutral-900 border border-neutral-700 hover:border-emerald-500/40 transition-all duration-300 text-xs"
                    >
                      <CardHeader className="pb-1">
                        <CardTitle className="flex flex-col space-y-0.5">
                          <span className="text-emerald-400 font-medium truncate">
                            {sampleName || "Unknown Sample"}
                          </span>
                          <span className="text-gray-500 text-[10px]">
                            {sampleId}
                          </span>
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="pt-1">
                        <div className="grid grid-cols-2 gap-1">
                          {Object.entries(properties).map(
                            ([propName, prop]: any) => {
                              const limitValue = getLimitBySampleAndParam(
                                limit,
                                sampleId,
                                propName
                              );

                              let valueClass = "text-gray-100";
                              if (limitValue?.isNumber) {
                                const numericValue = Number(prop.value);

                                const low = parseLimit(limitValue.low);
                                const high = parseLimit(limitValue.high);

                                const hasLow = !isNaN(low);
                                const hasHigh = !isNaN(high);

                                let outOfLimit = false;

                                if (hasLow && numericValue < low) {
                                  outOfLimit = true;
                                }

                                if (hasHigh && numericValue > high) {
                                  outOfLimit = true;
                                }

                                valueClass = outOfLimit
                                  ? "text-red-400"
                                  : "text-green-400";
                              } else if (limitValue && !limitValue.isNumber) {
                                valueClass = "text-gray-100";
                              }

                              return (
                                <div
                                  key={propName}
                                  className="bg-neutral-700/40 rounded p-1 hover:bg-neutral-700 transition"
                                >
                                  <div className="text-gray-400 text-[10px] truncate">
                                    {propName}
                                  </div>

                                  <div
                                    className={`font-semibold text-[11px] ${valueClass}`}
                                  >
                                    {prop.value}
                                    {prop.unit && (
                                      <span className="text-gray-400 text-[9px] ml-0.5">
                                        {prop.unit}
                                      </span>
                                    )}
                                  </div>

                                  {limitValue && (
                                    <div className="text-[9px] text-gray-500">
                                      Spec: {limitValue.low} - {limitValue.high}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                }
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DarkSampleGroups;
