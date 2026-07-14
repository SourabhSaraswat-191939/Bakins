import { useState } from 'react'

export default function StockAdjustModal({ item, onSubmit, onCancel }) {
  const [mode, setMode] = useState('add') // 'add' | 'remove'
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const amountNum = Number(amount)
  const priceNum = Number(price)
  const wouldGoNegative = mode === 'remove' && amountNum > (item.stock ?? 0)
  const newPricePerUnit = mode === 'add' && amountNum > 0 && priceNum > 0 ? priceNum / amountNum : null

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!(amountNum > 0)) return setError('Enter a quantity greater than zero.')

    setSaving(true)
    try {
      if (mode === 'add' && priceNum > 0) {
        await onSubmit({
          delta: amountNum,
          packagePrice: priceNum,
          packageQty: amountNum,
          pricePerUnit: priceNum / amountNum,
        })
      } else {
        await onSubmit({ delta: mode === 'add' ? amountNum : -amountNum })
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fade-in-fast">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6 animate-modal-in">
        <h2 className="font-display text-xl text-crust-dark mb-1">{item.name}</h2>
        <p className="text-sm text-neutral-500 mb-4">
          Current stock: {item.stock} {item.unit} · ₹{item.pricePerUnit?.toFixed(4)}/{item.unit}
        </p>

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setMode('add')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors ${
              mode === 'add'
                ? 'bg-sage text-white border-sage'
                : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            + Add Stock
          </button>
          <button
            type="button"
            onClick={() => setMode('remove')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors ${
              mode === 'remove'
                ? 'bg-cherry text-white border-cherry'
                : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            − Remove Stock
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Quantity ({item.unit})
            </label>
            <input
              autoFocus
              required
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage"
            />
            {wouldGoNegative && (
              <p className="text-xs text-cherry mt-1">
                This is more than you currently have in stock — stock will go negative.
              </p>
            )}
          </div>

          {mode === 'add' && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Price paid for this stock (optional)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage"
                placeholder="Leave blank to keep the current cost per unit"
              />
              {newPricePerUnit !== null && (
                <p className="text-xs text-neutral-500 mt-1">
                  ≈ ₹{newPricePerUnit.toFixed(4)} per {item.unit} — this updates the item's cost
                  for future order entries
                </p>
              )}
            </div>
          )}

          {error && <p className="text-sm text-cherry">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className={`flex-1 text-white font-semibold py-2.5 rounded-lg disabled:opacity-60 transition-colors ${
                mode === 'add' ? 'bg-sage hover:bg-sage-dark' : 'bg-cherry hover:bg-cherry-dark'
              }`}
            >
              {saving ? 'Saving…' : mode === 'add' ? 'Add Stock' : 'Remove Stock'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-neutral-300 hover:bg-neutral-50 transition-colors font-semibold py-2.5 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
