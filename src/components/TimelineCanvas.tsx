import { RecordModel } from "pocketbase";
import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

// Define the data type
export interface TimelineItem {
  type: "work" | "education";
  title: string;
  subtitle: string;
  description: string;
  date: string;
  color?: string; // optional custom color
  icon?: React.ReactNode;
}
export interface ItemTimeline {
  title: string;
  description: string;
  image?: string;
  start_time: string;
  status: string;
}

interface TimelineProps {
  items: RecordModel;
}
///TODO
const TimelineCanvas: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className="bg-gray-900 min-h-screen py-10 text-white">
      <h2 className="text-3xl font-bold text-center mb-10">My Timeline</h2>

      <VerticalTimeline>
        {items.timeline.map((item, index) => {
          const color = "rgb(233, 30, 99)";

          return (
            <VerticalTimelineElement
              key={index}
              className={`vertical-timeline-element`}
              date={item.start_time}
              contentStyle={{ background: color, color: "#fff" }}
              contentArrowStyle={{ borderRight: `7px solid ${color}` }}
              iconStyle={{ background: color, color: "#fff" }}
            >
              <h3 className="vertical-timeline-element-title">{item.title}</h3>
              <h4 className="vertical-timeline-element-subtitle">
                {item.title}
              </h4>
              <p>{item.description}</p>
            </VerticalTimelineElement>
          );
        })}
      </VerticalTimeline>
    </div>
  );
};

export default TimelineCanvas;
