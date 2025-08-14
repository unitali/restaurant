import { useState } from "react";
import { toast } from "react-toastify";
import { useCart } from "../contexts/CartContext";
import { useRestaurant } from "../contexts/RestaurantContext";
import { LoadingPage } from "../pages/LoadingPage";
import { sendWhatsAppMessage } from "../services/whatsAppService";
import { formatCurrencyBRL } from "../utils/currency";
import { ButtonPrimary, ButtonPrimaryMinus, ButtonPrimaryPlus } from "./Button";

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Cart({ isOpen, onClose }: CartProps) {
    // 1. Obtenha o `total` do contexto. Ele já calcula os adicionais.
    const { cart, removeFromCart, clearCart, addToCart, total } = useCart();
    const { restaurant } = useRestaurant();
    const [loading, setLoading] = useState(false);

    const sentOrder = async (e: React.FormEvent) => {
        e.preventDefault(); // Adicione o evento e previna o default
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
            // A chamada para o serviço está correta
            sendWhatsAppMessage({ restaurant: restaurant.company, cart });
            clearCart();
        } catch (error) {
            toast.error("Erro ao enviar pedido");
        } finally {
            setLoading(false);
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
                <form className="p-1" onSubmit={sentOrder}>
                    <h2 className="text-lg font-bold mb-4">Carrinho de Compras</h2>
                    <div className="flex flex-col gap-1">
                        {cart.map(item => (
                            <div
                                key={item.id}
                                className="bg-white rounded-lg shadowflex p-5 flex-col gap-1 border border-gray-100 w-full"
                            >
                                <div className="font-bold text-base mb-1">{item.name}</div>
                                {item.observation && <p className="text-sm text-gray-500 pl-2">Obs: {item.observation}</p>}
                                {item.selectedOptions && item.selectedOptions.length > 0 && (
                                    <ul className="text-sm text-gray-500 pl-2">
                                        {item.selectedOptions.map(opt => (
                                            <li key={opt.id}>- {opt.price}x {opt.name}</li>
                                        ))}
                                    </ul>
                                )}
                                <div className="flex items-center gap-2 w-full mt-2">
                                    <ButtonPrimaryMinus
                                        id={`remove-${item.id}`}
                                        onClick={() => removeFromCart(item.id!)}
                                        quantity={item.quantity}
                                    />
                                    <span className="font-semibold">{item.quantity}</span>
                                    <ButtonPrimaryPlus
                                        id={`add-${item.id}`}
                                        // 2. Corrija a chamada para enviar o item completo com quantidade 1
                                        onClick={() => addToCart({ ...item, quantity: 1 })}
                                    />
                                    <span className="ml-3 text-green-700 font-bold flex-1 text-right">
                                        {formatCurrencyBRL(item.price * item.quantity)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <span className="font-bold text-lg">Total: </span>
                        <span className="text-green-700 font-bold">
                            {/* 3. Use o `total` do contexto */}
                            {formatCurrencyBRL(total)}
                        </span>
                    </div>
                    <div className="mt-4 w-full flex flex-col gap-2">
                        <ButtonPrimary
                            id="submit-order"
                            type="submit"
                            children="Enviar Pedido"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
