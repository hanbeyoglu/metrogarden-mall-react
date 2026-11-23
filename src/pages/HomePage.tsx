import { useMeta } from '@/hooks'
import { HeroSlider } from '@/components/home/HeroSlider'
import { FeaturedStores } from '@/components/home/FeaturedStores'
import { CampaignSection } from '@/components/home/CampaignSection'
import { EventsSection } from '@/components/home/EventsSection'
import { CinemaSection } from '@/components/home/CinemaSection'
import { ContactCTA } from '@/components/home/ContactCTA'

export function HomePage() {
  useMeta({ title: undefined })

  return (
    <>
      <HeroSlider />
      <FeaturedStores />
      <CampaignSection />
      <EventsSection />
      <CinemaSection />
      <ContactCTA />
    </>
  )
}
