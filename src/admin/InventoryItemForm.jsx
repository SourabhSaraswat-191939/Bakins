import { useState } from 'react'

const emptyForm = {
  name: '',
  category: '',
  unit: 'g',
  packagePrice: '',
  packageQty: '',
  stock: '',
}

const UNITS = [
  { value: 'g', label: 'grams (g)' },
  { value: 'ml', label: 'millilitres (ml)' },
  { value: 'pcs', label: 'pieces (pcs)' },
]

export default function InventoryItemForm({ initial, categories, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial ? { ...emptyForm, ...initial } : emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  const packagePriceNum = Number(form.packagePrice)
  const packageQtyNum = Number(form.packageQty)
  const pricePerUnit =
    packagePriceNum > 0 && packageQtyNum > 0 ? packagePriceNum / packageQtyNum : null

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const name = form.name.trim()
    const category = form.category.trim()
    const stock = Number(form.stock)

    if (!name) return setError('Name is required.')
    if (!category) return setError('Category is required.')
    if (!(packagePriceNum > 0)) return setError('Enter a valid package price.')
    if (!(packageQtyNum > 0)) return setError('Enter a valid package quantity.')
    if (Number.isNaN(stock) || stock < 0) return setError('Enter a valid stock quantity.')

    setSaving(true)
    try {
      await onSubmit({
        name,
        category,
        unit: form.unit,
        packagePrice: packagePriceNum,
        packageQty: packageQtyNum,
        pricePerUnit: packagePriceNum / packageQtyNum,
        stock,
      })
    } catch {
      setError('Something went wrong saving this item. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fade-in-fast">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-modal-in">
        <h2 className="font-display text-xl text-crust-dark mb-4">
          {initial ? 'Edit Raw Material' : 'Add Raw Material'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage"
              placeholder="e.g. Whipping Cream"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
              <input
                required
                list="inventory-category-suggestions"
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage"
                placeholder="e.g. Cream & Compound"
              />
              <datalist id="inventory-category-suggestions">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Unit</label>
              <select
                value={form.unit}
                onChange={(e) => update('unit', e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage bg-white"
              >
                {UNITS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Package price (₹)
              </label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.packagePrice}
                onChange={(e) => update('packagePrice', e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage"
                placeholder="e.g. 240"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Package qty ({form.unit})
              </label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.packageQty}
                onChange={(e) => update('packageQty', e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage"
                placeholder="e.g. 1000"
              />
            </div>
          </div>

          <p className="text-sm text-sage-dark bg-sage-light rounded-lg px-3 py-2">
            {pricePerUnit !== null
              ? `≈ ₹${pricePerUnit.toFixed(4)} per ${form.unit} — used to cost order entries`
              : 'Enter package price and quantity to see the cost per unit.'}
          </p>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Current stock ({form.unit})
            </label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.stock}
              onChange={(e) => update('stock', e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage"
              placeholder="How much you currently have on hand"
            />
            <p className="text-xs text-neutral-500 mt-1">
              After creating this item, use "Add Stock" / "Remove Stock" on the list to adjust
              this without retyping the total.
            </p>
          </div>

          {error && <p className="text-sm text-cherry">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-sage hover:bg-sage-dark transition-colors text-white font-semibold py-2.5 rounded-lg disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save Item'}
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
