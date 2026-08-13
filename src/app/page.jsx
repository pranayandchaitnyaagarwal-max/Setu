import Hero from '@/components/Hero'
import BentoGrid from '@/components/BentoGrid'
import PolicyCaseStudies from '@/components/PolicyCaseStudies'
import Oversight from '@/components/Oversight'

export default function Home() {
  return (
    <main>
      <Hero />
      <BentoGrid />
      <PolicyCaseStudies />
      <Oversight />
    </main>
  )
}