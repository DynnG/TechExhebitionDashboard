import { EventForm } from "@/components/events/event-form";

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#133020]">Add Exhibition Event</h2>
        <p className="text-xs text-[#666666] mt-0.5">
          Enter a new strategic tech exhibition record into the database across Groups A through E.
        </p>
      </div>

      <EventForm />
    </div>
  );
}
