import Header from '../components/Header'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import CategorySection from '../components/CategorySection'
import Reveal from '../components/Reveal'
import TrustBadges from '../components/TrustBadges'
import { useProducts, groupByCategory } from '../hooks/useProducts'
import { siteConfig } from '../siteConfig'

function MenuSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-row sm:flex-col"
        >
          <div className="w-24 sm:w-auto aspect-square sm:aspect-4/3 shrink-0 animate-shimmer" />
          <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1">
            <div className="h-4 w-2/3 rounded animate-shimmer" />
            <div className="h-3 w-full rounded animate-shimmer" />
            <div className="h-3 w-1/3 rounded animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const { products, loading, error } = useProducts()
  const available = products.filter((p) => p.available !== false)
  const categories = groupByCategory(available)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <TrustBadges />

      <section id="about" className="mx-auto max-w-3xl px-4 sm:px-6 py-14 text-center">
        <Reveal>
          <h2 className="font-display text-3xl text-crust-dark mb-4">About Us</h2>
          <p className="text-neutral-700 leading-relaxed">{siteConfig.aboutText}</p>
        </Reveal>
      </section>

      <section id="menu" className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 w-full grow">
        <Reveal>
          <h2 className="font-display text-3xl text-crust-dark text-center mb-3">
            Our Menu
          </h2>
          <ul className="text-center text-sm text-neutral-500 mb-10 space-y-1">
            <li>Customization may cost extra.</li>
          </ul>
        </Reveal>

        {loading && <MenuSkeleton />}
        {error && (
          <p className="text-center text-cherry">
            Couldn't load the menu right now. Please try again shortly.
          </p>
        )}
        {!loading && !error && categories.length === 0 && (
          <p className="text-center text-neutral-500">
            Our menu is being freshly prepared — check back soon!
          </p>
        )}

        {categories.map(({ category, items }) => (
          <CategorySection key={category} category={category} items={items} />
        ))}
      </section>

      <Footer />
    </div>
  )
}
