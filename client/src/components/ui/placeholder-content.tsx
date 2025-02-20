import { Container } from "./container";
import { Skeleton } from "./skeleton";
import { CalendarDays, FileText, Book, BarChart, Building2 } from "lucide-react";

interface PlaceholderContentProps {
  title: string;
  description: string;
  icon: "calendar" | "document" | "report" | "updates" | "projects";
}

const icons = {
  calendar: CalendarDays,
  document: FileText,
  report: BarChart,
  updates: Book,
  projects: Building2
};

export function PlaceholderContent({ title, description, icon }: PlaceholderContentProps) {
  const Icon = icons[icon];
  
  return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <Icon className="w-16 h-16 text-muted-foreground/50 mb-6" />
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground max-w-md mb-8">{description}</p>
        <div className="w-full max-w-2xl space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-3/4 mx-auto" />
        </div>
      </div>
    </Container>
  );
}
