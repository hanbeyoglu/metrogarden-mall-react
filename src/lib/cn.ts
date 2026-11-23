import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges Tailwind classes without conflicts.
 * Uses clsx for conditional logic and tailwind-merge to resolve collisions.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
