import { useState } from "react";
import { toast } from "react-toastify";
import { useCart } from "../../contexts/CartContext";
import { useRestaurant } from "../../contexts/RestaurantContext";
import { LoadingPage } from "../../pages/LoadingPage";
import { sendWhatsAppMessage } from "../../services/whatsAppService";
import { formatCurrencyBRL } from "../../utils/currency";
import { ButtonPrimary, ButtonPrimaryMinus, ButtonPrimaryPlus, ButtonPrimaryRemove } from "../button";

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Cart({ ...props }: CartProps) {
    const { cart, removeFromCart, clearCart, addToCart } = useCart();
    const { restaurant } = useRestaurant();
    const [loading, setLoading] = useState(false);

    const sentOrder = async () => {
        setLoading(true);
        try {
            if (!cart || cart.length === 0) {
                setLoading(false);
                return;
            }
            if (!restaurant) {
                toast.error("Restaurante não encontrado.");
                setLoading(false);
                return;
            }
            sendWhatsAppMessage({ restaurant: restaurant.company, cart });
            clearCart();
        } catch (error) {
            toast.error("Erro ao enviar pedido");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingPage />;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50">
            <div className="bg-white w-80 h-full shadow-lg p-4 overflow-y-auto">
                <button
                    className="mb-4 text-gray-500 hover:text-gray-800"
                    onClick={props.onClose}
                >
                    Fechar
                </button>
                <div className="p-1">
                    <h2 className="text-lg font-bold mb-4">Carrinho de Compras</h2>
                    <div className="flex flex-col gap-1">
                        {cart.map(item => (
                            <div
                                key={item.product.id}
                                className="bg-white rounded-lg shadowflex p-5 flex-col gap-1 border border-gray-100 w-full"
                            >
                                <div className="font-bold text-base mb-1">{item.product.name}</div>
                                <div className="flex items-center gap-2 w-full">
                                    <ButtonPrimaryMinus
                                        id={`remove-${item.product.id}`}
                                        onClick={() => removeFromCart(item.product.id!)}
                                        quantity={item.quantity}
                                    />
                                    <span className="font-semibold">{item.quantity}</span>
                                    <ButtonPrimaryPlus
                                        id={`add-${item.product.id}`}
                                        onClick={() => addToCart(item.product)}
                                    />
                                    <span className="ml-3 text-green-700 font-bold flex-1 text-right">
                                        {formatCurrencyBRL(item.price * item.quantity)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <span className="font-bold text-lg">Total: </span>
                        <span className="text-green-700 font-bold">
                            {formatCurrencyBRL(cart.reduce((sum, item) => sum + item.price * item.quantity, 0))}
                        </span>
                    </div>
                    <div className="mt-4 w-full flex flex-col gap-2">
                        <ButtonPrimary
                            id="submit-order"
                            onClick={sentOrder}
                            children="Enviar Pedido"
                        />
                        <ButtonPrimaryRemove
                            id="clear-cart"
                            onClick={clearCart}
                            children="Limpar Carrinho"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
