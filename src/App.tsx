import { BrowserRouter } from 'react-router-dom'
import { AnimatedOutlet } from '@/components/layout/AnimatedOutlet'
import { Layout } from '@/components/layout/Layout'
import { SmoothScrollRoot } from '@/components/layout/SmoothScrollRoot'
import { TargetCursor } from '@/components/react-bits'
import { ThemeProvider } from '@/components/theme/ThemeProvider'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <SmoothScrollRoot>
          <TargetCursor />
          <Layout>
            <AnimatedOutlet />
          </Layout>
        </SmoothScrollRoot>
      </BrowserRouter>
    </ThemeProvider>
  )
}
