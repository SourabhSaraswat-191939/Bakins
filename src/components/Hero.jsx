import { siteConfig } from '../siteConfig'

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-sage-dark text-cream">
      <div
        aria-hidden
        className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-gold/30 blur-3xl animate-float-slow"
      />
      <div
        aria-hidden
        className="absolute -bottom-24 -right-10 w-96 h-96 rounded-full bg-cream/10 blur-3xl animate-float-slower"
      />
      <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,#fff,transparent_35%),radial-gradient(circle_at_80%_60%,#fff,transparent_30%)]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-28 text-center">
        <h1 className="sr-only">{siteConfig.shopName}</h1>
        <img
          src="/logo.jpg"
          alt={siteConfig.shopName}
          className="mx-auto mb-6 h-48 w-48 sm:h-72 sm:w-72 rounded-full shadow-xl animate-hero-in"
          style={{ animationDelay: '0ms' }}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <p
          className="uppercase tracking-[0.3em] text-cream-dark/80 text-xs sm:text-sm mb-4 animate-hero-in"
          style={{ animationDelay: '120ms' }}
        >
          Baked fresh daily
        </p>
        {siteConfig.tagline && (
          <p
            className="mt-4 text-lg sm:text-xl text-cream-dark/90 max-w-2xl mx-auto animate-hero-in"
            style={{ animationDelay: '240ms' }}
          >
            {siteConfig.tagline}
          </p>
        )}
        <a
          href="#menu"
          className="inline-block mt-8 bg-gold hover:brightness-95 transition-all duration-300 hover:scale-105 hover:shadow-xl text-crust-dark font-semibold px-8 py-3 rounded-full shadow-lg animate-hero-in"
          style={{ animationDelay: '360ms' }}
        >
          View Our Menu
        </a>
      </div>

      <svg
        aria-hidden
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="relative block w-full h-10 sm:h-14 text-cream"
      >
        <path fill="currentColor" d="M0,32 C240,60 480,0 720,16 C960,32 1200,60 1440,24 L1440,60 L0,60 Z" />
      </svg>
    </section>
  )
}
