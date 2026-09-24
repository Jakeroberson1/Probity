// Writes public/sitemap.xml before each build.
//
// Brief pages are query URLs (/briefs/?b=slug) rather than paths, so no crawler finds them by
// walking the site structure. They have to be listed, and they are added often enough that a
// hand-maintained list would go stale. This reads whatever is in content/briefs/ instead.

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://probity.bio'

/** Static pages, with how often a crawler should bother coming back. */
const PAGES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/track-record/', changefreq: 'weekly', priority: '0.9' },
  { path: '/briefs/', changefreq: 'weekly', priority: '0.9' },
  { path: '/method/', changefreq: 'monthly', priority: '0.5' },
]

function briefs() {
  const dir = join(ROOT, 'content', 'briefs')
  let files = []
  try {
    files = readdirSync(dir).filter((f) => f.endsWith('.json'))
  } catch {
    return [] // no briefs published yet
  }
  return files.map((file) => {
    const data = JSON.parse(readFileSync(join(dir, file), 'utf8'))
    return {
      path: `/briefs/?b=${encodeURIComponent(data.slug)}`,
      lastmod: (data.published_at ?? '').slice(0, 10) || undefined,
      changefreq: 'monthly',
      priority: '0.8',
    }
  })
}

const today = new Date().toISOString().slice(0, 10)
const entries = [...PAGES, ...briefs()]
  .map(({ path, lastmod, changefreq, priority }) =>
    [
      '  <url>',
      `    <loc>${SITE}${path.replace(/&/g, '&amp;')}</loc>`,
      `    <lastmod>${lastmod ?? today}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n'),
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`

mkdirSync(join(ROOT, 'public'), { recursive: true })
writeFileSync(join(ROOT, 'public', 'sitemap.xml'), xml)
console.log(`sitemap: ${entries.split('<url>').length - 1} urls`)
