import { useState } from 'react'

function newRow(inventoryId = '', qty = '') {
  return { key: crypto.randomUUID(), inventoryId, qty }
}

export default function OrderForm({ inventoryItems, initial, onSubmit, onCancel }) {
  const [productName, setProductName] = useState(initial?.productName ?? '')
  const [label, setLabel] = useState(initial?.label ?? '')
  const [customerName, setCustomerName] = useState(initial?.customerName ?? '')
  const [customerMobile, setCustomerMobile] = useState(initial?.customerMobile ?? '')
  const [customerAddress, setCustomerAddress] = useState(initial?.customerAddress ?? '')
  const [rows, setRows] = useState(
    initial?.items?.length
      ? initial.items.map((i) => newRow(i.inventoryId, i.qtyUsed))
      : [newRow()],
  )
  const [sellingPrice, setSellingPrice] = useState(
    initial?.sellingPrice != null ? String(initial.sellingPrice) : '',
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const itemsById = Object.fromEntries(inventoryItems.map((i) => [i.id, i]))

  function updateRow(key, field, value) {
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, [field]: value } : r)))
  }

  function addRow() {
    setRows((rs) => [...rs, newRow()])
  }

  function removeRow(key) {
    setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.key !== key) : rs))
  }

  const lineCosts = rows.map((r) => {
    const item = itemsById[r.inventoryId]
    const qty = Number(r.qty)
    const cost = item && qty > 0 ? qty * item.pricePerUnit : 0
    return { ...r, item, qty, cost }
  })
  const makingCost = lineCosts.reduce((sum, r) => sum + r.cost, 0)
  const sellingPriceNum = Number(sellingPrice) || 0
  const profit = sellingPriceNum - makingCost

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const usedRows = lineCosts.filter((r) => r.item && r.qty > 0)
    if (!customerName.trim()) return setError("Enter the customer's name.")
    if (!productName.trim()) return setError('Enter the product name.')
    if (usedRows.length === 0) return setError('Add at least one raw material used.')
    if (!(sellingPriceNum >= 0)) return setError('Enter a valid selling price.')

    setSaving(true)
    try {
      await onSubmit({
        productName: productName.trim(),
        label: label.trim(),
        customerName: customerName.trim(),
        customerMobile: customerMobile.trim(),
        customerAddress: customerAddress.trim(),
        items: usedRows.map((r) => ({
          inventoryId: r.item.id,
          name: r.item.name,
          unit: r.item.unit,
          qtyUsed: r.qty,
          pricePerUnit: r.item.pricePerUnit,
          lineCost: r.cost,
        })),
        makingCost,
        sellingPrice: sellingPriceNum,
        profit,
      })
    } catch {
      setError('Something went wrong saving this order. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fade-in-fast">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 animate-modal-in">
        <h2 className="font-display text-xl text-crust-dark mb-4">
          {initial ? 'Edit Order Cost Entry' : 'New Order Cost Entry'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Product name
            </label>
            <input
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage"
              placeholder="e.g. 1kg Chocolate Truffle Cake"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Shown as the item name on the customer's invoice.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Order note (optional)
            </label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage"
              placeholder="e.g. deliver by 6pm"
            />
          </div>

          <div className="border-t border-neutral-200 pt-4">
            <p className="text-sm font-medium text-neutral-700 mb-2">Customer details</p>
            <div className="space-y-3">
              <input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage"
                placeholder="Customer name"
              />
              <input
                type="tel"
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage"
                placeholder="Mobile number (optional)"
              />
              <textarea
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                rows={2}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage"
                placeholder="Delivery address (optional)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Raw materials used
            </label>
            <div className="space-y-2">
              {rows.map((row) => (
                <div
                  key={row.key}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 bg-cream-dark/40 sm:bg-transparent rounded-lg p-2 sm:p-0"
                >
                  <select
                    value={row.inventoryId}
                    onChange={(e) => updateRow(row.key, 'inventoryId', e.target.value)}
                    className="w-full sm:flex-1 sm:min-w-0 border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage bg-white"
                  >
                    <option value="">Select material…</option>
                    {inventoryItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} (₹{item.pricePerUnit.toFixed(4)}/{item.unit})
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={row.qty}
                      onChange={(e) => updateRow(row.key, 'qty', e.target.value)}
                      placeholder="Qty"
                      className="w-24 border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage"
                    />
                    <span className="text-sm text-neutral-500 w-16 shrink-0 text-right">
                      ₹
                      {(itemsById[row.inventoryId] && row.qty
                        ? Number(row.qty) * itemsById[row.inventoryId].pricePerUnit
                        : 0
                      ).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeRow(row.key)}
                      aria-label="Remove row"
                      className="text-neutral-400 hover:text-cherry px-1 shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addRow}
              className="mt-2 text-sm font-semibold text-sage-dark hover:underline"
            >
              + Add another material
            </button>
          </div>

          <div className="border-t border-neutral-200 pt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Total making cost</span>
              <span className="font-semibold text-crust-dark">₹{makingCost.toFixed(2)}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Selling price (₹)
              </label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage"
              />
            </div>

            <div className="flex items-center justify-between text-base pt-1">
              <span className="font-semibold text-crust-dark">Profit</span>
              <span className={`font-bold ${profit >= 0 ? 'text-sage-dark' : 'text-cherry'}`}>
                ₹{profit.toFixed(2)}
              </span>
            </div>
          </div>

          {error && <p className="text-sm text-cherry">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-sage hover:bg-sage-dark transition-colors text-white font-semibold py-2.5 rounded-lg disabled:opacity-60"
            >
              {saving ? 'Saving…' : initial ? 'Update Entry' : 'Save Entry'}
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
