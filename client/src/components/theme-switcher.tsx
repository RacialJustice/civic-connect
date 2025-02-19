import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

interface ThemeSwitcherProps {
  variant?: "default" | "ghost" | "outline";
  className?: string;
  mobile?: boolean;
}

export function ThemeSwitcher({ variant = "outline", className, mobile }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size={mobile ? "default" : "icon"}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={className}
    >
      {mobile ? (
        <>
          {theme === "light" ? (
            <>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark mode</span>
            </>
          ) : (
            <>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light mode</span>
            </>
          )}
        </>
      ) : (
        <>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </>
      )}
    </Button>
  );
}