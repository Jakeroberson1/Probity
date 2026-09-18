import { marked } from 'marked'

/**
 * Render repo markdown (the method page and published briefs) to HTML. The
 * sources are files committed to this repo, not visitor input.
 */
export const renderMarkdown = (source: string) => marked.parse(source, { gfm: true, async: false }) as string
