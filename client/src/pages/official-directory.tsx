import { useQuery } from "@tanstack/react-query";
import { OfficialCard } from "@/components/official-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "@/components/error-boundary";

export default function OfficialDirectory() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");

  const { data: officials, isLoading } = useQuery<any[]>({
    queryKey: ["/api/officials"],
  });

  const filteredOfficials = officials?.filter((official) => {
    const matchesSearch = official.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesLevel = !level || level === 'all' || official.level === level;

    return matchesSearch && matchesLevel;
  });

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold">Official Directory</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Find and connect with elected officials
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select government level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="national">National Level</SelectItem>
                <SelectItem value="county">County Level</SelectItem>
                <SelectItem value="constituency">Constituency Level</SelectItem>
                <SelectItem value="ward">Ward Level</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Search officials by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <ErrorBoundary>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredOfficials?.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOfficials.map((official) => (
                <OfficialCard key={official.id} official={official} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              No officials found for the selected criteria. Try adjusting your filters.
            </div>
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
}