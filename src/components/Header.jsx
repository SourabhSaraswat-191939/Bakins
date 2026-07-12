import { useEffect, useState } from 'react'
import { siteConfig } from '../siteConfig'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 bg-cream/90 backdrop-blur border-b transition-shadow duration-300 ${
        scrolled ? 'border-crust/10 shadow-sm' : 'border-transparent'
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3 font-display text-2xl text-crust-dark">
          <img
            src="/logo.jpg"
            alt=""
            className="h-10 w-10 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          {siteConfig.shopName}
        </a>
        <nav className="flex items-center gap-6 text-sm font-medium text-crust-dark">
          {[
            ['Menu', '#menu'],
            ['About', '#about'],
            ['Contact', '#contact'],
          ].map(([label, href]) => (
            <a key={href} href={href} className="relative group py-1">
              {label}
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-sage transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
