import { Header } from "./header";
import { PWAPrompt } from "@/components/ui/pwa-prompt";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Header />
      {children}
      <PWAPrompt />
    </div>
  );
}