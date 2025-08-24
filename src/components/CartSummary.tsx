import { toast } from "react-toastify";
import { ButtonOutline, ButtonPrimary } from ".";
import { useOrder } from "../contexts/OrderContext";
import { useWhatsApp } from "../hooks/useWhatsApp";
import { formatCurrencyBRL } from "../utils/currency";
import { createOrderNumber } from "../utils/orderNumber";
import { paymentMethods } from "../utils/paymentsMethods";
import { addressFormat } from "../utils/addressFormat";


export function CartSummary({ onBack }: { onBack: () => void }) {
    const { cart, total, deliveryAddress, paymentMethod } = useOrder();
    const { sendOrder } = useWhatsApp();
    const isDelivery = !!deliveryAddress;

    const handleSendOrder = () => {

        sendOrder(createOrderNumber());
        toast.success("Pedido enviado!");
    };

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h5 className="font-semibold text-lg">Pedido</h5>
                <div className="flex flex-col">
                    {cart.map(item => (
                        <div>
                            <div key={item.productId} className="flex justify-between">
                                <span>{item.quantity} x {item.name}</span>
                                <span>{formatCurrencyBRL(item.price * item.quantity)}</span>
                            </div>
                            {item.options && (
                                <div className="flex flex-col pl-4">
                                    {item.options.map(option => (
                                        <span key={option.id}>{option.quantity} x {option.name}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="font-semibold">{formatCurrencyBRL(total)}</span>
                </div>
            </div>
            {isDelivery && typeof deliveryAddress === "object" && (
                <div>
                    <h5 className="font-semibold">Endereço de entrega</h5>
                    <div>
                        {addressFormat(deliveryAddress)}
                    </div>
                </div>
            )}
            <div>
                <h5 className="font-semibold">Forma de pagamento</h5>
                <div>{paymentMethods.find(method => method.id === paymentMethod)?.label}</div>
            </div>
            <div className="flex gap-2">
                <ButtonOutline id="summary-back"
                    onClick={onBack}
                    children="Voltar" />
                <ButtonPrimary id="summary-confirm"
                    onClick={handleSendOrder}
                    children="Confirmar" />
            </div>
        </div>
    );
}