import { Link } from 'react-router-dom'
import { siteConfig } from '../siteConfig'
import Reveal from './Reveal'

export default function Footer() {
  const whatsappLink = siteConfig.whatsapp
    ? `https://wa.me/${siteConfig.whatsapp}`
    : null
  const instagramLink = siteConfig.instagram
    ? `https://instagram.com/${siteConfig.instagram.replace(/^@/, '')}`
    : null

  return (
    <footer id="contact" className="bg-sage-dark text-cream-dark mt-16">
      <Reveal className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid sm:grid-cols-3 gap-8">
        <div>
          <h4 className="font-display text-xl text-cream mb-2">{siteConfig.shopName}</h4>
          <p className="text-sm text-cream-dark/80">{siteConfig.aboutText}</p>
        </div>
        <div>
          <h5 className="font-semibold text-cream mb-2">Contact</h5>
          <p className="text-sm">{siteConfig.phone}</p>
          <p className="text-sm">{siteConfig.address}</p>
          {siteConfig.hours && <p className="text-sm">{siteConfig.hours}</p>}
          {instagramLink && (
            <a
              href={instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline hover:text-cream inline-block mt-1"
            >
              {siteConfig.instagram}
            </a>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-cherry hover:bg-cherry-dark transition-all duration-300 hover:scale-105 text-white font-semibold px-6 py-2.5 rounded-full text-sm w-fit"
            >
              Order via WhatsApp
            </a>
          )}
          <a
            href={`tel:${siteConfig.phone.replace(/\s+/g, '')}`}
            className="inline-block border border-cream-dark/40 hover:border-cream hover:scale-105 transition-all duration-300 text-cream px-6 py-2.5 rounded-full text-sm w-fit"
          >
            Call to Order
          </a>
        </div>
      </Reveal>
      <div className="border-t border-cream-dark/10 py-4 text-center text-xs text-cream-dark/60">
        © {new Date().getFullYear()} {siteConfig.shopName}. All rights reserved.{' '}
        <Link to="/admin/login" className="underline hover:text-cream">
          Owner Login
        </Link>
      </div>
    </footer>
  )
}
