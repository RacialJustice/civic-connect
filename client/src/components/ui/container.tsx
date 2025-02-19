import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className="min-h-screen bg-background">
      <div 
        className={cn(
          "container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-7xl",
          "rounded-lg border bg-card shadow-sm",
          className
        )} 
        {...props}
      >
        {children}
      </div>
    </div>
  );
}