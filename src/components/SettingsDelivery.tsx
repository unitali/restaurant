import { useState, useEffect } from "react";
import { ButtonPrimary, InputText, Switch } from ".";
import { useRestaurant } from "../contexts/RestaurantContext";
import { useRestaurants } from "../hooks/useRestaurants";
import { LoadingPage } from "../pages/LoadingPage";
import { formatCurrencyBRL } from "../utils/currency";

export function SettingsDelivery() {
    const { restaurant, restaurantId, refresh } = useRestaurant();
    const { updateRestaurant } = useRestaurants();
    const [loading, setLoading] = useState(false);

    const initialDeliveryEnabled = !!restaurant?.delivery?.enabled;
    const initialTakeoutEnabled = !!restaurant?.delivery?.takeout;
    const taxfeesRegistered =
        restaurant?.delivery?.tax?.map(d => ({
            distance: d.maxDistance || 0,
            price: d.price || 0,
        })) || [];

    const [taxfees, setTaxfees] = useState<{ distance: number; price: number }[]>(taxfeesRegistered);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeliveryEnabled, setIsDeliveryEnabled] = useState(initialDeliveryEnabled);
    const [isTakeoutEnabled, setIsTakeoutEnabled] = useState(initialTakeoutEnabled);

    const initialTaxfee = restaurant?.delivery?.tax?.[0] || { maxDistance: "", price: "" };

    const [newTaxfee, setNewTaxfee] = useState({
        distance: initialTaxfee.maxDistance ? String(initialTaxfee.maxDistance) : "",
        price: initialTaxfee.price ? String(Math.round(Number(initialTaxfee.price) * 100)) : ""
    });

    useEffect(() => {
        const tax = restaurant?.delivery?.tax?.[0];
        setNewTaxfee({
            distance: tax?.maxDistance ? String(tax.maxDistance) : "",
            price: tax?.price ? String(Math.round(tax.price * 100)) : ""
        });
    }, [restaurant]);

    const isChanged =
        isDeliveryEnabled !== initialDeliveryEnabled ||
        isTakeoutEnabled !== initialTakeoutEnabled ||
        JSON.stringify(taxfees) !== JSON.stringify(taxfeesRegistered) ||
        newTaxfee.distance !== "" ||
        newTaxfee.price !== "";

    // const handleAddTaxfee = () => {
    //     const distance = Number(newTaxfee.distance);
    //     const price = Number(newTaxfee.price.replace(/\D/g, "")) / 100;
    //     if (!distance || !price) return;
    //     setTaxfees(prev => [...prev, { distance, price }]);
    //     setNewTaxfee({ distance: "", price: "" });
    // };

    // const handleRemoveTaxfee = (index: number) => {
    //     setTaxfees(prev => prev.filter((_, i) => i !== index));
    // };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewTaxfee(nt => ({
            ...nt,
            distance: name === "deliveryDistance" ? value : nt.distance,
            price: name === "deliveryPrice" ? value.replace(/\D/g, "") : nt.price
        }));
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
                delivery: isDeliveryEnabled
                    ? {
                        enabled: isDeliveryEnabled,
                        takeout: isTakeoutEnabled,
                        tax: [{
                            price: Number(newTaxfee.price) / 100,
                            maxDistance: Number(newTaxfee.distance)
                        }]
                    }
                    : {
                        enabled: isDeliveryEnabled,
                        takeout: isTakeoutEnabled,
                        tax: []
                    }
            });
            setLoading(false);
            setIsEditing(false);
        } else {
            setIsEditing(false);
            setIsDeliveryEnabled(initialDeliveryEnabled);
            setIsTakeoutEnabled(initialTakeoutEnabled);
            setTaxfees(taxfeesRegistered);
            setNewTaxfee({ distance: "", price: "" });
        }
        refresh();
    };

    return (
        <div className="shadow rounded p-2 bg-white max-w-md w-full">
            {loading && <LoadingPage />}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Configurações de Entrega</h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex items-center">
                    <Switch
                        id="takeout"
                        value={isTakeoutEnabled}
                        onChange={setIsTakeoutEnabled}
                        disabled={!isEditing}
                    />
                    <span className="ml-2">Retirada</span>
                </div>
                <div className="flex items-center">
                    <Switch
                        id="delivery"
                        value={isDeliveryEnabled}
                        onChange={setIsDeliveryEnabled}
                        disabled={!isEditing}
                    />
                    <span className="ml-2">Entrega</span>
                </div>
                {isDeliveryEnabled && (
                    <div>
                        <div className="flex flex-row items-center mb-2 gap-2">
                            <div className="flex flex-col flex-1">
                                <InputText
                                    type="number"
                                    id="delivery-distance-input"
                                    label="Distância (KM)"
                                    name="deliveryDistance"
                                    value={newTaxfee.distance}
                                    required={taxfees.length > 0 ? false : true}
                                    onChange={handleChange}
                                    className="w-full"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="flex flex-col flex-1">
                                <InputText
                                    id="delivery-price-input"
                                    label="Preço"
                                    name="deliveryPrice"
                                    value={newTaxfee.price ? formatCurrencyBRL(Number(newTaxfee.price) / 100) : "R$ 0,00"}
                                    onChange={handleChange}
                                    required={taxfees.length > 0 ? false : true}
                                    className="w-full"
                                    disabled={!isEditing}
                                />
                            </div>
                            {/* Add Delivery Tax Fee Button */}
                            {/* <div className="flex items-center justify-end h-full">
                                <ButtonPrimaryPlus
                                    id="add-delivery-taxfee"
                                    onClick={handleAddTaxfee}
                                    disabled={!isEditing}
                                />
                            </div> */}
                        </div>
                        {/* {taxfees.length > 0 && (
                            <ul className="mt-2">
                                {taxfees
                                    .slice()
                                    .sort((a, b) => a.distance - b.distance)
                                    .map((t, i) => (
                                        <li key={i} className="grid grid-cols-[1fr_1fr_auto] items-center gap-4 py-1">
                                            <span>Distância: {t.distance} KM</span>
                                            <span>Preço: {formatCurrencyBRL(t.price)}</span>
                                            <FaTrash
                                                className="cursor-pointer text-red-500 justify-self-end"
                                                onClick={() => isEditing && handleRemoveTaxfee(i)}
                                                style={{ opacity: isEditing ? 1 : 0.5, pointerEvents: isEditing ? "auto" : "none" }}
                                            />
                                        </li>
                                    ))}
                            </ul>
                        )} */}
                    </div>
                )}
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
