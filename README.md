# probity.bio

Marketing site for Probity. Vite + React + TypeScript, Tailwind v4 and shadcn, with
ThreeUI (`@designcodeio/threeui`) components rendered directly in React.

```bash
npm install      # also applies patches/ via patch-package
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
```

Deploy `dist/` to any static host. Each page is its own HTML file, so no rewrite rules are needed.

## Pages

| URL | Source | Notes |
| --- | --- | --- |
| `/` | `src/pages/home.tsx` | Hero, problem, how it works, the brief, the standard, pilot |
| `/about/` | `src/pages/about.tsx` | Reached from the nav and footer only; not part of the home scroll |
| `/coming-soon/?page=…` | `src/pages/coming-soon.tsx` | Landing page for links that don't exist yet |

Unpublished pages are listed in `COMING_SOON_PAGES` in `src/lib/site.ts`. To publish one,
add its page and point the link at the real URL instead of `comingSoon(...)`.

## ThreeUI components

All wired up in `src/components/threeui.tsx`.

| Where | Component |
| --- | --- |
| Hero background (home, about) | `StructureFlowCollection` — `structure-flow` |
| Pilot panel, coming-soon background | `ConstellationField` — hue-shifted to the brand blue |
| Every CTA button | `RectangleButtons` — `lumen-cta` / `lumen-cta-ghost`, restyled in `src/styles/probity.css` |
| Brief anatomy headings | `TextAnimationCollection` — `article-headings` |

`patches/@designcodeio+threeui+1.2.0.patch` adds `header` and `entries` props to the
`article-headings` variant, which otherwise only renders its built-in demo text.

`ThreeDPaper` isn't included: 3D Paper appears on threeui.com, but it isn't in the
published package (0.3.0–1.2.0) or the open-source repository.

## Footer

`npx kibo-ui add footer` fails: Kibo UI's registry has no `footer` component
(`https://www.kibo-ui.com/r/footer.json` returns an error). The footer is
`src/components/footer.tsx`.

## Placeholders

- CTAs use `mailto:hello@probity.bio?subject=Pilot%20brief%20request` (`PILOT_MAILTO` in `src/lib/site.ts`).
- Sample brief, LinkedIn, Privacy and Terms point to `/coming-soon/`.
