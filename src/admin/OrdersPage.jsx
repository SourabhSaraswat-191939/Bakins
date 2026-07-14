import { useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  increment,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useOrders } from '../hooks/useOrders'
import { useInventory } from '../hooks/useInventory'
import AdminHeader from './AdminHeader'
import OrderForm from './OrderForm'
import InvoiceModal from './InvoiceModal'

function formatDate(ts) {
  if (!ts?.toDate) return 'Just now'
  return ts.toDate().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function monthStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function orderMonthStr(order) {
  if (!order.createdAt?.toDate) return null
  return monthStr(order.createdAt.toDate())
}

export default function OrdersPage() {
  const { orders, loading } = useOrders()
  const { items: inventoryItems } = useInventory()
  const [formTarget, setFormTarget] = useState(null) // null closed, {} new, order = edit
  const [invoiceTarget, setInvoiceTarget] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [monthFilter, setMonthFilter] = useState(monthStr(new Date()))

  const filteredOrders = monthFilter
    ? orders.filter((o) => orderMonthStr(o) === monthFilter)
    : orders

  const totals = filteredOrders.reduce(
    (acc, o) => ({
      revenue: acc.revenue + (o.sellingPrice || 0),
      cost: acc.cost + (o.makingCost || 0),
      profit: acc.profit + (o.profit || 0),
    }),
    { revenue: 0, cost: 0, profit: 0 },
  )

  async function handleSave(data) {
    if (formTarget?.id) {
      const deltaMap = {}
      for (const item of formTarget.items || []) {
        deltaMap[item.inventoryId] = (deltaMap[item.inventoryId] || 0) + item.qtyUsed
      }
      for (const item of data.items) {
        deltaMap[item.inventoryId] = (deltaMap[item.inventoryId] || 0) - item.qtyUsed
      }

      await updateDoc(doc(db, 'orders', formTarget.id), data)

      const batch = writeBatch(db)
      for (const [inventoryId, delta] of Object.entries(deltaMap)) {
        if (delta !== 0) {
          batch.update(doc(db, 'inventory', inventoryId), { stock: increment(delta) })
        }
      }
      await batch.commit()
    } else {
      await addDoc(collection(db, 'orders'), { ...data, createdAt: serverTimestamp() })

      const batch = writeBatch(db)
      for (const item of data.items) {
        batch.update(doc(db, 'inventory', item.inventoryId), {
          stock: increment(-item.qtyUsed),
        })
      }
      await batch.commit()
    }

    setFormTarget(null)
  }

  async function handleDelete(order) {
    if (
      !confirm(
        'Delete this order entry? This cannot be undone (stock used will not be restored automatically).',
      )
    )
      return
    setDeletingId(order.id)
    try {
      await deleteDoc(doc(db, 'orders', order.id))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <AdminHeader />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-2xl text-crust-dark">Order Cost Entries</h2>
          <button
            onClick={() => setFormTarget({})}
            disabled={inventoryItems.length === 0}
            className="bg-sage hover:bg-sage-dark transition-all duration-300 hover:scale-105 hover:shadow-lg text-white font-semibold px-5 py-2.5 rounded-full text-sm whitespace-nowrap disabled:opacity-50 disabled:hover:scale-100"
          >
            + New Entry
          </button>
        </div>
        {!loading && inventoryItems.length === 0 && (
          <p className="text-xs text-cherry mb-6">
            Add raw materials in the Inventory tab first — order entries cost themselves against
            your inventory items.
          </p>
        )}

        <div className="flex items-center gap-3 flex-wrap mb-6">
          <input
            type="month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage bg-white"
          />
          {monthFilter && (
            <button
              onClick={() => setMonthFilter('')}
              className="text-sm font-semibold text-sage-dark hover:underline"
            >
              Show all time
            </button>
          )}
        </div>

        {orders.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 text-center">
              <p className="text-xs text-neutral-500 mb-1">Orders</p>
              <p className="font-semibold text-crust-dark text-sm sm:text-base">
                {filteredOrders.length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 text-center">
              <p className="text-xs text-neutral-500 mb-1">Revenue</p>
              <p className="font-semibold text-crust-dark text-sm sm:text-base">
                ₹{totals.revenue.toFixed(0)}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 text-center">
              <p className="text-xs text-neutral-500 mb-1">Cost</p>
              <p className="font-semibold text-crust-dark text-sm sm:text-base">
                ₹{totals.cost.toFixed(0)}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 text-center">
              <p className="text-xs text-neutral-500 mb-1">Profit</p>
              <p
                className={`font-semibold text-sm sm:text-base ${
                  totals.profit >= 0 ? 'text-sage-dark' : 'text-cherry'
                }`}
              >
                ₹{totals.profit.toFixed(0)}
              </p>
            </div>
          </div>
        )}

        {loading && <p className="text-neutral-500">Loading…</p>}
        {!loading && orders.length === 0 && (
          <p className="text-neutral-500">No order entries yet. Log your first one above.</p>
        )}
        {!loading && orders.length > 0 && filteredOrders.length === 0 && (
          <p className="text-neutral-500">No orders logged for this month.</p>
        )}

        <div className="grid gap-3">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <h4 className="font-semibold text-crust-dark">
                    {order.customerName || order.label || 'Order entry'}
                  </h4>
                  {order.productName && (
                    <p className="text-sm text-crust font-medium">{order.productName}</p>
                  )}
                  {order.label && (
                    <p className="text-sm text-neutral-600">{order.label}</p>
                  )}
                  <p className="text-xs text-neutral-500">{formatDate(order.createdAt)}</p>
                  {(order.customerMobile || order.customerAddress) && (
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {[order.customerMobile, order.customerAddress].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                  <button
                    onClick={() => setInvoiceTarget(order)}
                    className="text-sm border border-sage/40 text-sage-dark hover:bg-sage-light px-3 py-1.5 rounded-lg"
                  >
                    Invoice
                  </button>
                  <button
                    onClick={() => setFormTarget(order)}
                    className="text-sm border border-neutral-300 hover:bg-neutral-50 px-3 py-1.5 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(order)}
                    disabled={deletingId === order.id}
                    className="text-sm border border-cherry/40 text-cherry hover:bg-cherry/5 px-3 py-1.5 rounded-lg disabled:opacity-60"
                  >
                    {deletingId === order.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>

              <p className="text-sm text-neutral-500 mt-2">
                {order.items?.map((i) => `${i.name} (${i.qtyUsed}${i.unit})`).join(', ')}
              </p>

              <div className="flex items-center gap-4 mt-3 text-sm flex-wrap">
                <span className="text-neutral-600">
                  Cost: <strong className="text-crust-dark">₹{order.makingCost?.toFixed(2)}</strong>
                </span>
                <span className="text-neutral-600">
                  Sold: <strong className="text-crust-dark">₹{order.sellingPrice?.toFixed(2)}</strong>
                </span>
                <span
                  className={`font-semibold ${
                    order.profit >= 0 ? 'text-sage-dark' : 'text-cherry'
                  }`}
                >
                  Profit: ₹{order.profit?.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {formTarget !== null && (
        <OrderForm
          inventoryItems={inventoryItems}
          initial={formTarget.id ? formTarget : null}
          onSubmit={handleSave}
          onCancel={() => setFormTarget(null)}
        />
      )}

      {invoiceTarget !== null && (
        <InvoiceModal order={invoiceTarget} onClose={() => setInvoiceTarget(null)} />
      )}
    </div>
  )
}
