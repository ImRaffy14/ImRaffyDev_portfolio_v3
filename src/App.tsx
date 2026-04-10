import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'

export default function App() {
  return (
    <ThemeProvider>
      <Layout>
        <HomePage />
      </Layout>
    </ThemeProvider>
  )
}
