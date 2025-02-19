import { Header } from "./header";
import { Footer } from "./footer";
import { PWAPrompt } from "@/components/ui/pwa-prompt";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <PWAPrompt />
    </div>
  );
}