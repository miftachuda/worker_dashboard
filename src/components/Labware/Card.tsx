import React, { useEffect, useMemo, useState } from "react";
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

type TagData = {
  TagName: string;
  Value: number[];
};

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

async function fetchPHDData(payload: PHDRequest[]) {
  const response = await fetch("https://phd.miftachuda.my.id/GetData", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function detectModeStrict(datafeed: TagData[]): string | null {
  const has = (key: string) =>
    datafeed.some((d) => d.TagName.includes(key) && d.Value?.[0] !== 0);

  if (has("LA") || has("LB")) return "LMO";
  if (has("MA") || has("MB")) return "MMO";
  if (has("DA") || has("DB")) return "DAO";
  return null;
}

function parseLimit(val: unknown): number {
  if (val === null || val === undefined || val === "") return NaN;
  return Number(val);
}
function astmToNumber(value: string | number): number | null {
  if (value === null || value === undefined) return null;

  const clean = String(value).trim().toUpperCase();

  // Convert: L2.5 → 2.5 , D3.0 → 3.0 , 3.0 → 3.0
  const num = parseFloat(clean.replace(/^[LD]/, ""));

  return isNaN(num) ? null : num;
}

/**
 * PASS if value is BELOW OR EQUAL to max ASTM limit
 */
function isASTMWithinMax(
  value: string | number,
  maxLimit: string | number
): boolean {
  const v = astmToNumber(value);
  const max = astmToNumber(maxLimit);

  if (v === null || max === null) return false;

  return v <= max; // ✅ equality accepted
}

function getLimitBySampleAndParam(
  data: SampleLimit[],
  sampleCode: string,
  paramName: string
) {
  return (
    data.find(
      (i) => i.sample_code === sampleCode && i.param_name === paramName
    ) || null
  );
}

const DarkSampleGroups: React.FC<{
  data: any;
  loading?: boolean;
  limit: SampleLimit[];
}> = ({ data, loading = false, limit }) => {
  // ✅ ALL HOOKS MUST ALWAYS RUN
  const [mode023, setMode023] = useState<TagData[] | null>(null);
  const [mode024, setMode024] = useState<TagData[] | null>(null);

  useEffect(() => {
    fetchPHDData(payload023).then(setMode023).catch(console.error);
    fetchPHDData(payload024).then(setMode024).catch(console.error);
  }, []);

  const grouped = useMemo(() => {
    if (!data?.samples) return {};
    return Object.entries(data.samples).reduce(
      (acc: any, [id, sample]: any) => {
        const prefix = id.substring(0, 3);
        acc[prefix] ??= {};
        acc[prefix][id] = sample;
        return acc;
      },
      {}
    );
  }, [data?.samples]);

  const feed023 = mode023 ? detectModeStrict(mode023) : null;
  const feed024 = mode024 ? detectModeStrict(mode024) : null;

  // ✅ SAFE CONDITIONAL RENDER AFTER HOOKS
  if (loading || !data?.samples) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-neutral-900 text-gray-300">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-emerald-500/40 border-t-emerald-400 rounded-full animate-spin mb-3" />
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 p-2">
      <h1 className="text-xl font-semibold mb-2 text-center">
        <span className="text-emerald-500">{data.shift}</span>
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
              {prefix === "023"
                ? ` ${feed023}`
                : prefix === "024"
                ? ` ${feed024}`
                : ""}
            </h2>

            <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
              {Object.entries(groupSamples).map(
                ([sampleId, sampleData]: any) => {
                  const { sampleName, ...properties } = sampleData;

                  return (
                    <Card
                      key={sampleId}
                      className="bg-neutral-900 border-neutral-700 text-xs"
                    >
                      <CardHeader className="pb-1">
                        <CardTitle className="flex flex-col">
                          <span className="text-emerald-400 truncate">
                            {sampleName}
                          </span>
                          <span className="text-gray-300 text-[15px]">
                            {sampleId}
                          </span>
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="pt-1">
                        <div className="grid grid-cols-2 gap-1">
                          {Object.entries(properties).map(
                            ([propName, prop]: any) => {
                              if (mode023 && sampleId.startsWith("023")) {
                                if (
                                  feed023 === "MMO" &&
                                  !sampleId.endsWith("M")
                                ) {
                                  sampleId += "M";
                                } else if (
                                  feed023 === "DAO" &&
                                  !sampleId.endsWith("D")
                                ) {
                                  sampleId += "D";
                                }
                              }
                              if (mode024 && sampleId.startsWith("024")) {
                                if (
                                  feed024 === "MMO" &&
                                  !sampleId.endsWith("M")
                                ) {
                                  sampleId += "M";
                                } else if (
                                  feed024 === "DAO" &&
                                  !sampleId.endsWith("D")
                                ) {
                                  sampleId += "D";
                                }
                              }
                              const limitValue = getLimitBySampleAndParam(
                                limit,
                                sampleId,
                                propName
                              );

                              let valueClass = "text-gray-100";

                              if (limitValue?.isNumber) {
                                // 🔥 ASTM COLOR SPECIAL HANDLING

                                // ✅ Normal numeric comparison
                                const value = Number(prop.value);
                                const low = parseLimit(limitValue?.low_limit);
                                const high = parseLimit(limitValue?.high_limit);
                                const out =
                                  (!isNaN(low) && value < low) ||
                                  (!isNaN(high) && value > high);

                                valueClass = out
                                  ? "text-red-400"
                                  : "text-green-400";
                              } else if (propName === "Color") {
                                const isPass = isASTMWithinMax(
                                  prop.value,
                                  limitValue.high_limit
                                );

                                valueClass = isPass
                                  ? "text-green-400"
                                  : "text-red-400";
                              } else if (propName === "App") {
                                const isPass =
                                  String(prop.value).toLowerCase() ===
                                  String(limitValue?.low_limit).toLowerCase();

                                valueClass = isPass
                                  ? "text-green-400"
                                  : "text-red-400";
                              }

                              return (
                                <div
                                  key={propName}
                                  className="bg-neutral-700/40 rounded p-1"
                                >
                                  <div className="text-gray-400 text-[10px] truncate">
                                    {propName}
                                  </div>
                                  <div
                                    className={`font-semibold text-[12px] ${valueClass}`}
                                  >
                                    {prop.value}
                                    {prop.unit && (
                                      <span className="text-gray-400 text-[11px] ml-1">
                                        {prop.unit}
                                      </span>
                                    )}
                                  </div>
                                  {limitValue && (
                                    <div className="text-[11px] text-gray-300 flex flex-col">
                                      <span className="text-blue-400 font-semibold">
                                        Spec:
                                      </span>

                                      {!limitValue?.low_limit &&
                                      !limitValue?.high_limit ? (
                                        "N/A"
                                      ) : limitValue?.low_limit &&
                                        limitValue?.high_limit ? (
                                        <>
                                          {limitValue.low_limit}
                                          {" <> "}
                                          {limitValue.high_limit}
                                        </>
                                      ) : limitValue?.low_limit ? (
                                        limitValue?.isNumber ? (
                                          <span>
                                            Min: {limitValue.low_limit}
                                          </span>
                                        ) : (
                                          limitValue.low_limit
                                        )
                                      ) : limitValue?.isNumber ? (
                                        <span>
                                          Max: {limitValue.high_limit}
                                        </span>
                                      ) : (
                                        limitValue.high_limit
                                      )}
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
