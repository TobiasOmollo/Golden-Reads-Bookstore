import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const safeCoverUrl = (url?: string): string =>
  url?.replace('http://', 'https://') ?? ''
