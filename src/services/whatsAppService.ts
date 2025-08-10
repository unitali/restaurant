import type { } from "../contexts/CartContext";
import type { CompanyType, CartItem } from "../types";
import { formatCurrencyBRL } from "../utils/currency";

interface SendWhatsAppMessageProps {
    restaurant: CompanyType;
    cart: CartItem[];
}

export async function sendWhatsAppMessage({ ...props }: SendWhatsAppMessageProps) {
    if (props.cart.length === 0) return;

    const total = props.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const itemsMsg = props.cart
        .map(
            (item, index) =>
                `${index + 1}. ${item.product.name} (${item.quantity} x ${formatCurrencyBRL(item.price)}) = ${formatCurrencyBRL(item.price * item.quantity)}\n${"-".repeat(50)}`
        )
        .join("\n");

    const message =
        `Olá! Gostaria de fazer um pedido:\n\n${itemsMsg}\n\nTotal: ${formatCurrencyBRL(total)}\n\nAguardo confirmação.`;

    const url = `https://wa.me/${props.restaurant.phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
}