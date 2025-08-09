import { useEffect, useRef, useState } from "react";
import { ProductCard } from "..";
import type { ProductType } from "../../types";

export function Slider({ products, autoSlide = false, slideInterval = 3000 }: { products: ProductType[], autoSlide?: boolean, slideInterval?: number }) {
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
        <div className="flex justify-center items-center w-full min-h-[18rem]">
            <div key={products[current].id} className="flex-shrink-0 w-40">
                <ProductCard product={products[current]} />
            </div>
        </div>
    );
}