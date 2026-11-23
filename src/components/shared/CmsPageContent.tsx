import type { CmsPage } from '@/types'

function htmlToText(html: string): string {
  const document = new DOMParser().parseFromString(html, 'text/html')
  return document.body.textContent?.replace(/\u00a0/g, ' ').trim() ?? ''
}

export function CmsPageContent({ page }: { page: CmsPage }) {
  const body = page.content ? htmlToText(page.content) : ''
  const sections = [...(page.sections ?? [])].sort((a, b) => a.order - b.order)

  return (
    <article className="mx-auto max-w-[960px] px-6 py-14 lg:px-12 lg:py-20">
      {body && (
        <p className="whitespace-pre-line font-sans text-[15px] leading-[1.9] text-graphite">
          {body}
        </p>
      )}
      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.id}>
            <h2 className="mb-3 font-display text-2xl font-light text-carbon">{section.title}</h2>
            {section.image && (
              <img src={section.image} alt="" className="mb-5 max-h-[420px] w-full object-cover" loading="lazy" />
            )}
            {section.content && (
              <p className="whitespace-pre-line font-sans text-[15px] leading-[1.9] text-graphite">
                {section.content}
              </p>
            )}
          </section>
        ))}
      </div>
    </article>
  )
}
