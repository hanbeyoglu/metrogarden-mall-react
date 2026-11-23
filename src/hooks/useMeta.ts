import { useEffect } from 'react'
import { META_DEFAULTS } from '@/lib/constants'

interface MetaOptions {
  title?: string
  description?: string
  ogImage?: string
  ogType?: string
}

/**
 * Updates document.title and meta tags on mount.
 * Should be called at the top of each page component.
 */
export function useMeta({ title, description, ogImage, ogType = 'website' }: MetaOptions): void {
  useEffect(() => {
    const fullTitle = title
      ? `${title}${META_DEFAULTS.TITLE_SUFFIX}`
      : META_DEFAULTS.SITE_NAME

    document.title = fullTitle

    const metaDescription = description ?? META_DEFAULTS.DESCRIPTION

    setMeta('description', metaDescription)
    setOgMeta('og:title', fullTitle)
    setOgMeta('og:description', metaDescription)
    setOgMeta('og:type', ogType)

    if (ogImage) {
      setOgMeta('og:image', ogImage)
    }
  }, [title, description, ogImage, ogType])
}

function setMeta(name: string, content: string): void {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setOgMeta(property: string, content: string): void {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}
