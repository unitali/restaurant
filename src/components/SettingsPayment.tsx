import { useState } from "react";
import { ButtonPrimary, Switch } from ".";
import { useRestaurant } from "../contexts/RestaurantContext";
import { useRestaurants } from "../hooks/useRestaurants";
import { LoadingPage } from "../pages/LoadingPage";
import type { PaymentMethodsType } from "../types";

export function SettingsPayment() {
    const { restaurantId, refresh, restaurant } = useRestaurant();
    const { updateRestaurant } = useRestaurants();
    const initialPaymentMethods: PaymentMethodsType = {
        card: false,
        cash: false,
        pix: false
    };
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
    const [isChanged, setIsChanged] = useState(false);


    const handleChange = (name: keyof PaymentMethodsType, value: boolean) => {
        setPaymentMethods(prev => ({
            ...prev,
            [name]: value
        }));
        setIsChanged(true);
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
                paymentMethods: {
                    card: paymentMethods.card,
                    cash: paymentMethods.cash,
                    pix: paymentMethods.pix
                }
            });
            setLoading(false);
            setIsEditing(false);
        } else {
            setIsEditing(false);
            setPaymentMethods(initialPaymentMethods);
        }
        refresh();
        setLoading(false);
        setIsEditing(false);
        refresh();
    };

    return (
        <div className="shadow rounded p-2 bg-white max-w-md w-full mt-8">
            {loading && <LoadingPage />}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Configurações de Pagamento</h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex items-center">
                    <Switch
                        id="card"
                        value={restaurant?.paymentMethods?.card ?? false}
                        onChange={(val) => handleChange("card", val)}
                        disabled={!isEditing}
                    />
                    <span className="ml-2">Cartão</span>
                </div>
                <div className="flex items-center">
                    <Switch
                        id="cash"
                        value={restaurant?.paymentMethods?.cash ?? false}
                        onChange={(val) => handleChange("cash", val)}
                        disabled={!isEditing}
                    />
                    <span className="ml-2">Dinheiro</span>
                </div>
                <div className="flex items-center">
                    <Switch
                        id="pix"
                        value={restaurant?.paymentMethods?.pix ?? false}
                        onChange={(val) => handleChange("pix", val)}
                        disabled={!isEditing}
                    />
                    <span className="ml-2">Pix</span>
                </div>

                <ButtonPrimary
                    id="delivery"
                    type="submit"
                >
                    {!isEditing ? "Editar" : isChanged ? "Salvar" : "Cancelar"}
                </ButtonPrimary>
            </form>
        </div>
    );
}