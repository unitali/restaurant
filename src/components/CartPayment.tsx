import { useState } from "react";
import { ButtonOutline, ButtonPrimary, RadioButton } from ".";
import { useOrder } from "../contexts/OrderContext";
import type { PaymentMethodsType } from "../types";
import { paymentMethods } from "../utils/paymentsMethods";


export function CartPayment({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    const { paymentMethod, setPaymentMethod } = useOrder();
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethodsType | null>(paymentMethod);

    const handleNext = () => {
        setPaymentMethod(selectedMethod);
        onNext();
    };

    return (
        <div>
            <div className="flex flex-col gap-2">
                {paymentMethods.map(option => (
                    <RadioButton
                        key={option.id}
                        name="payment-method"
                        label={option.label}
                        checked={selectedMethod === option.id as unknown as PaymentMethodsType}
                        onChange={() => setSelectedMethod(option.id as unknown as PaymentMethodsType)}
                    />
                ))}
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