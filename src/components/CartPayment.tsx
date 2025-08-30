import { useEffect, useState } from "react";
import { ButtonOutline, ButtonPrimary, RadioButton } from ".";
import { useOrder } from "../contexts/OrderContext";
import { useRestaurant } from "../contexts/RestaurantContext";


const paymentLabels: Record<string, string> = {
    card: "Cartão",
    cash: "Dinheiro",
    pix: "Pix"
};

export function CartPayment({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    const { restaurant } = useRestaurant();
    const { paymentMethod, setPaymentMethod } = useOrder();
    const activePaymentMethods = (restaurant?.paymentMethods ?? []).filter(pm => pm.enabled);
    const [selectedMethod, setSelectedMethod] = useState<string>(
        typeof paymentMethod === "string"
            ? paymentMethod
            : activePaymentMethods[0]?.type ?? ""
    );

    useEffect(() => {
        if (!selectedMethod && activePaymentMethods.length > 0) {
            setSelectedMethod(activePaymentMethods[0].type);
        }
    }, [activePaymentMethods, selectedMethod]);

    const handleNext = () => {
        const selectedPaymentMethod = activePaymentMethods.find(pm => pm.type === selectedMethod) ?? null;
        setPaymentMethod(selectedPaymentMethod);
        onNext();
    };

    return (
        <div>
            <div className="flex flex-col gap-2">
                {activePaymentMethods.map((pm, index) => (
                    <RadioButton
                        key={index}
                        name="payment-method"
                        label={paymentLabels[pm.type] ?? pm.type}
                        checked={selectedMethod === pm.type}
                        onChange={() => setSelectedMethod(pm.type)}
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
                    disabled={!selectedMethod}
                />
            </div>
        </div>
    );
}