import { useMemo } from 'react'
import { cn } from '@/lib/cn'

const ALLOWED_TAGS = new Set([
  'a', 'b', 'blockquote', 'br', 'caption', 'div', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'hr', 'i', 'li', 'ol', 'p', 's', 'span', 'strong', 'u', 'ul',
])
const DROP_CONTENT_TAGS = new Set(['script', 'style', 'iframe', 'object', 'embed', 'svg', 'math', 'template'])
const ALLOWED_STYLE_PROPERTIES = new Set([
  'background-color', 'color', 'font-size', 'font-style', 'font-weight', 'text-align', 'text-decoration',
])

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]!)
}

function safeStyleValue(property: string, value: string): boolean {
  const normalized = value.trim().toLowerCase()
  if (property === 'color' || property === 'background-color') {
    return /^(#[\da-f]{3,8}|(?:rgb|rgba|hsl|hsla)\([\d.,%+\-\s]+\)|[a-z]{1,20})$/i.test(normalized)
  }
  if (property === 'text-align') return /^(left|center|right|justify|start|end)$/.test(normalized)
  if (property === 'font-size') return /^\d+(?:\.\d+)?(?:px|pt|em|rem|%)$/.test(normalized)
  if (property === 'font-weight') return /^(normal|bold|bolder|lighter|[1-9]00)$/.test(normalized)
  if (property === 'font-style') return /^(normal|italic|oblique)$/.test(normalized)
  if (property === 'text-decoration') return /^(none|underline|line-through|overline)$/.test(normalized)
  return false
}

function sanitizeStyle(style: string): string {
  return style.split(';').flatMap((declaration) => {
    const separator = declaration.indexOf(':')
    if (separator < 1) return []
    const property = declaration.slice(0, separator).trim().toLowerCase()
    const value = declaration.slice(separator + 1).trim()
    if (!ALLOWED_STYLE_PROPERTIES.has(property) || !safeStyleValue(property, value)) return []
    return [`${property}:${value}`]
  }).join(';')
}

function safeHref(href: string): boolean {
  const value = href.trim()
  return /^(https?:|mailto:|tel:|\/|#|\.\.?\/)/i.test(value) && !/^\/\//.test(value)
}

function plainTextToHtml(content: string): string {
  const output: string[] = []
  let listItems: string[] = []
  const flushList = () => {
    if (!listItems.length) return
    output.push(`<ul>${listItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`)
    listItems = []
  }

  for (const line of content.replace(/\r/g, '').split('\n')) {
    const trimmed = line.trim()
    const bullet = trimmed.match(/^(?:-|•)\s+(.+)$/)
    if (bullet) {
      listItems.push(bullet[1])
      continue
    }
    flushList()
    if (trimmed) output.push(`<p>${escapeHtml(trimmed)}</p>`)
  }

  flushList()
  return output.join('')
}

function sanitizeNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return escapeHtml(node.textContent ?? '')
  if (!(node instanceof Element)) return ''

  const tag = node.tagName.toLowerCase()
  if (DROP_CONTENT_TAGS.has(tag)) return ''
  const children = Array.from(node.childNodes).map(sanitizeNode).join('')
  if (!ALLOWED_TAGS.has(tag)) return children

  const attributes: string[] = []
  const style = node.getAttribute('style')
  if (style) {
    const safe = sanitizeStyle(style)
    if (safe) attributes.push(`style="${escapeHtml(safe)}"`)
  }
  const title = node.getAttribute('title')
  if (title) attributes.push(`title="${escapeHtml(title)}"`)
  if (tag === 'a') {
    const href = node.getAttribute('href')
    if (href && safeHref(href)) attributes.push(`href="${escapeHtml(href)}"`)
    if (node.getAttribute('target') === '_blank') {
      attributes.push('target="_blank"', 'rel="noopener noreferrer"')
    }
  }

  const attrs = attributes.length ? ` ${attributes.join(' ')}` : ''
  return tag === 'br' || tag === 'hr' ? `<${tag}${attrs}>` : `<${tag}${attrs}>${children}</${tag}>`
}

function sanitizeRichText(content: string): string {
  if (typeof DOMParser === 'undefined') return escapeHtml(content).replace(/\r?\n/g, '<br>')
  const parsed = new DOMParser().parseFromString(content, 'text/html')
  const hasMarkup = /<\s*[a-z][^>]*>/i.test(content)
  if (!hasMarkup) return plainTextToHtml(content)
  const source = parsed.body
  return Array.from(source.childNodes).map(sanitizeNode).join('')
}

interface RichTextContentProps {
  content: string
  className?: string
}

export function RichTextContent({ content, className }: RichTextContentProps) {
  const sanitized = useMemo(() => sanitizeRichText(content), [content])
  if (!sanitized) return null
  return <div className={cn('campaign-rich-text', className)} dangerouslySetInnerHTML={{ __html: sanitized }} />
}
