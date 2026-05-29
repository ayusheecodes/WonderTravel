import { Link, useParams } from 'react-router-dom'
import styles from './InfoPage.module.css'

const pages = {
  'about-us': {
    eyebrow: 'Company',
    title: 'About WonderTravel',
    intro: 'WonderTravel helps people discover India beyond the usual booking grid: hidden places, local routes, practical stays, and AI-assisted trip planning in one flow.',
    sections: [
      ['What We Build', 'We combine destination discovery, transport search, local stays, cabs, and itinerary generation so travelers can move from inspiration to booking without scattering their plans across tabs.'],
      ['Our Point Of View', 'Travel planning should respect local knowledge. Our destination catalog highlights contributors, seasonal advice, budget ranges, and route context that generic listings often miss.'],
      ['For Hosts And Contributors', 'WonderTravel gives local residents and regional experts a place to surface routes, stays, food trails, viewpoints, and safety notes that make a trip feel grounded.'],
    ],
    cta: ['Start Exploring', '/explore'],
  },
  careers: {
    eyebrow: 'Company',
    title: 'Careers',
    intro: 'We are building travel tools for discovery-first journeys across India. Our team values useful product craft, local context, and calm execution.',
    sections: [
      ['Roles We Hire For', 'Product engineering, destination research, partnerships, operations, design, content strategy, and community support.'],
      ['How We Work', 'We keep teams small, ship practical improvements, and spend time understanding the travel decisions people actually make.'],
      ['Apply', 'Send your profile, portfolio, or a short note about the part of WonderTravel you want to improve.'],
    ],
    cta: ['Explore The Product', '/'],
  },
  press: {
    eyebrow: 'Company',
    title: 'Press',
    intro: 'WonderTravel is a travel discovery and booking platform focused on underrepresented Indian destinations, local contributors, and AI-assisted planning.',
    sections: [
      ['Boilerplate', 'WonderTravel helps travelers discover hidden destinations, build day-by-day itineraries, compare travel options, and book packages from one place.'],
      ['Media Topics', 'Remote destination discovery, local contributor networks, AI trip planning, regional tourism, and bundled travel booking workflows.'],
      ['Contact', 'For interviews, screenshots, or product notes, contact the WonderTravel team through the support page.'],
    ],
    cta: ['Visit Support', '/help-center'],
  },
  blog: {
    eyebrow: 'Company',
    title: 'WonderTravel Blog',
    intro: 'Stories, planning guides, seasonal picks, and product updates for travelers who prefer the useful path over the obvious one.',
    sections: [
      ['Travel Guides', 'Deep-dive guides for regions like Northeast India, Odisha, Himachal Pradesh, Kerala, Goa, Gujarat, and Uttar Pradesh.'],
      ['Planning Notes', 'Budget breakdowns, route timing, weather windows, stay selection, and transport tradeoffs for real trips.'],
      ['Product Updates', 'Notes on itinerary generation, destination coverage, booking flows, and contributor tools.'],
    ],
    cta: ['Read Local Stories', '/local-stories'],
  },
  'help-center': {
    eyebrow: 'Support',
    title: 'Help Center',
    intro: 'Find quick answers for account access, bookings, itinerary planning, payments, and destination discovery.',
    sections: [
      ['Bookings', 'Flights, trains, hotels, cabs, and itinerary packages can be reviewed in checkout before payment. Logged-in users can track confirmed bookings in the dashboard.'],
      ['AI Planner', 'The itinerary generator works with or without a Gemini API key. If Gemini is unavailable, WonderTravel falls back to a local destination-aware planner.'],
      ['Account Help', 'Use your dashboard to review profile details and bookings. If you cannot access your account, sign in again and retry the action.'],
    ],
    cta: ['Go To Dashboard', '/dashboard'],
  },
  safety: {
    eyebrow: 'Support',
    title: 'Safety Information',
    intro: 'Travel safety depends on timing, terrain, local advice, weather, and responsible booking choices. WonderTravel surfaces practical notes to help you plan better.',
    sections: [
      ['Before You Go', 'Check weather, road status, permits, seasonal closures, and local transport availability before finalizing remote trips.'],
      ['During The Trip', 'Share your route with someone trusted, keep offline maps, carry emergency cash, and use verified stays or drivers where possible.'],
      ['High-Altitude And Remote Routes', 'Start early, carry warm layers, avoid overpacked days, and follow local driver or guide advice for mountain roads.'],
    ],
    cta: ['Find Local Drivers', '/cabs'],
  },
  cancellations: {
    eyebrow: 'Support',
    title: 'Cancellation Options',
    intro: 'Cancellation rules vary by booking type, fare class, stay provider, and route. WonderTravel keeps policy details visible before checkout wherever possible.',
    sections: [
      ['Flights And Trains', 'Refundability depends on the selected fare or class. Review the fare label and details before continuing to checkout.'],
      ['Hotels And Stays', 'Many stays include free cancellation windows, but policy timing depends on the property and room type.'],
      ['Cabs And Packages', 'Driver availability, route conditions, and package inclusions may affect changes. Contact support early for route or date changes.'],
    ],
    cta: ['Review Bookings', '/dashboard'],
  },
  'hidden-gems': {
    eyebrow: 'Explore',
    title: 'Hidden Gems',
    intro: 'Discover lesser-known valleys, temple towns, salt deserts, backwaters, mountain routes, and local stays across India.',
    sections: [
      ['North And Northeast', 'Ziro Valley, Chopta, Tirthan Valley, Dzukou Valley, Banaras Ghats, and Ayodhya are part of the growing WonderTravel catalog.'],
      ['South And West', 'Kerala Backwaters, Hampi, Goa Coast, and Rann of Kutch add stronger regional coverage for South India and West India.'],
      ['How To Use It', 'Open Explore, filter by region or travel style, then plan a trip from any destination card.'],
    ],
    cta: ['Open Explore', '/explore'],
  },
  'local-stories': {
    eyebrow: 'Explore',
    title: 'Local Stories',
    intro: 'Local Stories is where contributor knowledge becomes travel context: timing tips, food trails, route notes, and cultural details.',
    sections: [
      ['Contributor Lens', 'Each destination can include tips from residents, guides, hosts, or regional travelers who know the place beyond listing-page basics.'],
      ['Better Planning', 'Local notes help travelers avoid overpacked days, poor timing, seasonal misses, and routes that look easy on a map but are not.'],
      ['Coming Into The Product', 'Stories can evolve into richer contributor pages, route journals, and destination updates as the community grows.'],
    ],
    cta: ['Browse Destinations', '/explore'],
  },
  privacy: {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    intro: 'This page explains the kind of information WonderTravel uses to operate accounts, bookings, personalization, and support.',
    sections: [
      ['Information We Use', 'Account details, booking details, itinerary inputs, and basic usage data help us provide travel planning and booking features.'],
      ['How It Helps', 'We use this information to authenticate users, save bookings, generate itineraries, improve destination recommendations, and respond to support requests.'],
      ['Your Choices', 'You can update account details, avoid saving optional information, and contact support for account or booking questions.'],
    ],
    cta: ['Back Home', '/'],
  },
  terms: {
    eyebrow: 'Legal',
    title: 'Terms Of Service',
    intro: 'These terms describe the expected use of WonderTravel’s discovery, itinerary, booking, and account features.',
    sections: [
      ['Using WonderTravel', 'Use the platform for lawful travel planning and booking. Keep account details accurate and review booking information before payment.'],
      ['Travel Information', 'Destination, route, safety, and itinerary content is planning guidance. Always confirm critical travel details before departure.'],
      ['Bookings', 'Provider terms, fare rules, cancellation windows, and availability can vary by service. Review all visible details before checkout.'],
    ],
    cta: ['Browse Offers', '/offers'],
  },
  sitemap: {
    eyebrow: 'Site',
    title: 'Sitemap',
    intro: 'A quick map of WonderTravel’s main pages and planning flows.',
    sections: [
      ['Travel Booking', 'Flights, trains, hotels, cabs, checkout, and booking success pages support the core booking journey.'],
      ['Discovery', 'Home, Explore, Hidden Gems, Local Stories, Offers, and AI Planner support discovery and planning.'],
      ['Account And Support', 'Login, signup, dashboard, help center, safety, cancellations, privacy, and terms support account and service needs.'],
    ],
    cta: ['Start From Home', '/'],
  },
}

export default function InfoPage() {
  const { slug } = useParams()
  const page = pages[slug] || pages.sitemap

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p>{page.intro}</p>
      </section>

      <section className={styles.content}>
        {page.sections.map(([title, body]) => (
          <article key={title} className={styles.card}>
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </section>

      <div className={styles.cta}>
        <Link to={page.cta[1]}>{page.cta[0]}</Link>
      </div>
    </main>
  )
}
