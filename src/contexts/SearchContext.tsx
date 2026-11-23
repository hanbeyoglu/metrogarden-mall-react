/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { trackSearchOpen, trackSearchClose } from '@/lib/searchAnalytics'

interface SearchContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const SearchContext = createContext<SearchContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
})

function isInputActive(): boolean {
  const el = document.activeElement
  return (
    el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLSelectElement ||
    (el instanceof HTMLElement && el.isContentEditable)
  )
}

interface SearchProviderProps {
  children: ReactNode
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  /* Track which element had focus before opening so we can restore it */
  const previousFocusRef = useRef<Element | null>(null)

  const open = useCallback(() => {
    previousFocusRef.current = document.activeElement
    setIsOpen(true)
    trackSearchOpen()
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    trackSearchClose()
    /* Restore focus after close animation */
    requestAnimationFrame(() => {
      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus()
      }
    })
  }, [])

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      if (prev) {
        trackSearchClose()
        requestAnimationFrame(() => {
          if (previousFocusRef.current instanceof HTMLElement) {
            previousFocusRef.current.focus()
          }
        })
      } else {
        previousFocusRef.current = document.activeElement
        trackSearchOpen()
      }
      return !prev
    })
  }, [])

  /* Global keyboard shortcuts */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      /* Cmd+K / Ctrl+K */
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggle()
        return
      }
      /* "/" — only when no input is focused */
      if (e.key === '/' && !isInputActive()) {
        e.preventDefault()
        previousFocusRef.current = document.activeElement
        setIsOpen(true)
        trackSearchOpen()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggle])

  return (
    <SearchContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch(): SearchContextValue {
  return useContext(SearchContext)
}
