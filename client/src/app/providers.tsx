'use client';

import { useEffect, useState } from 'react';
import { FUTURE_FLAGS } from 'react-router-dom';

// Enable future flags
FUTURE_FLAGS.v7_startTransition = true;
FUTURE_FLAGS.v7_relativeSplatPath = true;

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen" />;
  }

  return <>{children}</>;
}
