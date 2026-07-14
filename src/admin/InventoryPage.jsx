import { useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  increment,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useInventory, groupInventoryByCategory } from '../hooks/useInventory'
import AdminHeader from './AdminHeader'
import InventoryItemForm from './InventoryItemForm'
import StockAdjustModal from './StockAdjustModal'

function formatUnitPrice(item) {
  const value = item.pricePerUnit ?? (item.packageQty ? item.packagePrice / item.packageQty : 0)
  return value.toFixed(value < 1 ? 4 : 2)
}

export default function InventoryPage() {
  const { items, loading } = useInventory()
  const [editing, setEditing] = useState(null) // null closed, {} new, item = edit
  const [adjusting, setAdjusting] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const categories = [...new Set(items.map((i) => i.category).filter(Boolean))].sort()
  const grouped = groupInventoryByCategory(items)

  async function handleSave(data) {
    if (editing?.id) {
      await updateDoc(doc(db, 'inventory', editing.id), data)
    } else {
      await addDoc(collection(db, 'inventory'), { ...data, createdAt: serverTimestamp() })
    }
    setEditing(null)
  }

  async function handleDelete(item) {
    if (!confirm(`Delete "${item.name}" from inventory? This cannot be undone.`)) return
    setDeletingId(item.id)
    try {
      await deleteDoc(doc(db, 'inventory', item.id))
    } finally {
      setDeletingId(null)
    }
  }

  async function handleAdjustStock({ delta, packagePrice, packageQty, pricePerUnit }) {
    const updates = { stock: increment(delta) }
    if (pricePerUnit != null) {
      updates.packagePrice = packagePrice
      updates.packageQty = packageQty
      updates.pricePerUnit = pricePerUnit
    }
    await updateDoc(doc(db, 'inventory', adjusting.id), updates)
    setAdjusting(null)
  }

  return (
    <div className="min-h-screen bg-cream">
      <AdminHeader />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-2xl text-crust-dark">Raw Material Inventory</h2>
          <button
            onClick={() => setEditing({})}
            className="bg-sage hover:bg-sage-dark transition-all duration-300 hover:scale-105 hover:shadow-lg text-white font-semibold px-5 py-2.5 rounded-full text-sm whitespace-nowrap"
          >
            + Add Material
          </button>
        </div>
        <p className="text-xs text-neutral-500 mb-6">
          Track raw materials, their cost per unit, and stock on hand. This feeds automatically
          into order cost calculations on the Orders tab.
        </p>

        {loading && <p className="text-neutral-500">Loading…</p>}
        {!loading && items.length === 0 && (
          <p className="text-neutral-500">
            No raw materials yet. Click "Add Material" to create your first one.
          </p>
        )}

        {grouped.map(({ category, items: categoryItems }) => (
          <div key={category} className="mb-8">
            <h3 className="font-display text-lg text-crust-dark mb-3">{category}</h3>
            <div className="grid gap-3">
              {categoryItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-crust-dark">{item.name}</h4>
                      {Number(item.stock) <= 0 && (
                        <span className="text-xs font-semibold text-cherry bg-cherry/10 px-2 py-0.5 rounded-full">
                          Out of stock
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-500">
                      {item.stock} {item.unit} in stock · ₹{formatUnitPrice(item)}/{item.unit}
                      <span className="text-neutral-400">
                        {' '}
                        (₹{item.packagePrice} per {item.packageQty}
                        {item.unit} pack)
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap shrink-0">
                    <button
                      onClick={() => setAdjusting(item)}
                      className="text-sm border border-sage/40 text-sage-dark hover:bg-sage-light px-3 py-1.5 rounded-lg"
                    >
                      Adjust Stock
                    </button>
                    <button
                      onClick={() => setEditing(item)}
                      className="text-sm border border-neutral-300 hover:bg-neutral-50 px-3 py-1.5 rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={deletingId === item.id}
                      className="text-sm border border-cherry/40 text-cherry hover:bg-cherry/5 px-3 py-1.5 rounded-lg disabled:opacity-60"
                    >
                      {deletingId === item.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {editing !== null && (
        <InventoryItemForm
          initial={editing.id ? editing : null}
          categories={categories}
          onSubmit={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {adjusting !== null && (
        <StockAdjustModal
          item={adjusting}
          onSubmit={handleAdjustStock}
          onCancel={() => setAdjusting(null)}
        />
      )}
    </div>
  )
}
