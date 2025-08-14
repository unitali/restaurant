import { FaFileImage } from "react-icons/fa";
import type { ProductType } from "../types";
import { formatCurrencyBRL } from "../utils/currency";


export function ProductCard({ product }: { product: ProductType }) {
    return (
        <div className="bg-white rounded shadow p-3 flex flex-row items-center w-full min-h-[110px] mb-3">
            <div className="flex-1 flex flex-col justify-center">
                <h3 className="font-bold text-base">{product.name}</h3>
                <p className="text-gray-600 text-xs">{product.description}</p>
                <span className="font-semibold text-green-700 text-base mt-2">
                    {formatCurrencyBRL(product.price)}
                </span>
            </div>
            <div className="ml-4 flex-shrink-0 flex items-center justify-center h-24 w-24">
                {product.image?.url ? (
                    <img
                        src={product.image?.url}
                        alt={product.name}
                        className="object-cover rounded h-24 w-24"
                    />
                ) : (
                    <FaFileImage className="w-16 h-16 text-gray-200 rounded" />
                )}
            </div>
        </div>
    );
}