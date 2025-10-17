import React, { useEffect, useState } from "react";

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
      className={`relative flex items-center justify-end
    ${
      align === "left"
        ? "flex-row-reverse text-left lg:flex-row-reverse lg:text-right"
        : "flex-row-reverse text-left lg:flex-row"
    }`}
    >
      <div className="px-4 text-[11px] font-thin">{`( ${duration} )`}</div>
      <div
        className={`relative flex flex-col space-y-1 px-0 ${
          align === "right" ? "lg:items-end items-start" : "items-start"
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
            <div
              key={index}
              className={`flex items-center relative 
    flex-row  // default (mobile)
    ${align === "right" ? "lg:flex-row-reverse" : "lg:flex-row"}
  `}
            >
              <div className="text-sm text-gray-500 whitespace-nowrap mx-1">
                {step.time}
              </div>
              {dot}
              <div
                className={`font-medium mx-1 ${
                  isActive ? "text-blue-700" : "text-gray-300"
                }`}
              >
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MiniTimeline;
