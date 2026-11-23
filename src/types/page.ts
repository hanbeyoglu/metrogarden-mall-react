import type { MetaInfo } from './mall'

export interface PageSection {
  id: string
  eyebrow?: string
  title: string
  content?: string
  image?: string
  order: number
}

export interface PageValue {
  id: string
  icon: string
  title: string
  body: string
}

export interface CmsPage {
  id: string
  slug: string
  title: string
  content?: string
  hero_image?: string
  sections?: PageSection[]
  values?: PageValue[]
  last_updated?: string
  meta?: MetaInfo
}
