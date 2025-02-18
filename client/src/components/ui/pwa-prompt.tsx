import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function PWAPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      setIsOpen(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // Clear the saved prompt regardless of outcome
    setDeferredPrompt(null);
    setIsOpen(false);

    // Optionally log the outcome
    console.log(`User ${outcome} the PWA installation`);
  };

  if (!deferredPrompt) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="bottom" className="h-[200px]">
        <SheetHeader>
          <SheetTitle>Add to Home Screen</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-4">
          <p>Add our app to your home screen for quick and easy access!</p>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Maybe Later
            </Button>
            <Button onClick={handleInstall}>
              Install
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
