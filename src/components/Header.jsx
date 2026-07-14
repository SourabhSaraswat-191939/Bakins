import { useEffect, useState } from 'react'
import { siteConfig } from '../siteConfig'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const whatsappLink = siteConfig.whatsapp ? `https://wa.me/${siteConfig.whatsapp}` : null
  const telLink = `tel:${siteConfig.phone.replace(/\s+/g, '')}`

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
        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-crust-dark">
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

          <div className="flex items-center gap-2">
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Order via WhatsApp"
                title="Order via WhatsApp"
                className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-[#25D366] text-white transition-transform duration-300 hover:scale-110 hover:shadow-md"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12.004 2C6.486 2 2.01 6.477 2.01 12c0 1.858.5 3.68 1.451 5.273L2 22l4.85-1.421A9.96 9.96 0 0 0 12.004 22C17.522 22 22 17.523 22 12S17.522 2 12.004 2Zm0 18.15a8.13 8.13 0 0 1-4.146-1.135l-.297-.177-2.878.843.858-2.822-.194-.29A8.13 8.13 0 0 1 3.86 12c0-4.494 3.653-8.148 8.144-8.148 4.49 0 8.143 3.654 8.143 8.148 0 4.494-3.653 8.15-8.143 8.15Z" />
                </svg>
              </a>
            )}
            <a
              href={telLink}
              aria-label="Call to order"
              title="Call to order"
              className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-sage text-white transition-transform duration-300 hover:scale-110 hover:shadow-md hover:bg-sage-dark"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
                <path d="M6.62 10.79a15.09 15.09 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
