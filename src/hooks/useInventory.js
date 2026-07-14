import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'

export function useInventory() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'inventory'), orderBy('name'))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      },
    )
    return unsubscribe
  }, [])

  return { items, loading, error }
}

export function groupInventoryByCategory(items) {
  const groups = new Map()
  for (const item of items) {
    const category = item.category?.trim() || 'Other'
    if (!groups.has(category)) groups.set(category, [])
    groups.get(category).push(item)
  }
  return Array.from(groups.entries())
    .map(([category, categoryItems]) => ({
      category,
      items: [...categoryItems].sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.category.localeCompare(b.category))
}
