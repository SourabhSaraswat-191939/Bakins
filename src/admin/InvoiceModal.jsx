import { useRef, useState } from 'react'
import html2canvas from 'html2canvas-pro'
import InvoiceTemplate from './InvoiceTemplate'
import { siteConfig } from '../siteConfig'

export default function InvoiceModal({ order, onClose }) {
  const invoiceRef = useRef(null)
  const [generating, setGenerating] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  async function downloadInvoice() {
    setGenerating(true)
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        backgroundColor: '#fdf8f0',
        useCORS: true,
      })
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `invoice-${(order.customerName || 'customer').replace(/\s+/g, '-').toLowerCase()}.png`
      link.click()
      setDownloaded(true)
    } finally {
      setGenerating(false)
    }
  }

  function handleSendWhatsApp() {
    const digits = (order.customerMobile || '').replace(/\D/g, '')
    const message = `Hi ${order.customerName || ''}, here's your invoice from ${siteConfig.shopName} for ${
      order.productName || 'your order'
    } — total ₹${Number(order.sellingPrice || 0).toFixed(2)}. Thank you for your order!`
    const url = digits
      ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`

    // Open synchronously (before any await) so the browser doesn't treat it as a blocked popup.
    window.open(url, '_blank', 'noopener,noreferrer')
    downloadInvoice()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in-fast">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl max-h-[92vh] overflow-y-auto animate-modal-in">
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-display text-xl text-crust-dark">Invoice Preview</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-neutral-400 hover:text-cherry text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-x-auto">
          <div className="mx-auto" style={{ width: 800 }}>
            <InvoiceTemplate order={order} ref={invoiceRef} />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-neutral-200 px-6 py-4 space-y-3">
          {!order.customerMobile && (
            <p className="text-xs text-cherry">
              No mobile number saved for this order — add one via Edit to open a chat with the
              right customer automatically.
            </p>
          )}
          <p className="text-xs text-neutral-500">
            WhatsApp doesn't let websites attach files automatically — clicking "Send via
            WhatsApp" downloads the invoice image and opens the chat; just attach the downloaded
            image there.
          </p>
          <div className="flex gap-3">
            <button
              onClick={downloadInvoice}
              disabled={generating}
              className="flex-1 border border-sage/50 text-sage-dark hover:bg-sage-light transition-colors font-semibold py-2.5 rounded-lg disabled:opacity-60"
            >
              {generating ? 'Generating…' : downloaded ? 'Downloaded ✓ (again)' : 'Download Invoice'}
            </button>
            <button
              onClick={handleSendWhatsApp}
              className="flex-1 bg-[#25D366] hover:brightness-95 transition-all text-white font-semibold py-2.5 rounded-lg"
            >
              Send via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
