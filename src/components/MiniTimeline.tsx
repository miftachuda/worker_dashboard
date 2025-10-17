import React, { useEffect, useState } from "react";

interface TimelineStep {
  time: string;
  label: string;
}

interface MiniTimelineProps {
  steps: [TimelineStep, TimelineStep];
  duration: string;

  align?: "left" | "right";
  status: string;
}

const MiniTimeline: React.FC<MiniTimelineProps> = ({
  steps,
  duration,
  align = "left",
  status,
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
          var dotColor = "bg-gray-300 border-gray-300 ";
          if (step.label == "Start") {
            dotColor = "bg-gray-300 border-gray-300";
          } else {
            dotColor = "bg-gray-300 border-gray-300 ";
            if (status == "Completed") {
              dotColor =
                "bg-green-500 border-green-500 shadow-[0_0_4px_rgba(34,197,94,0.5)]";
            } else if (status == "In Progress") {
              dotColor =
                "bg-yellow-500 border-yellow-500 shadow-[0_0_4px_rgba(249,115,22,0.5)]";
            }
          }
          var fontColor = "text-gray-100";
          if (step.label == "Start") {
            fontColor = "text-gray-100";
          } else {
            if (status == "Completed") {
              fontColor = "text-green-500";
            } else if (status == "In Progress") {
              fontColor = "text-yellow-500";
            } else if (status == "Pending") {
              fontColor = "text-yellow-200";
            }
          }

          const dot = (
            <div className={`w-3 h-3 rounded-full border-2 z-10 ${dotColor}`} />
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
              <div className={`font-medium mx-1 ${fontColor}`}>
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
