const BADGES = [
  { icon: '🚫🥚', label: 'Egg Free' },
  { icon: '🌱', label: '100% Vegetarian' },
  { icon: '❤️', label: 'Home Made With Love' },
]

export default function TrustBadges() {
  return (
    <div className="bg-sage-light border-y border-sage/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
        {BADGES.map(({ icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-sage-dark"
          >
            <span aria-hidden>{icon}</span>
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
