# probity.bio

Probity publishes calls on FDA catalysts (advisory committee votes, approval decisions, trial
readouts) before the date and grades them after. This repo is the site: Vite + React +
TypeScript, deployed on Vercel's free Hobby tier. It has no database, no paid APIs, and no
auth. Data lives in `data/` and `content/` as plain files in the repo.

```bash
npm install      # installs dependencies
npm run dev      # http://localhost:5173
npm run build    # typecheck + static output in dist/
```

Pushing to `main` deploys to probity.bio through Vercel's GitHub integration.

## Pages

| URL | Source | Reads |
| --- | --- | --- |
| `/` | `src/pages/home.tsx` | `data/catalyst-calendar.json` (next call, countdown), `data/track-record.json` (scoreboard strip) |
| `/method/` | `src/pages/method.tsx` | One paragraph, written in the page itself |
| `/track-record/` | `src/pages/track-record.tsx` | `data/track-record.json` |
| `/briefs/` | `src/pages/briefs.tsx` | `content/briefs/*.md` |
| `/coming-soon/?page=…` | `src/pages/coming-soon.tsx` | Placeholder for Privacy, Terms and LinkedIn |

Each page is its own HTML file (`index.html`, `method/index.html`, …), so no rewrite rules are
needed.

## Add a brief

1. Write `content/briefs/<slug>.md`. The file name is the URL: `/briefs/?b=<slug>`.
2. Start it with front matter. These four fields feed the archive list:

   ```markdown
   ---
   title: GRAIL Galleri FDA panel vote
   date: 2026-09-21
   event: GRAIL Galleri AdCom (PMA vote)
   verdict: YES, 62%
   ---
   ```

   `date` is the publication date (YYYY-MM-DD). The archive sorts newest first.
3. The rest of the file is the brief in markdown. Tables, lists and links all render.
4. Commit and push to `main`. The commit time is the brief's public timestamp.

Every brief goes through the /humanizer skill before it's committed.

## Update the track record

Edit `data/track-record.json`. Each event row:

| Field | Before the date | After grading |
| --- | --- | --- |
| `our_call` | `null` | `"YES"` or `"NO"` |
| `probability` | `null` | `62` (or `0.62`) |
| `outcome` | `"Pending"` | e.g. `"Approved"`, `"Voted no"` |
| `right` | `null` | `true` or `false` |

The site counts the record (the `0–0`) from the `right` values in the rows. It doesn't read the
`record` block, so the headline number can't disagree with the table. Keep `record` in step
anyway, for anything else that reads the file.

## How the countdown picks the next event

The next-call box on the home page reads `data/catalyst-calendar.json`:

1. If `next_featured` is set and its day hasn't ended, it shows that event with that label.
2. Otherwise it shows the earliest event with `"covered": true` and a confirmed `date`.
   Events known only by a `window` ("Q4 2026") never drive the countdown.

Days run on US Eastern time, since FDA dates are Eastern. The countdown runs to midnight at the
start of the event day. On the day itself the box reads "It's today." At midnight Eastern
after the event it moves to the next one on its own; no deploy is needed.

An automatically picked event is labeled "{company} {product} {FDA panel vote | FDA approval
decision | trial readout}". For different wording, set `next_featured` to that event's date and
label.

The calendar has two feeds: `probity scan` writes the AdCom rows, and PDUFA and readout rows are
added by hand. The site doesn't care which feed wrote a row.

## Email signup

The form posts to Buttondown's public signup endpoint, using the username in
`src/lib/subscribe.ts` (`BUTTONDOWN_USERNAME`). A username isn't a secret, and no API key ships
in the site. While the username is empty, the form tells visitors signups open soon and sends
nothing.

Export the list any time from Buttondown: Subscribers → Export (CSV). Buttondown asks new
subscribers to confirm by email unless double opt-in is turned off in its settings.

Every "Get the briefs" link points at `SUBSCRIBE_HREF` in `src/lib/site.ts` (currently the form
on the home page), so a `/subscribe` page can take over later by changing that one value.

## ThreeUI components

All set up in `src/components/threeui.tsx`.

| Where | Component |
| --- | --- |
| Background on every page | `PredictiveArcCanvas`, `signal-particles` variant |
| Buttons, including the signup button | `RectangleButtons`, `lumen-cta` / `lumen-cta-ghost`, restyled in `src/styles/probity.css` |
| Coming soon background | `ConstellationField`, hue-shifted to blue |
