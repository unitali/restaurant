import { FaFileImage } from "react-icons/fa";
import { useCart } from "../../contexts/CartContext";
import type { ProductType } from "../../types";
import { formatCurrencyBRL } from "../../utils/currency";
import { ButtonPrimaryMinus, ButtonPrimaryPlus } from "../button";


export function ProductCard({ product }: { product: ProductType }) {
    const { addToCart, removeFromCart, cart } = useCart();

    const cartItem = cart.find(item => item.product.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

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
            <p className="text-gray-600 text-xs text-center">{product.description}</p>
            <div className="flex flex-col items-center w-full mt-2">
                <span className="font-semibold text-green-700 text-base mb-1">
                    {formatCurrencyBRL(product.price)}
                </span>
                <div className="flex items-center justify-center w-full">
                    {quantity > 0 && (
                        <ButtonPrimaryMinus
                            id={`button-remove-${product.id}`}
                            onClick={() => product.id && removeFromCart(product.id)}
                            quantity={quantity} />
                    )}
                    <ButtonPrimaryPlus
                        id={`button-add-${product.id}`}
                        onClick={() => addToCart(product)}
                        quantity={quantity} />
                </div>
            </div>
        </div>
    );
}