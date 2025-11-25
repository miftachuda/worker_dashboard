import { useEffect, useState } from "react";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { pb } from "@/lib/pocketbase";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";
dayjs.extend(relativeTime);
dayjs.locale("id");
interface EventItem {
  id: string;
  title: string;
  message?: string;
  page: string;
  created: string;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const result = await pb.collection("events").getList<EventItem>(1, 10, {
        sort: "-created",
      });
      setEvents(result.items);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {events.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {events.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" side="bottom" className="w-80 p-3">
        <p className="font-semibold text-sm mb-2">Notifications</p>

        <div className="space-y-3 max-h-[350px] overflow-y-auto">
          {loading && (
            <p className="text-sm text-muted-foreground">Loading...</p>
          )}

          {!loading && events.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No notifications available
            </p>
          )}

          {events.map((event) => (
            <div
              key={event.id}
              className="p-3 border rounded-xl hover:bg-muted/50 transition cursor-pointer"
              onClick={() => {
                window.location.href = `/#/${event.page}`;
              }}
            >
              <p className="font-medium text-sm">{event.title}</p>
              {event.message && (
                <p className="text-xs text-muted-foreground">{event.message}</p>
              )}
              <p className="text-[10px] text-muted-foreground mt-1 mr-1">
                {dayjs(event.created).fromNow()}
              </p>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
