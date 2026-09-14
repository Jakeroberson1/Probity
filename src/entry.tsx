import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import './index.css'
import '@designcodeio/threeui/style.css'
import './styles/probity.css'
import { AboutPage } from '@/pages/about'
import { ComingSoonPage } from '@/pages/coming-soon'
import { HomePage } from '@/pages/home'

const PAGES = {
  home: HomePage,
  about: AboutPage,
  'coming-soon': ComingSoonPage,
}

const root = document.getElementById('root')!
const Page = PAGES[root.dataset.page as keyof typeof PAGES] ?? HomePage

createRoot(root).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
