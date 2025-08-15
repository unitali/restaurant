import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useCart } from '../contexts/CartContext';
import { useRestaurant } from '../contexts/RestaurantContext';
import { formatCurrencyBRL } from '../utils/currency';
import { today } from '../utils/date';


export function useWhatsApp() {
    const [loading, setLoading] = useState(false);
    const { cart, total, clearCart } = useCart();
    const { restaurant } = useRestaurant();

    const sendOrder = useCallback(async () => {
        if (!restaurant) {
            toast.error("Dados do restaurante não encontrados.");
            return;
        }
        if (cart.length === 0) {
            toast.warn("Seu carrinho está vazio.");
            return;
        }

        setLoading(true);

        try {
            const now = today();
            const orderNumber = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(Math.random() * 9000 + 1000)}`;
            const itemsMsg = cart
                .map((product, index) => {
                    const optionsTotalPerUnit = product.options?.reduce(
                        (acc, opt) => acc + (opt.price * (opt.quantity ?? 1)),
                        0
                    ) ?? 0;

                    const lineSubtotal = (product.price + optionsTotalPerUnit) * product.quantity;

                    const optionsString = product.options && product.options.length > 0
                        ? `  Opções:\n${product.options
                            .map(opt => `    - ${opt.quantity}x ${opt.name} (+${formatCurrencyBRL(opt.price)})`)
                            .join("\n")}\n`
                        : "";

                    const observationString = product.observation
                        ? `  Observação: ${product.observation}\n`
                        : "";

                    return (
                        `${index + 1}. *${product.name}*\n` +
                        `  Quantidade: ${product.quantity}\n` +
                        `  Preço: ${formatCurrencyBRL(product.price)}\n` +
                        optionsString +
                        observationString +
                        `  Subtotal: *${formatCurrencyBRL(lineSubtotal)}*\n` +
                        `${"-".repeat(30)}`
                    );
                })
                .join("\n\n");

            const message =
                `Pedido Nº: ${orderNumber}\n\n` +
                `${itemsMsg}\n` +
                `\nTotal: ${formatCurrencyBRL(total)}\n\n` +
                `Obrigado pelo pedido!`;

            const url = `https://wa.me/${restaurant.company.phone}?text=${encodeURIComponent(message)}`;
            window.open(url, "_blank");
            clearCart();

        } catch (error) {
            console.error("Erro ao enviar pedido via WhatsApp:", error);
            toast.error("Não foi possível preparar a mensagem para o WhatsApp.");
        } finally {
            setLoading(false);
        }

    }, [cart, total, restaurant, clearCart]);

    return { sendOrder, loading };
}
