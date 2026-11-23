/* eslint-disable no-console */
/**
 * Lightweight analytics service for search events.
 * Console-only for now — will be replaced with CMS analytics later.
 */

export function trackSearchOpen(): void {
  console.log('[Search] Opened')
}

export function trackSearchClose(): void {
  console.log('[Search] Closed')
}

export function trackSearch(query: string): void {
  console.log(`[Search] Query: "${query}"`)
}

export function trackSearchClick(type: string, id: string, title: string): void {
  console.log(`[Search] Click — type:${type} id:${id} title:"${title}"`)
}

export function trackSearchNoResults(query: string): void {
  console.log(`[Search] No results for: "${query}"`)
}
