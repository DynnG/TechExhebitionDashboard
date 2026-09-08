"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { EventForm } from "@/components/events/event-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditEventPage() {
  const params = useParams();
  const id = params.id as string;
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();
        if (res.ok) {
          setEventData(data.event);
        } else {
          toast.error("Failed to load event for editing");
        }
      } catch (err) {
        toast.error("Error loading event");
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-[#046241]">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <span className="text-xs font-semibold text-[#133020]">
          Loading event record for editing...
        </span>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="py-12 text-center text-[#B91C1C] font-semibold text-sm">
        Event not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#133020]">
          Edit Exhibition Event #{eventData.eventNumber}
        </h2>
        <p className="text-xs text-[#666666] mt-0.5">
          Update specifications for {eventData.eventName}
        </p>
      </div>

      <EventForm initialData={eventData} isEditing />
    </div>
  );
}
