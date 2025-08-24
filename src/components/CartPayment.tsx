import { useState } from "react";
import { ButtonOutline, ButtonPrimary, RadioButton } from ".";
import { useOrder } from "../contexts/OrderContext";

export function CartPayment({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    const { paymentMethod, setPaymentMethod } = useOrder();
    const [selectedMethod, setSelectedMethod] = useState(paymentMethod ?? "card");

    const handleNext = () => {
        setPaymentMethod(selectedMethod);
        onNext();
    };

    return (
        <div className="flex flex-col gap-4">
            <div>
                <p className="text-lg font-medium mb-2">Escolha a forma de pagamento</p>
                <div className="flex flex-col gap-2">
                    <RadioButton
                        name="payment-cash"
                        label="Dinheiro"
                        checked={selectedMethod === "cash"}
                        onChange={() => setSelectedMethod("cash")}
                    />
                    <RadioButton
                        name="payment-card"
                        checked={selectedMethod === "card"}
                        label="Cartão"
                        onChange={() => setSelectedMethod("card")}
                    />
                    <RadioButton
                        name="payment-pix"
                        checked={selectedMethod === "pix"}
                        label="Pix"
                        onChange={() => setSelectedMethod("pix")}
                    />
                </div>
            </div>
            <div className="flex gap-2">
                <ButtonOutline
                    id="payment-back"
                    onClick={onBack}
                    children="Voltar"
                />
                <ButtonPrimary
                    id="payment-next"
                    onClick={handleNext}
                    children="Continuar"
                />
            </div>
        </div>
    );
}