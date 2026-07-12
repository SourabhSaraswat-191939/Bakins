import { useEffect, useState } from 'react'
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { writeBatch, doc } from 'firebase/firestore'
import { db } from '../firebase'
import SortableProductRow from './SortableProductRow'

export default function SortableCategoryList({ items, onEdit, onDelete, deletingId }) {
  const [localItems, setLocalItems] = useState(items)

  useEffect(() => {
    setLocalItems(items)
  }, [items])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
  )

  async function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = localItems.findIndex((p) => p.id === active.id)
    const newIndex = localItems.findIndex((p) => p.id === over.id)
    const reordered = arrayMove(localItems, oldIndex, newIndex)
    setLocalItems(reordered)

    try {
      const batch = writeBatch(db)
      reordered.forEach((product, index) => {
        batch.update(doc(db, 'products', product.id), { order: index })
      })
      await batch.commit()
    } catch (err) {
      console.error('Failed to save new order:', err)
      setLocalItems(items)
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={localItems.map((p) => p.id)} strategy={verticalListSortingStrategy}>
        <div className="grid gap-3">
          {localItems.map((product) => (
            <SortableProductRow
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
              deleting={deletingId === product.id}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
