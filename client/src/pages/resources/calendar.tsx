
import { Calendar } from "@/components/ui/calendar";

export default function CalendarPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Calendar</h1>
      <div className="max-w-md mx-auto bg-card rounded-lg shadow p-4">
        <Calendar mode="single" />
      </div>
    </div>
  );
}
