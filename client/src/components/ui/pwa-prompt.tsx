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
      // Force the prompt to be visible for testing
      setIsOpen(true);
      console.log('beforeinstallprompt event fired');
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if the app is already installed
    window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
      console.log('Display mode changed:', e.matches ? 'standalone' : 'browser');
    });

    // Log service worker registration status
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        console.log('Service Worker registration status:', registration ? 'registered' : 'not registered');
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.log('No deferred prompt available');
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);

    // Clear the saved prompt regardless of outcome
    setDeferredPrompt(null);
    setIsOpen(false);
  };

  // Force show the prompt for testing
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setIsOpen(true);
        console.log('Showing PWA prompt after timeout');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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