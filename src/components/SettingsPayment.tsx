import { useEffect, useState } from "react";
import { ButtonPrimary, Switch } from ".";
import { useRestaurant } from "../contexts/RestaurantContext";
import { useRestaurants } from "../hooks/useRestaurants";
import { LoadingPage } from "../pages/LoadingPage";
import type { PaymentMethodsType } from "../types";

const paymentLabels: Record<string, string> = {
    card: "Cartão",
    cash: "Dinheiro",
    pix: "Pix"
};

export function SettingsPayment() {
    const { restaurantId, refresh, restaurant } = useRestaurant();
    const { updateRestaurant } = useRestaurants();

    // Inicializa como array de métodos
    const initialPaymentMethods: PaymentMethodsType[] = [
        { type: "card", enabled: false },
        { type: "cash", enabled: false },
        { type: "pix", enabled: false }
    ];

    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodsType[]>(initialPaymentMethods);
    const [isChanged, setIsChanged] = useState(false);


    // Carrega métodos do restaurante ao abrir
    useEffect(() => {
        if (restaurant?.paymentMethods && Array.isArray(restaurant.paymentMethods)) {
            setPaymentMethods(restaurant.paymentMethods);
        } else {
            setPaymentMethods(initialPaymentMethods);
        }
    }, [restaurant]);

    // Detecta alterações
    useEffect(() => {
        if (!restaurant?.paymentMethods) {
            setIsChanged(false);
            return;
        }
        setIsChanged(
            JSON.stringify(paymentMethods) !== JSON.stringify(restaurant.paymentMethods)
        );
    }, [paymentMethods, restaurant]);

    // Altera o estado de um método
    const handleSwitch = (type: string, value: boolean) => {
        setPaymentMethods(prev =>
            prev.map(pm =>
                pm.type === type ? { ...pm, enabled: value } : pm
            )
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEditing) {
            setIsEditing(true);
            return;
        }
        if (isChanged) {
            setLoading(true);
            await updateRestaurant(restaurantId, {
                paymentMethods: paymentMethods
            });
            setLoading(false);
            setIsEditing(false);
            setIsChanged(false);
            refresh();
        } else {
            setIsEditing(false);
            setPaymentMethods(
                Array.isArray(restaurant?.paymentMethods)
                    ? restaurant.paymentMethods
                    : initialPaymentMethods
            );
        }
    };

    { loading && <LoadingPage /> }

    return (
        <div className="shadow rounded p-2 bg-white max-w-md w-full mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Configurações de Pagamento</h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {paymentMethods.map(pm => (
                    <div key={pm.type} className="flex items-center">
                        <Switch
                            id={pm.type}
                            value={pm.enabled}
                            onChange={val => handleSwitch(pm.type, val)}
                            disabled={!isEditing}
                        />
                        <span className="ml-2">{paymentLabels[pm.type]}</span>
                    </div>
                ))}

                <ButtonPrimary
                    id="delivery"
                    type="submit"
                    disabled={loading || (isEditing && !isChanged)}
                >
                    {!isEditing ? "Editar" : isChanged ? "Salvar" : "Cancelar"}
                </ButtonPrimary>
            </form>
        </div>
    );
}