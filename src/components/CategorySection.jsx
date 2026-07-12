import ProductCard from './ProductCard'
import Reveal from './Reveal'

export default function CategorySection({ category, items }) {
  return (
    <div className="mb-12">
      <Reveal>
        <h3 className="font-display text-2xl text-crust-dark mb-5 pb-2 border-b border-crust/15">
          {category}
        </h3>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((product, i) => (
          <Reveal key={product.id} delay={Math.min(i, 6) * 70}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}
