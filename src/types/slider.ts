export interface Slider {
  id: string
  /** CMS slider group ID; absent for local demo content. */
  analytics_id?: string
  title: string
  subtitle?: string
  eyebrow?: string
  image: string
  cta_label?: string
  cta_url?: string
  category?: string
  order: number
  is_active: boolean
}
