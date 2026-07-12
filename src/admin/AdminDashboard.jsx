import { useState } from 'react'
import { Link } from 'react-router-dom'
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useProducts, groupByCategory, nextOrderInCategory } from '../hooks/useProducts'
import ProductForm from './ProductForm'
import SortableCategoryList from './SortableCategoryList'
import { siteConfig } from '../siteConfig'

export default function AdminDashboard() {
  const { user } = useAuth()
  const { products, loading } = useProducts()
  const [editing, setEditing] = useState(null) // null = closed, {} = new, product = edit
  const [deletingId, setDeletingId] = useState(null)

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))].sort()
  const grouped = groupByCategory(products)

  async function handleSave(data) {
    if (editing?.id) {
      await updateDoc(doc(db, 'products', editing.id), data)
    } else {
      const order = nextOrderInCategory(products, data.category)
      await addDoc(collection(db, 'products'), { ...data, order, createdAt: serverTimestamp() })
    }
    setEditing(null)
  }

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    setDeletingId(product.id)
    try {
      await deleteDoc(doc(db, 'products', product.id))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-sage-dark text-cream">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl">{siteConfig.shopName} — Dashboard</h1>
            <p className="text-xs text-cream-dark/70">{user?.email}</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/" className="hover:underline">
              View Site
            </Link>
            <button
              onClick={() => signOut(auth)}
              className="border border-cream-dark/40 hover:border-cream px-3 py-1.5 rounded-full"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-2xl text-crust-dark">Menu Items</h2>
          <button
            onClick={() => setEditing({})}
            className="bg-sage hover:bg-sage-dark transition-all duration-300 hover:scale-105 hover:shadow-lg text-white font-semibold px-5 py-2.5 rounded-full text-sm"
          >
            + Add New Item
          </button>
        </div>
        {products.length > 0 && (
          <p className="text-xs text-neutral-500 mb-6">
            Drag the ⣿ handle to reorder items within a category — this is also the order
            customers see on the menu.
          </p>
        )}

        {loading && <p className="text-neutral-500">Loading…</p>}
        {!loading && products.length === 0 && (
          <p className="text-neutral-500">
            No menu items yet. Click "Add New Item" to create your first one.
          </p>
        )}

        {grouped.map(({ category, items }) => (
          <div key={category} className="mb-8">
            <h3 className="font-display text-lg text-crust-dark mb-3">{category}</h3>
            <SortableCategoryList
              items={items}
              onEdit={setEditing}
              onDelete={handleDelete}
              deletingId={deletingId}
            />
          </div>
        ))}
      </main>

      {editing !== null && (
        <ProductForm
          initial={editing.id ? editing : null}
          categories={categories}
          onSubmit={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  )
}
