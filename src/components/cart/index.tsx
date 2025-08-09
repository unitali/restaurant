import { toast } from "react-toastify";
import { useCart } from "../../contexts/CartContext";
import { fetchRestaurantById } from "../../services/restaurantsService";
import { formatCurrencyBRL } from "../../utils/currency";
import { ButtonPrimary, ButtonPrimaryMinus, ButtonPrimaryPlus, ButtonPrimaryRemove } from "../button";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { LoadingPage } from "../../pages/LoadingPage";

export function Cart() {
    const { cart, removeFromCart, clearCart, addToCart } = useCart();
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    const restaurantId = location.pathname.split("/menu/")[1]?.split("/")[0];

    const sentOrder = async () => {
        setLoading(true);
        try {
            if (cart.length === 0) return;
            const restaurant = await fetchRestaurantById(restaurantId);

            if (!restaurant) {
                toast.error("Restaurante não encontrado.");
                return;
            }
            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

            const itemsMsg = cart
                .map(
                    (item, index) =>
                        `${index + 1}. ${item.name} (${item.quantity} x ${formatCurrencyBRL(item.price)}) = ${formatCurrencyBRL(item.price * item.quantity)}\n${"-".repeat(50)}`
                )
                .join("\n");

            const message =
                `Olá! Gostaria de fazer um pedido:\n\n${itemsMsg}\n\nTotal: ${formatCurrencyBRL(total)}\n\nAguardo confirmação.`;

            const url = `https://wa.me/${restaurant.phone}?text=${encodeURIComponent(message)}`;
            window.open(url, "_blank");
        } catch (error) {
            toast.error("Erro ao enviar pedido.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingPage />

    return (
        <div className="p-1">
            <h2 className="text-lg font-bold mb-4">Carrinho de Compras</h2>
            <div className="flex flex-col gap-1">
                {cart.map(item => (
                    <div
                        key={item.id}
                        className="bg-white rounded-lg shadowflex p-5 flex-col gap-1 border border-gray-100 w-full"
                    >
                        <div className="font-bold text-base mb-1">{item.name}</div>
                        <div className="flex items-center gap-2 w-full">
                            <ButtonPrimaryMinus
                                id={`remove-${item.id}`}
                                onClick={() => removeFromCart(item.id!)}
                                quantity={item.quantity}
                            />
                            <span className="font-semibold">{item.quantity}</span>
                            <ButtonPrimaryPlus
                                id={`add-${item.id}`}
                                onClick={() => addToCart(item)}
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
    );
}
