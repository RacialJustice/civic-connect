import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getAriaLabel = (text: string) => ({ 'aria-label': text });

export const getAriaDescribedBy = (id: string) => ({ 'aria-describedby': id });

export const getAriaLive = (type: 'polite' | 'assertive' = 'polite') => ({ 'aria-live': type });
