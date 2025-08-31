import { ButtonOutline, ButtonPrimary, Input } from ".";
import { useOrder } from "../contexts/OrderContext";
import { useOrders } from "../hooks/useOrders";
import { useWhatsApp } from "../hooks/useWhatsApp";
import { addressFormat } from "../utils/addressFormat";
import { formatCurrencyBRL } from "../utils/currency";
import { createOrderNumber } from "../utils/orderNumber";
import { paymentMethods } from "../utils/paymentsMethods";

interface CartSummaryProps {
    onBack: () => void;
    onClose: () => void;
}

export function CartSummary(props: CartSummaryProps) {
    const { cart, total, deliveryAddress, paymentMethod, deliveryTax, setName, name } = useOrder();
    const { createOrder } = useOrders();
    const { sendWhatsAppOrder } = useWhatsApp();
    const isDelivery = !!deliveryAddress;

    const handleSendOrder = async () => {
        let orderNumber = createOrderNumber();
        await sendWhatsAppOrder(orderNumber);
        await createOrder(orderNumber);
        props.onClose();
    };

    const paymentLabel =
        paymentMethods.find(method => method.id === paymentMethod?.type)?.label || "Não informado";
    const isNameFilled = !!name && name.trim().length > 0;

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h5 className="font-semibold text-lg">Pedido</h5>
                <div className="flex flex-col">
                    {cart.map((item, index) => (
                        <div key={index}>
                            <div className="flex justify-between">
                                <span>{item.quantity} x {item.name}</span>
                                <span>{formatCurrencyBRL((item.price ?? 0) * item.quantity)}</span>
                            </div>
                            {item.options && (
                                <div className="flex flex-col pl-4">
                                    {item.options.map((option, index) => (
                                        <span key={index}>{option.quantity} x {option.name}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {isDelivery && deliveryTax > 0 && (
                    <div className="flex justify-between my-2">
                        <span>Taxa de Entrega</span>
                        <span>{formatCurrencyBRL(deliveryTax)}</span>
                    </div>
                )}
                <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="font-semibold">{isDelivery ? formatCurrencyBRL(total) : formatCurrencyBRL(total)}</span>
                </div>
            </div>
            {
                isDelivery && typeof deliveryAddress === "object" && (
                    <div>
                        <h5 className="font-semibold">Endereço de entrega</h5>
                        <div>
                            {addressFormat(deliveryAddress)}
                        </div>
                    </div>
                )
            }
            <div>
                <h5 className="font-semibold">Forma de pagamento</h5>
                <div>{paymentLabel}</div>
            </div>
            <Input
                id="summary-name"
                label="Nome"
                placeholder="Digite seu nome..."
                required
                value={name}
                onChange={(e) => { setName(e.target.value) }}
            />
            <div className="flex gap-2">
                <ButtonOutline
                    id="summary-back"
                    onClick={props.onBack}
                    children="Voltar"
                />
                <ButtonPrimary
                    id="summary-confirm"
                    onClick={handleSendOrder}
                    children="Confirmar"
                    disabled={!isNameFilled}
                />
            </div>
        </div >
    );
}