import { forwardRef } from 'react'
import { siteConfig } from '../siteConfig'

function formatInvoiceDate(ts) {
  const date = ts?.toDate ? ts.toDate() : new Date()
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const LeafBranch = ({ className }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" aria-hidden>
    <path
      d="M100 190 C100 150 100 60 170 10"
      stroke="#6f8c56"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {[
      [140, 90, 40, -20],
      [120, 130, 45, -35],
      [155, 55, 35, -15],
      [170, 20, 25, 0],
    ].map(([cx, cy, r, rot], i) => (
      <ellipse
        key={i}
        cx={cx}
        cy={cy}
        rx={r}
        ry={r / 2.4}
        fill="#8ba86c"
        opacity="0.55"
        transform={`rotate(${rot} ${cx} ${cy})`}
      />
    ))}
  </svg>
)

const InvoiceTemplate = forwardRef(function InvoiceTemplate({ order }, ref) {
  const total = Number(order.sellingPrice || 0)

  return (
    <div
      ref={ref}
      style={{ width: 800, fontFamily: 'system-ui, sans-serif' }}
      className="bg-cream text-[#2b241d] relative overflow-hidden"
    >
      <LeafBranch className="absolute -top-4 -right-4 w-40 h-40" />
      <LeafBranch className="absolute -bottom-8 -left-8 w-40 h-40 rotate-180" />

      <div className="relative px-12 pt-12 pb-8">
        <div className="flex items-start justify-between gap-8">
          <div className="flex items-start gap-5">
            <img
              src="/logo.jpg"
              alt=""
              className="h-28 w-28 rounded-full object-cover shrink-0"
              crossOrigin="anonymous"
            />
            <div>
              <h1 className="font-display text-3xl text-crust-dark leading-tight">
                {siteConfig.shopName.toUpperCase()}
              </h1>
              <p className="text-xs tracking-[0.25em] text-crust font-semibold mt-1">BY NAVYA</p>
              <div className="flex items-center gap-2 my-2 text-sage-dark">
                <span className="h-px w-10 bg-sage/50" />
                <span>♥</span>
                <span className="h-px w-10 bg-sage/50" />
              </div>
              <p className="text-[11px] tracking-[0.2em] text-neutral-500 font-semibold mb-2">
                HOME MADE WITH LOVE
              </p>
              <p className="text-xs text-neutral-600 flex items-start gap-1.5 max-w-56">
                <span>📍</span> {siteConfig.address}
              </p>
              {siteConfig.instagram && (
                <p className="text-xs text-neutral-600 flex items-center gap-1.5 mt-1">
                  <span>📷</span> {siteConfig.instagram}
                </p>
              )}
              <p className="text-xs text-neutral-600 flex items-center gap-1.5 mt-1">
                <span>📞</span> {siteConfig.phone}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0 border-l border-neutral-300 pl-8 pt-2">
            <h2 className="font-display text-4xl text-sage-dark font-bold">INVOICE</h2>
            <p className="text-sm text-neutral-600 mt-4">
              Date&nbsp;&nbsp;: <span className="font-medium">{formatInvoiceDate(order.createdAt)}</span>
            </p>
          </div>
        </div>

        <div className="mt-10">
          <span className="inline-block bg-sage-light text-sage-dark text-xs font-bold px-3 py-1 rounded-full border border-sage/40">
            BILL TO
          </span>
          <div className="mt-3 space-y-1.5 text-sm">
            <p>
              <span className="inline-block w-24 text-neutral-500">Name</span>: {order.customerName}
            </p>
            {order.customerMobile && (
              <p>
                <span className="inline-block w-24 text-neutral-500">Phone No.</span>:{' '}
                {order.customerMobile}
              </p>
            )}
            {order.customerAddress && (
              <p>
                <span className="inline-block w-24 text-neutral-500 align-top">Address</span>:{' '}
                {order.customerAddress}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 border border-neutral-300 rounded-lg overflow-hidden">
          <div className="grid grid-cols-[70px_1fr_70px_120px_120px] bg-sage-light text-sage-dark text-xs font-bold">
            <div className="px-3 py-2 border-r border-neutral-300">SR. NO</div>
            <div className="px-3 py-2 border-r border-neutral-300">ITEM / DESCRIPTION</div>
            <div className="px-3 py-2 border-r border-neutral-300 text-center">QTY</div>
            <div className="px-3 py-2 border-r border-neutral-300 text-right">UNIT PRICE</div>
            <div className="px-3 py-2 text-right">TOTAL (₹)</div>
          </div>
          <div className="grid grid-cols-[70px_1fr_70px_120px_120px] text-sm border-t border-neutral-200">
            <div className="px-3 py-3 border-r border-neutral-200">1</div>
            <div className="px-3 py-3 border-r border-neutral-200">
              {order.productName}
              {order.label && <span className="block text-xs text-neutral-500">{order.label}</span>}
            </div>
            <div className="px-3 py-3 border-r border-neutral-200 text-center">1</div>
            <div className="px-3 py-3 border-r border-neutral-200 text-right">
              {total.toFixed(2)}
            </div>
            <div className="px-3 py-3 text-right">{total.toFixed(2)}</div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <div className="w-64 border border-sage/50 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-sage-light">
              <span className="font-bold text-sage-dark text-sm">GRAND TOTAL</span>
              <span className="font-bold text-crust-dark text-sm">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg font-medium text-neutral-700">
            Thank you for choosing {siteConfig.shopName}!
          </p>
          <p className="text-lg font-medium text-neutral-700">We appreciate your support.</p>
          <p className="mt-2 text-cherry">♥</p>
          <p className="mt-4 text-sm text-sage-dark font-medium">
            We'd love to hear your feedback!
          </p>
        </div>
      </div>

      <div className="relative bg-sage-light py-5 text-center">
        <p className="font-display italic text-lg text-crust-dark">
          Baked with love, just for you. ♡
        </p>
      </div>
    </div>
  )
})

export default InvoiceTemplate
