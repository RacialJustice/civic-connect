import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import { 
  type SelectOfficial,
  type SelectCommunity,
  type SelectForum,
  type SelectParliamentarySession,
  type SelectDevelopmentProject 
} from "@shared/schema";

type SearchCategory = "officials" | "communities" | "forums" | "parliament" | "projects";

export function SearchInterface() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<SearchCategory>("officials");
  const [location, setLocation] = useState("");

  const { data: searchResults, isLoading } = useQuery({
    queryKey: [`/api/search/${category}`, searchTerm, location],
    enabled: searchTerm.length > 2 || location.length > 2,
  });

  const renderResult = (item: any) => {
    switch (category) {
      case "officials":
        const official = item as SelectOfficial;
        return (
          <Card key={official.id} className="mb-4">
            <CardHeader>
              <CardTitle>{official.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {official.role} - {official.party}
              </p>
              <p className="text-sm">
                {[
                  official.ward,
                  official.constituency,
                  official.county
                ].filter(Boolean).join(", ")}
              </p>
            </CardContent>
          </Card>
        );

      case "communities":
        const community = item as SelectCommunity;
        return (
          <Card key={community.id} className="mb-4">
            <CardHeader>
              <CardTitle>{community.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Type: {community.type}
              </p>
              <p className="text-sm">Population: {community.population || "N/A"}</p>
              <p className="text-sm">{community.description}</p>
            </CardContent>
          </Card>
        );

      // Add more cases for other categories...
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select onValueChange={(value) => setCategory(value as SearchCategory)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="officials">Officials</SelectItem>
            <SelectItem value="communities">Communities</SelectItem>
            <SelectItem value="forums">Forums</SelectItem>
            <SelectItem value="parliament">Parliamentary Sessions</SelectItem>
            <SelectItem value="projects">Development Projects</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Input
          placeholder="Location (Ward, Constituency, County)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <Button disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          searchResults?.map(renderResult)
        )}
      </div>
    </div>
  );
}
