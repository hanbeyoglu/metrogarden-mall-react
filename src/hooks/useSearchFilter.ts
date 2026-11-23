import { useMemo } from 'react'

/**
 * Client-side search filter over an array of objects.
 * Searches the specified fields (case-insensitive, diacritic-aware).
 * Returns the original array when query is empty.
 */
export function useSearchFilter<T extends Record<string, unknown>>(
  items: T[],
  searchFields: (keyof T)[],
  query: string,
): T[] {
  return useMemo(() => {
    const trimmed = query.trim()
    if (!trimmed) return items

    const normalizedQuery = normalize(trimmed)

    return items.filter((item) =>
      searchFields.some((field) => {
        const value = item[field]
        if (typeof value !== 'string') return false
        return normalize(value).includes(normalizedQuery)
      }),
    )
  }, [items, searchFields, query])
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
}
