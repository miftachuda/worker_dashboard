import VerticalTimelineWithCards, { TimelineEvent } from "./Timeline";

function statusToSeverity(
  status?: string
): "success" | "info" | "warn" | "danger" | undefined {
  if (!status) return undefined;
  const s = status.toLowerCase();
  if (["done", "completed", "success"].includes(s)) return "success";
  if (["in-progress", "ongoing", "active"].includes(s)) return "info";
  if (["blocked", "failed", "error"].includes(s)) return "danger";
  if (["planned", "pending", "queued"].includes(s)) return "warn";
  return undefined;
}

// --- Example usage (remove if not needed) ---
export function DemoTimeline() {
  const sampleEvents: TimelineEvent[] = [
    {
      id: 1,
      title: "Project Kickoff",
      date: "2025-08-01",
      status: "done",
      description: "Stakeholder alignment and scope definition.",
      icon: "pi pi-check",
      color: "#86efac",
    },
    {
      id: 2,
      title: "Design Sprint",
      date: "2025-08-10",
      status: "in-progress",
      description: "Wireframes, prototypes, and usability tests.",
      icon: "pi pi-palette",
      color: "#93c5fd",
      image:
        "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=300&auto=format&fit=crop",
      cta: { label: "View Figma", href: "https://figma.com" },
    },
    {
      id: 3,
      title: "Development",
      date: "2025-08-20",
      status: "planned",
      description: "Implement core features and CI/CD pipeline.",
      icon: "pi pi-code",
      color: "#fde68a",
    },
    {
      id: 4,
      title: "Launch",
      date: "2025-09-30",
      status: "planned",
      description: "Public release with marketing push.",
      icon: "pi pi-send",
      color: "#fca5a5",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">
        Demo — Vertical Timeline with Custom Cards
      </h2>
      <VerticalTimelineWithCards events={sampleEvents} />
    </div>
  );
}
