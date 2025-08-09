import { useEffect, useRef, useState } from "react";
import { ProductCard } from "..";
import type { ProductType } from "../../types";

export function ProductCarousel({ products, autoSlide = false, slideInterval = 3000 }: { products: ProductType[], autoSlide?: boolean, slideInterval?: number }) {
    const [current, setCurrent] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (autoSlide) {
            intervalRef.current = setInterval(() => {
                setCurrent((prev) => (prev + 1) % products.length);
            }, slideInterval);
            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        }
        return undefined;
    }, [autoSlide, slideInterval, products.length]);

    if (products.length === 0) return null;

    return (
        <div className="flex gap-1 overflow-x-auto px-1 pb-2 snap-x">
      {products.map((product) => (
        <div key={product.id} className="snap-center flex-shrink-0 w-40">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
    );
}