import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function SortableProductRow({ product, onEdit, onDelete, deleting }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 flex items-center gap-3"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="shrink-0 text-neutral-400 hover:text-neutral-600 cursor-grab active:cursor-grabbing px-1 py-2 touch-none"
      >
        <svg width="16" height="24" viewBox="0 0 16 24" fill="currentColor">
          <circle cx="4" cy="4" r="1.6" />
          <circle cx="12" cy="4" r="1.6" />
          <circle cx="4" cy="12" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="4" cy="20" r="1.6" />
          <circle cx="12" cy="20" r="1.6" />
        </svg>
      </button>

      <img
        src={product.imageUrl}
        alt=""
        className="w-16 h-16 rounded-lg object-cover bg-cream-dark shrink-0"
        onError={(e) => {
          e.currentTarget.style.visibility = 'hidden'
        }}
      />
      <div className="grow min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-crust-dark truncate">{product.name}</h3>
          {product.available === false && (
            <span className="text-xs bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded-full">
              Hidden
            </span>
          )}
        </div>
        <p className="text-sm text-neutral-500 truncate">{product.description}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-semibold text-cherry">₹{Number(product.price).toFixed(2)}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => onEdit(product)}
          className="text-sm border border-neutral-300 hover:bg-neutral-50 px-3 py-1.5 rounded-lg"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product)}
          disabled={deleting}
          className="text-sm border border-cherry/40 text-cherry hover:bg-cherry/5 px-3 py-1.5 rounded-lg disabled:opacity-60"
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  )
}
