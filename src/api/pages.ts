import type { CmsPage } from '@/types'
import { getPublicData } from './public'
import type { CmsPageData } from './cmsTypes'

export async function getCmsPage(slug: string): Promise<CmsPage> {
  const page = await getPublicData<CmsPageData>(`/public/pages/${encodeURIComponent(slug)}`)
  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    content: page.contentHtml ?? undefined,
    sections: page.blocks.map((block) => {
      const data = block.dataJson && typeof block.dataJson === 'object'
        ? (block.dataJson as Record<string, unknown>)
        : {}
      const content = [data.content, data.body, data.text].find((value): value is string => typeof value === 'string')
      const image = typeof data.image === 'string'
        ? data.image
        : data.image && typeof data.image === 'object' && 'url' in data.image && typeof data.image.url === 'string'
          ? data.image.url
          : undefined
      return {
        id: block.id,
        title: block.title || (typeof data.title === 'string' ? data.title : block.type),
        content,
        image,
        order: block.sortOrder,
      }
    }),
    last_updated: page.publishedAt ?? undefined,
    meta: {
      title: page.seoTitle ?? undefined,
      description: page.seoDescription ?? undefined,
    },
  }
}
