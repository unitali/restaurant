import type { CartItem } from "../contexts/CartContext";
import type { RestaurantType } from "../types";
import { formatCurrencyBRL } from "../utils/currency";

export async function sendWhatsAppMessage(restaurant: RestaurantType, cart: CartItem[]) {
    if (cart.length === 0) return;

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
}