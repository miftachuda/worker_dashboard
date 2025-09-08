import React from "react";
import { Timeline } from "primereact/timeline";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";

// If you're using Next.js or Vite, make sure you've installed:
// npm i primereact primeicons
// and imported PrimeReact themes and base CSS in your app entry, e.g.:
// import "primereact/resources/themes/lara-light-blue/theme.css";
// import "primereact/resources/primereact.min.css";
// import "primeicons/primeicons.css";

export type TimelineEvent = {
  id: string | number;
  title: string;
  date: string; // e.g. "2025-09-03" or a pretty string
  status?: "planned" | "in-progress" | "done" | "blocked" | string;
  description?: string;
  icon?: string; // primeicons class, e.g. "pi pi-check"
  color?: string; // marker color, any CSS color
  image?: string; // optional thumbnail
  cta?: { label: string; onClick?: () => void; href?: string };
};

/**
 * Vertical timeline with fully custom card content in ONE component.
 * Drop it anywhere and pass your events array.
 */
export default function VerticalTimelineWithCards({
  events,
  align = "alternate",
  showOpposite = true,
}: {
  events: TimelineEvent[];
  /** "left" | "right" | "alternate" */
  align?: "left" | "right" | "alternate";
  /** show the date/status on the opposite side */
  showOpposite?: boolean;
}) {
  const marker = (item: TimelineEvent) => (
    <span
      className="flex h-4 w-4 items-center justify-center rounded-full border"
      style={{
        background: item.color || "var(--p-primary-100, #e0f2fe)",
        borderColor: item.color || "var(--p-primary-400, #60a5fa)",
      }}
    >
      <i className={`${item.icon || "pi pi-circle-fill"} text-xs`} />
    </span>
  );

  const opposite = (item: TimelineEvent) => (
    <div className="text-xs opacity-80">
      <div className="font-medium">{formatDate(item.date)}</div>
      {item.status && (
        <div className="mt-1">
          <Tag
            value={item.status}
            severity={statusToSeverity(item.status)}
            rounded
          />
        </div>
      )}
    </div>
  );

  const content = (item: TimelineEvent) => (
    <Card className="shadow-md rounded-2xl">
      <div className="flex items-start gap-3">
        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            className="h-14 w-14 rounded-xl object-cover border"
          />
        )}
        <div className="min-w-0">
          <div className="text-sm font-semibold">{item.title}</div>
          {item.description && (
            <p className="mt-1 text-sm leading-relaxed opacity-90">
              {item.description}
            </p>
          )}
          {item.cta && (
            <div className="mt-3">
              {item.cta.href ? (
                <a href={item.cta.href} target="_blank" rel="noreferrer">
                  <Button
                    size="small"
                    label={item.cta.label}
                    icon="pi pi-external-link"
                  />
                </a>
              ) : (
                <Button
                  size="small"
                  label={item.cta.label}
                  icon="pi pi-arrow-right"
                  onClick={item.cta.onClick}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-4">
      <Timeline
        value={events}
        align={align}
        opposite={showOpposite ? opposite : undefined}
        content={content}
        marker={marker}
      />
    </div>
  );
}

// --- helpers ---
function formatDate(input: string) {
  try {
    // If it's already human text, just return as-is
    if (!/\d{4}-\d{2}-\d{2}/.test(input)) return input;
    const d = new Date(input);
    if (isNaN(d.getTime())) return input;
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return input;
  }
}

function statusToSeverity(
  status?: string
): "success" | "info" | "warning" | "danger" | undefined {
  if (!status) return undefined;
  const s = status.toLowerCase();
  if (["done", "completed", "success"].includes(s)) return "success";
  if (["in-progress", "ongoing", "active"].includes(s)) return "info";
  if (["blocked", "failed", "error"].includes(s)) return "danger";
  if (["planned", "pending", "queued"].includes(s)) return "warning";
  return undefined;
}

// --- Example usage (remove if not needed) ---
