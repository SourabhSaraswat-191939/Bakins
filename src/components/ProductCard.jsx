import { useState } from 'react'

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#f5ead9"/><text x="50%" y="50%" font-family="sans-serif" font-size="20" fill="#8a5a34" text-anchor="middle" dominant-baseline="middle">No Image</text></svg>`,
  )

const LONG_DESCRIPTION_THRESHOLD = 70

export default function ProductCard({ product }) {
  const { name, description, price, imageUrl, available = true } = product
  const [expanded, setExpanded] = useState(false)
  const isLong = description && description.length > LONG_DESCRIPTION_THRESHOLD

  return (
    <div
      className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 sm:hover:-translate-y-1.5 flex flex-row sm:flex-col ${
        available ? '' : 'opacity-60'
      }`}
    >
      <div className="relative w-24 sm:w-auto aspect-square sm:aspect-4/3 shrink-0 bg-cream-dark overflow-hidden">
        <img
          src={imageUrl || FALLBACK_IMAGE}
          alt={name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE
          }}
          className="w-full h-full object-cover transition-transform duration-500 sm:group-hover:scale-110"
        />
        <span className="sm:hidden absolute top-1 right-1 h-5 w-5 flex items-center justify-center rounded-full bg-sage-light border border-sage/40 text-[10px] shadow-sm">
          🌱
        </span>
        <span className="hidden sm:inline-flex absolute top-2 left-2 items-center gap-1 text-xs font-semibold text-sage-dark bg-sage-light/95 border border-sage/30 px-2 py-0.5 rounded-full shadow-sm">
          🌱 Eggless · Veg
        </span>
      </div>
      <div className="p-3 sm:p-4 flex flex-col grow min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base sm:text-lg text-crust-dark">{name}</h3>
          <span className="font-semibold text-cherry whitespace-nowrap text-sm sm:text-base">
            ₹{Number(price).toFixed(2)}
          </span>
        </div>
        {description && (
          <>
            <p
              className={`text-sm text-neutral-600 mt-1 sm:grow ${
                expanded ? '' : 'line-clamp-2'
              } sm:line-clamp-none`}
            >
              {description}
            </p>
            {isLong && (
              <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                className="sm:hidden self-start font-semibold text-sage-dark text-sm mt-0.5"
              >
                {expanded ? 'read less' : 'read more'}
              </button>
            )}
          </>
        )}
        {!available && (
          <span className="mt-2 inline-block text-xs font-semibold text-white bg-neutral-500 rounded-full px-2 py-0.5 w-fit">
            Currently unavailable
          </span>
        )}
      </div>
    </div>
  )
}
