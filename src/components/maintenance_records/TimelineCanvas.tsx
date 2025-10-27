import { RecordModel } from "pocketbase";
import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import MiniTimeline from "./MiniTimeline";
import "swiper/css";
import { PreviewPhotoSlider } from "./PhotoSlide";
import EditRecordPopup from "./editRecordPopup";

function formatTimestampToDateString(timestamp?: number | null): string {
  const date =
    !timestamp || isNaN(timestamp) ? new Date() : new Date(timestamp * 1000);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-GB", { month: "short" }); // e.g. Dec
  const year = date.getFullYear();

  return `${day}-${month}-${year} ${hours}.${minutes}`;
}
function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" }); // e.g., "Oct"
  const year = date.getFullYear();
  return ` ${day} ${month} ${year}, ${hours}.${minutes}`;
}
function calculateDuration(start?: number | null, end?: number | null): string {
  const startTime = !start || isNaN(start) ? Date.now() / 1000 : start;
  const endTime = !end || isNaN(end) ? Date.now() / 1000 : end;
  const diffSeconds = endTime - startTime;
  const totalMinutes = Math.floor(diffSeconds / 60);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const parts = [];
  if (days > 0) parts.push(`${days} Day${days > 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} Hour${hours > 1 ? "s" : ""}`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes} Min`);

  return parts.join(" ");
}

interface TimelineProps {
  items: RecordModel[];
  onReload?: () => void;
}

const TimelineCanvas: React.FC<TimelineProps> = ({ items, onReload }) => {
  const isEmpty = !items || items.length === 0;

  return (
    <div className="bg-gray-900  h-screen pt-10 pb-40 text-white relative overflow-auto">
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h2 className="text-2xl font-semibold mb-2">
            Maintenance record not found
          </h2>
          <p className="text-gray-400">No timeline data available.</p>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-center">
            {items[0].expand?.nametag?.nametag || "Maintenance Timeline"}
          </h2>
          <h3 className="text-base text-center mb-10 text-gray-400">
            {items[0].expand?.nametag?.description}
          </h3>

          <VerticalTimeline>
            {items
              .slice() // prevent mutating the original array
              .sort((a, b) => {
                const now = Math.floor(Date.now() / 1000); // current UNIX timestamp in seconds

                const aTime = isNaN(Number(a.start_time))
                  ? now
                  : Number(a.start_time);
                const bTime = isNaN(Number(b.start_time))
                  ? now
                  : Number(b.start_time);

                return bTime - aTime; // descending (newest first)
              })
              .map((item, index) => {
                const color = "rgb(9, 6, 84)";
                let initials: string;
                const isEdited = item.updated !== item.created;

                switch (item.discipline) {
                  case "Electrical":
                    initials = "ELC";
                    break;
                  case "Stationary":
                    initials = "STA";
                    break;
                  case "Rotating":
                    initials = "ROT";
                    break;
                  case "Instrumentation":
                    initials = "INS";
                    break;
                  default:
                    initials = "N/A";
                    break;
                }

                const disciplineColors: Record<string, string> = {
                  Stationary: "#C0392B",
                  Electrical: "#2980B9",
                  Rotating: "#27AE60",
                  Instrumentation: "#8E44AD",
                  Default: "#7F8C8D",
                };

                const iconColor =
                  disciplineColors[
                    item.discipline as keyof typeof disciplineColors
                  ] || disciplineColors.Default;
                const start = formatTimestampToDateString(item.start_time);
                const end = formatTimestampToDateString(item.end_time);
                return (
                  <VerticalTimelineElement
                    key={index}
                    className="vertical-timeline-element"
                    date={
                      <div
                        style={{
                          transform: "translateY(-30%)",
                        }}
                        className="mx-4"
                      >
                        <MiniTimeline
                          steps={[
                            { time: end, label: item.status },
                            { time: start, label: "Start" },
                          ]}
                          align={index % 2 === 0 ? "left" : "right"}
                          duration={calculateDuration(
                            item.start_time,
                            item.end_time
                          )}
                          status={item.status}
                        />

                        {/* This div will be aligned to the right */}
                      </div>
                    }
                    contentStyle={{ background: color }}
                    contentArrowStyle={{ borderRight: `15px solid ${color}` }}
                    iconStyle={{
                      background: iconColor,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                    }}
                    icon={<span>{initials}</span>}
                  >
                    <div className="absolute top-2 right-2">
                      <EditRecordPopup items={item} onCreated={onReload} />
                    </div>

                    <h3 className="vertical-timeline-element-title font-medium">
                      {item.title}
                    </h3>
                    <div className="bg-blue-950 border text-gray-50 border-gray-300 rounded-[5px] px-3 py-1 whitespace-pre-line  font-thin italic mb-8">
                      {item.description}
                    </div>
                    <div className="mb-2">
                      {item.photo?.length > 0 && (
                        <PreviewPhotoSlider item={item} images={item.photo} />
                      )}
                    </div>

                    <div className="absolute bottom-2 right-3 text-[9px] leading-tight text-gray-400 italic">
                      {isEdited && (
                        <>Edited: {formatTimestamp(item.updated)} · </>
                      )}
                      Created: {formatTimestamp(item.created)}
                    </div>
                  </VerticalTimelineElement>
                );
              })}
          </VerticalTimeline>
        </>
      )}
    </div>
  );
};

export default TimelineCanvas;
