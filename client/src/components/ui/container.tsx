import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className="min-h-screen bg-background py-8">
      <div 
        className={cn(
          "container mx-auto px-6 py-8 md:px-8 lg:px-12 max-w-7xl",
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
