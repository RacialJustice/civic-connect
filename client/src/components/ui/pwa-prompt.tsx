import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const PROMPT_STORAGE_KEY = 'pwa-prompt-last-shown';
const PROMPT_DECLINED_KEY = 'pwa-prompt-declined';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function PWAPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if PWA is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (isInstalled) {
      return;
    }

    // Check if user has declined the prompt
    const hasDeclined = localStorage.getItem(PROMPT_DECLINED_KEY) === 'true';
    if (hasDeclined) {
      return;
    }

    // Check when prompt was last shown
    const lastShown = localStorage.getItem(PROMPT_STORAGE_KEY);
    if (lastShown) {
      const timeSinceLastPrompt = Date.now() - parseInt(lastShown);
      if (timeSinceLastPrompt < ONE_WEEK_MS) {
        return;
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsOpen(true);
      localStorage.setItem(PROMPT_STORAGE_KEY, Date.now().toString());
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Monitor installation status
    window.addEventListener('appinstalled', () => {
      setIsOpen(false);
      setDeferredPrompt(null);
      console.log('PWA installed successfully');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.log('No installation prompt available');
      return;
    }

    try {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user's choice
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      
      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
      } else {
        console.log('PWA installation declined');
      }
    } catch (error) {
      console.error('Error during PWA installation:', error);
    } finally {
      // Clear the saved prompt
      setDeferredPrompt(null);
      setIsOpen(false);
    }
  };

  const handleDecline = () => {
    localStorage.setItem(PROMPT_DECLINED_KEY, 'true');
    setIsOpen(false);
  };

  const handleDefer = () => {
    // Just close the prompt, it will show again after a week
    setIsOpen(false);
  };

  if (!deferredPrompt) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="bottom" className="h-auto max-w-none sm:max-w-xl sm:mx-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">Install CivicConnect</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <p className="text-base">
              Install CivicConnect for a better experience:
            </p>
            <ul className="ml-6 space-y-1 text-sm text-muted-foreground list-disc">
              <li>Quick access from your home screen</li>
              <li>Faster loading times</li>
              <li>Works offline</li>
              <li>Real-time notifications</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6">
            <Button 
              onClick={handleInstall}
              className="flex-1"
              size="lg"
            >
              Install Now
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDefer}
              className="flex-1"
              size="lg"
            >
              Remind Me Later
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleDecline}
              className="flex-1"
              size="lg"
            >
              Don't Show Again
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}