import FinalCta from '../components/landing/FinalCta'
import Features from '../components/landing/Features'
import Hero from '../components/landing/Hero'
import HowItWorks from '../components/landing/HowItWorks'
import LandingFooter from '../components/landing/LandingFooter'
import LandingHeader from '../components/landing/LandingHeader'
import SkipLink from '../components/SkipLink'

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg">
      <SkipLink />
      <LandingHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Features />
        <HowItWorks />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  )
}