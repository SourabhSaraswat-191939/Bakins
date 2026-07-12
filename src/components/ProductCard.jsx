const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#f5ead9"/><text x="50%" y="50%" font-family="sans-serif" font-size="20" fill="#8a5a34" text-anchor="middle" dominant-baseline="middle">No Image</text></svg>`,
  )

export default function ProductCard({ product }) {
  const { name, description, price, imageUrl, available = true } = product

  return (
    <div
      className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 ${
        available ? '' : 'opacity-60'
      }`}
    >
      <div className="relative aspect-4/3 bg-cream-dark overflow-hidden">
        <img
          src={imageUrl || FALLBACK_IMAGE}
          alt={name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <span className="absolute top-2 left-2 inline-flex items-center gap-1 text-xs font-semibold text-sage-dark bg-sage-light/95 border border-sage/30 px-2 py-0.5 rounded-full shadow-sm">
          🌱 Eggless · Veg
        </span>
      </div>
      <div className="p-4 flex flex-col grow">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg text-crust-dark">{name}</h3>
          <span className="font-semibold text-cherry whitespace-nowrap">
            ₹{Number(price).toFixed(2)}
          </span>
        </div>
        {description && (
          <p className="text-sm text-neutral-600 mt-1 grow">{description}</p>
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
