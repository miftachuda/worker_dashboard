import { RecordModel } from "pocketbase";
import React, { useState } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { Button } from "./ui/button";
import { Edit } from "lucide-react";
import PocketBase from "pocketbase";

function formatTimestampToDateString(timestamp: number): string {
  const date = new Date(timestamp * 1000); // convert seconds → milliseconds
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" }); // e.g., "Oct"
  const year = date.getFullYear();
  return `${hours}.${minutes} ${day}.${month}.${year}`;
}

interface TimelineProps {
  items: RecordModel[];
}

const TimelineCanvas: React.FC<TimelineProps> = ({ items }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [editingItem, setEditingItem] = useState<RecordModel | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEdit = (item: RecordModel) => {
    setEditingItem(item);
    setOpenEdit(true);
  };

  const handleClose = () => {
    setOpenEdit(false);
    setEditingItem(null);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    setLoading(true);
    try {
      const pb = new PocketBase(
        import.meta.env.VITE_PB_URL || "https://your-pocketbase-url"
      );
      await pb.collection("maintenance_collection").update(editingItem.id, {
        title: editingItem.title,
        description: editingItem.description,
      });
      console.log("Record updated:", editingItem.id);
      handleClose();
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const isEmpty = !items || items.length === 0;

  return (
    <div className="bg-gray-900 min-h-screen py-10 text-white relative">
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
            {items.map((item, index) => {
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

              return (
                <VerticalTimelineElement
                  key={index}
                  className="vertical-timeline-element"
                  date={`${formatTimestampToDateString(
                    item.start_time
                  )} - ${formatTimestampToDateString(item.end_time)} `}
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
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-gray-300 hover:text-white hover:bg-gray-700"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>

                  <h3 className="vertical-timeline-element-title font-medium">
                    {item.title}
                  </h3>
                  <p className="!font-extralight text-gray-400">
                    {item.description}
                  </p>

                  <div className="absolute bottom-2 right-3 text-xs text-gray-400 italic">
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

      {openEdit && editingItem && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Edit Maintenance Record
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                value={editingItem.title}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, title: e.target.value })
                }
                placeholder="Title"
                className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
              />

              <textarea
                value={editingItem.description}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    description: e.target.value,
                  })
                }
                placeholder="Description"
                className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white min-h-[100px]"
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="ghost"
                onClick={handleClose}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineCanvas;
