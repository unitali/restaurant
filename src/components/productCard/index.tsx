import { useState } from "react";
import { FaFileImage, FaPlus } from "react-icons/fa";
import type { ProductType } from "../../types";
import { formatCurrencyBRL } from "../../utils/currency";
import { useCart } from "../../contexts/CartContext";


export function ProductCard({ product }: { product: ProductType }) {
    const [clicked, setClicked] = useState(false);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        setClicked(true);
        setTimeout(() => setClicked(false), 180); // efeito breve
        addToCart(product);
    };

    return (
        <div className="bg-white rounded shadow p-3 w-40 h-64 flex flex-col items-center justify-between">
            {product.image?.url ? (
                <img src={product.image?.url}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded mb-2" />
            ) : (
                <FaFileImage className="w-12 h-12 text-gray-200 rounded mb-2" />
            )}
            <h3 className="font-bold text-base text-center">{product.name}</h3>
            <p className="text-gray-600 text-xs text-center flex-1">{product.description}</p>
            <div className="flex items-center w-full mt-2">
                <span className="font-semibold text-green-700 text-base flex-1">
                    {formatCurrencyBRL(product.price)}
                </span>
                <button
                    type="button"
                    onClick={handleAddToCart}
                    onMouseDown={() => setClicked(true)}
                    onMouseUp={() => setClicked(false)}
                    onMouseLeave={() => setClicked(false)}
                    id="add-to-cart"
                    className={`w-8 h-8 rounded-full flex items-center justify-center ml-2 transition-colors duration-150
                        ${clicked ? "bg-green-700" : "bg-green-500 hover:bg-green-600"}`}
                >
                    <FaPlus size={14} className="text-white" />
                </button>
            </div>
        </div>
    );
}