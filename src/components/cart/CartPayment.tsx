import { useEffect, useState } from "react";
import { ButtonOutline, ButtonPrimary, RadioButton } from "..";
import { useOrder } from "../../contexts/OrderContext";
import { useRestaurant } from "../../contexts/RestaurantContext";
import type { PaymentMethodsType } from "../../types";


const paymentLabels: Record<string, string> = {
    card: "Cartão",
    cash: "Dinheiro",
    pix: "Pix"
};

export function CartPayment({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    const { restaurant } = useRestaurant();
    const { paymentMethod, setPaymentMethod } = useOrder();
    const activePaymentMethods: PaymentMethodsType[] = (restaurant?.paymentMethods ?? []).filter(pm => pm.enabled);
    const [selectedType, setSelectedType] = useState<PaymentMethodsType["type"] | null>(
        typeof paymentMethod === "object" && paymentMethod !== null
            ? paymentMethod.type
            : (activePaymentMethods[0]?.type ?? null)
    );

    useEffect(() => {
        if (!selectedType && activePaymentMethods.length > 0) {
            setSelectedType(activePaymentMethods[0].type);
        }
    }, [activePaymentMethods, selectedType]);

    const handleNext = () => {
        const selectedPaymentMethod = activePaymentMethods.find(pm => pm.type === selectedType) ?? null;
        setPaymentMethod(selectedPaymentMethod);
        onNext();
    };

    return (
        <div>
            <div className="flex flex-col gap-2">
                {activePaymentMethods.map((pm) => (
                    <RadioButton
                        key={pm.type}
                        name="payment-method"
                        label={paymentLabels[pm.type] ?? pm.type}
                        checked={selectedType === pm.type}
                        onChange={() => setSelectedType(pm.type)}
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
                    disabled={!selectedType}
                />
            </div>
        </div>
    );
}