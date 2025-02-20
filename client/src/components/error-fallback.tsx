import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function ErrorFallback() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground">There was an error loading this content</p>
      <Button 
        onClick={() => window.location.reload()}
        variant="outline"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}
