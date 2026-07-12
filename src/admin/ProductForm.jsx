import { useState } from 'react'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  imageUrl: '',
  available: true,
}

export default function ProductForm({ initial, categories, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial ? { ...emptyForm, ...initial } : emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const name = form.name.trim()
    const category = form.category.trim()
    const price = Number(form.price)

    if (!name) return setError('Name is required.')
    if (!category) return setError('Category is required.')
    if (Number.isNaN(price) || price < 0) return setError('Enter a valid price.')

    setSaving(true)
    try {
      await onSubmit({
        name,
        category,
        price,
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
        available: form.available,
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
          {initial ? 'Edit Item' : 'Add New Item'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage"
              placeholder="e.g. Chocolate Truffle Cake"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              rows={3}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage"
              placeholder="Short description of the item"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Price (₹)
              </label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Category
              </label>
              <input
                required
                list="category-suggestions"
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage"
                placeholder="e.g. Cakes"
              />
              <datalist id="category-suggestions">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => update('imageUrl', e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage"
              placeholder="https://..."
            />
            <p className="text-xs text-neutral-500 mt-1">
              Paste a direct image link (e.g. from Google Photos, Imgur, or your phone's cloud
              storage share link).
            </p>
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="Preview"
                className="mt-2 w-full h-32 object-cover rounded-lg border border-neutral-200"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => update('available', e.target.checked)}
              className="w-4 h-4"
            />
            Available on menu
          </label>

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
