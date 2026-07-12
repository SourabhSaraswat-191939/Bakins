import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'

// Live-updating list of every product (admin dashboard needs unavailable items too).
export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Single orderBy keeps this query on Firestore's automatic single-field
    // index — no composite index to create manually. Category grouping/sorting
    // happens client-side in groupByCategory below.
    const q = query(collection(db, 'products'), orderBy('name'))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      },
    )
    return unsubscribe
  }, [])

  return { products, loading, error }
}

export function groupByCategory(products) {
  const groups = new Map()
  for (const product of products) {
    const category = product.category?.trim() || 'Other'
    if (!groups.has(category)) groups.set(category, [])
    groups.get(category).push(product)
  }
  return Array.from(groups.entries())
    .map(([category, items]) => ({
      category,
      // Items without an explicit `order` (legacy/never-dragged) sort after
      // ordered ones, alphabetically by name, until the owner drags them.
      items: [...items].sort((a, b) => {
        const orderA = a.order ?? Infinity
        const orderB = b.order ?? Infinity
        if (orderA !== orderB) return orderA - orderB
        return a.name.localeCompare(b.name)
      }),
    }))
    .sort((a, b) => a.category.localeCompare(b.category))
}

// Next `order` value to append a new item to the end of its category.
export function nextOrderInCategory(products, category) {
  const inCategory = products.filter((p) => (p.category?.trim() || 'Other') === category)
  if (inCategory.length === 0) return 0
  const maxOrder = Math.max(...inCategory.map((p) => (typeof p.order === 'number' ? p.order : -1)))
  return maxOrder + 1
}
