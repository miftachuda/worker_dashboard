import React from "react";
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

  const { samples, shift } = data;

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

                                if (
                                  numericValue < limitValue.low ||
                                  numericValue > limitValue.high
                                ) {
                                  valueClass = "text-red-400"; // ❌ out of limit
                                } else {
                                  valueClass = "text-green-400"; // ✅ within limit
                                }
                              } else if (limitValue && !limitValue.isNumber) {
                                valueClass = "text-gray-100"; // non-numeric parameter (status, visual, etc)
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
