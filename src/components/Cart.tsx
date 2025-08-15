import { ButtonPrimary, ButtonPrimaryMinus, ButtonPrimaryPlus } from ".";
import { useCart } from "../contexts/CartContext";
import { useWhatsApp } from "../hooks/useWhatsApp";
import { LoadingPage } from "../pages/LoadingPage";
import { formatCurrencyBRL } from "../utils/currency";

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Cart({ isOpen, onClose }: CartProps) {
    const { cart, removeFromCart, addToCart, total } = useCart();
    const { sendOrder, loading } = useWhatsApp();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await sendOrder();
        if (cart.length > 0) {
            onClose();
        }
    };

    if (loading) return <LoadingPage />;
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded shadow-lg p-6 w-full max-w-md relative">
                <button
                    id="button-close-modal-cart"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-red-500 cursor-pointer hover:text-red-700 text-2xl"
                >
                    &times;
                </button>
                <form className="p-1" onSubmit={handleSubmit}>
                    <h2 className="text-lg font-bold mb-4">Carrinho de Compras</h2>
                    <div className="flex flex-col gap-1">
                        {cart.map((product, index) => (
                            <div
                                key={`product-${index}`}
                                className="bg-white rounded-lg shadowflex p-5 flex-col gap-1 border border-gray-100 w-full"
                            >
                                <div className="font-bold text-base mb-1">{product.name}</div>
                                {product.observation && <p className="text-sm text-gray-500 pl-2">Obs: {product.observation}</p>}
                                {product.options && product.options.length > 0 && (
                                    <ul className="text-sm text-gray-500 pl-2">
                                        {product.options.map((option) => (
                                            <li key={option.id}>- {option.quantity}x {option.name} (+{formatCurrencyBRL(option.price)})</li>
                                        ))}
                                    </ul>
                                )}
                                <div className="flex items-center gap-2 w-full mt-2">
                                    <ButtonPrimaryMinus
                                        id={`remove-item-${product.productId}`}
                                        onClick={() => removeFromCart(product.productId!)}
                                        quantity={product.quantity}
                                    />
                                    <span className="font-semibold">{product.quantity}</span>
                                    <ButtonPrimaryPlus
                                        id={`add-item-${product.productId}`}
                                        onClick={() => addToCart({ ...product, quantity: 1 })}
                                    />
                                    <span className="ml-3 text-green-700 font-bold flex-1 text-right">
                                        {formatCurrencyBRL(
                                            (product.price + (product.options?.reduce((acc, opt) => acc + (opt.price * (opt.quantity ?? 1)), 0) ?? 0)) * product.quantity
                                        )}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <span className="font-bold text-lg">Total: </span>
                        <span className="text-green-700 font-bold">
                            {formatCurrencyBRL(total)}
                        </span>
                    </div>
                    <div className="mt-4 w-full flex flex-col gap-2">
                        <ButtonPrimary
                            id="submit-order"
                            type="submit"
                            disabled={loading}
                            children={loading ? "Enviando..." : "Enviar Pedido"}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
