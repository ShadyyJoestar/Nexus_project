import Navbar from '@/components/navbar'
import { Analytics } from '@vercel/analytics/next'
import HomeContent from '@/components/home-content'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <Analytics />
      <HomeContent />
    </div>
  )
}