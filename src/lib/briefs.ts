// Published briefs are markdown files in content/briefs/. The file name is the
// URL slug; the front matter carries the archive fields.
const FILES = import.meta.glob('../../content/briefs/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export type Brief = {
  slug: string
  title: string
  /** Publication date (YYYY-MM-DD). */
  date: string
  event: string
  verdict: string
  body: string
}

/** Split `---`-fenced `key: value` front matter from the markdown body. */
function parse(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { meta: {}, body: raw }
  const meta: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const i = line.indexOf(':')
    if (i < 1) continue
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '')
  }
  return { meta, body: match[2] }
}

export const BRIEFS: Brief[] = Object.entries(FILES)
  // <slug>.postmortem.md sits beside its brief and is part of that brief's page, not a brief
  // of its own. Without this it lists itself in the archive at /briefs/?b=<slug>.postmortem.
  .filter(([path]) => !path.endsWith('.postmortem.md'))
  .map(([path, raw]) => {
    const { meta, body } = parse(raw)
    const slug = path.split('/').pop()!.replace(/\.md$/, '')
    return {
      slug,
      title: meta.title ?? slug,
      date: meta.date ?? '',
      event: meta.event ?? '',
      verdict: meta.verdict ?? '',
      body,
    }
  })
  .sort((a, b) => b.date.localeCompare(a.date))

export const findBrief = (slug: string) => BRIEFS.find((b) => b.slug === slug)

export const briefHref = (slug: string) => `/briefs/?b=${encodeURIComponent(slug)}`
