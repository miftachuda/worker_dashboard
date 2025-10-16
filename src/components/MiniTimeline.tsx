import React from "react";

interface TimelineStep {
  time: string;
  label: string;
}

interface MiniTimelineProps {
  steps: [TimelineStep, TimelineStep];
  duration: string;
  activeIndex?: number;
  align?: "left" | "right";
}

const MiniTimeline: React.FC<MiniTimelineProps> = ({
  steps,
  activeIndex = 0,
  duration,
  align = "left",
}) => {
  return (
    // This part remains the same - it correctly aligns the whole block
    <div
      className={`relative flex items-center justify-end ${
        align === "left" ? "flex-row-reverse text-right" : "flex-row text-left"
      }`}
    >
      <div className="px-4 text-[11px] font-thin">{`( ${duration} )`}</div>
      <div
        className={`relative flex flex-col space-y-1 px-0 ${
          align === "right" ? "items-end" : "items-start"
        }`}
      >
        {steps.map((step, index) => {
          const isActive = index <= activeIndex;
          const dot = (
            <div
              className={`w-3 h-3 rounded-full border-2 z-10 ${
                isActive
                  ? "bg-blue-500 border-blue-500 shadow-[0_0_4px_rgba(59,130,246,0.5)]"
                  : "bg-gray-300 border-gray-300"
              }`}
            />
          );

          return (
            // We now use a ternary operator to render two different layouts
            // based on the 'align' prop.
            <div key={index} className="flex items-center relative">
              {align === "right" ? (
                // ✅ RIGHT-ALIGNED LAYOUT: [Label] [Dot] [Time]
                <>
                  <div
                    className={`mr-2 font-medium ${
                      // Note: margin is now mr-2
                      isActive ? "text-blue-700" : "text-gray-300"
                    }`}
                  >
                    {step.label}
                  </div>
                  {dot}
                  <div className="text-sm text-gray-500 text-left whitespace-nowrap ml-3">
                    {" "}
                    {/* Note: margin is now ml-3 */}
                    {step.time}
                  </div>
                </>
              ) : (
                // ✅ LEFT-ALIGNED LAYOUT (Original): [Time] [Dot] [Label]
                <>
                  <div className="text-sm text-gray-500 text-right whitespace-nowrap mr-3">
                    {step.time}
                  </div>
                  {dot}
                  <div
                    className={`ml-2 font-medium ${
                      isActive ? "text-blue-700" : "text-gray-300"
                    }`}
                  >
                    {step.label}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MiniTimeline;
