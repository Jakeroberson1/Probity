import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import './index.css'
import '@designcodeio/threeui/style.css'
import './styles/probity.css'
import { BriefsPage } from '@/pages/briefs'
import { ComingSoonPage } from '@/pages/coming-soon'
import { HomePage } from '@/pages/home'
import { MethodPage } from '@/pages/method'
import { TrackRecordPage } from '@/pages/track-record'

const PAGES = {
  home: HomePage,
  method: MethodPage,
  'track-record': TrackRecordPage,
  briefs: BriefsPage,
  'coming-soon': ComingSoonPage,
}

const root = document.getElementById('root')!
const Page = PAGES[root.dataset.page as keyof typeof PAGES] ?? HomePage

createRoot(root).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
