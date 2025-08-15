import type { } from "../contexts/CartContext";
import type { CompanyType, CartItem } from "../types";
import { formatCurrencyBRL } from "../utils/currency";

interface SendWhatsAppMessageProps {
    restaurant: CompanyType;
    cart: CartItem[];
}

export async function sendWhatsAppMessage({ ...props }: SendWhatsAppMessageProps) {
    if (props.cart.length === 0) return;

    const now = new Date();
    const orderNumber = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(Math.random() * 9000 + 1000)}`;

    const total = props.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const itemsMsg = props.cart
        .map(
            (item, index) =>
                `${index + 1}. ${item.name}  \n` +
                `  Quantidade: ${item.quantity}  \n` +
                `  Preço unitário: ${formatCurrencyBRL(item.price)}  \n` +
                (item.selectedOptions && item.selectedOptions.length > 0
                    ? `  Opções: \n${
                        item.selectedOptions.map(option => `    - ${option.name} - ${formatCurrencyBRL(option.price * (option.quantity ?? 1))}`).join("\n")}  \n`
                    : ""
                ) +
                  (item.observation && item.observation.length > 0
                    ? `  Observação: ${item.observation}\n`
                    : ""
                ) +
                `  Subtotal: ${formatCurrencyBRL(item.price * item.quantity)}\n` +
                `${"-".repeat(30)}`
        )
        .join("\n");

    const message =
        `Pedido Nº: ${orderNumber}\n\n` +
        `${itemsMsg}\n` +
        `\nTotal: ${formatCurrencyBRL(total)}\n\n` +
        `Obrigado pelo pedido!`;

    const url = `https://wa.me/${props.restaurant.phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
}
