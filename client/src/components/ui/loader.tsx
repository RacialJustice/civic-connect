import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8'
};

export function Loader({ className, size = 'md', ...props }: LoaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center min-h-[200px]",
        className
      )}
      {...props}
    >
      <Loader2 
        className={cn(
          "animate-spin text-muted-foreground",
          sizeClasses[size]
        )} 
      />
    </div>
  );
}