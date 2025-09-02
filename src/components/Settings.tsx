import { useMemo, useState } from "react";
import { ButtonPrimary, InputColor } from ".";
import { useRestaurant } from "../contexts/RestaurantContext";
import { useSettings } from "../hooks/useSettings";
import type { SettingsType } from "../types";


const defaultSettings: SettingsType = {
    primaryColor: "#2563eb",
    primaryTextColor: "#ffffff",
    secondaryColor: "#fbbf24",
    secondaryTextColor: "#000000",
};

function getValidSettings(settingsFromDb?: Partial<SettingsType> | null): SettingsType {
    return {
        ...defaultSettings,
        ...(settingsFromDb && Object.keys(settingsFromDb).length > 0 ? settingsFromDb : {}),
    };
}

export function Settings() {
    const { restaurantId, refresh, loading: restaurantLoading, restaurant } = useRestaurant();
    const {
        loading: settingsLoading,
        updateSettings
    } = useSettings();

    const [isEditing, setIsEditing] = useState(false);
    const [formState, setFormState] = useState<SettingsType>(defaultSettings);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };
    const isChanged = useMemo(() => {
        if (!restaurant?.settings || !formState) return false;
        const original = getValidSettings(restaurant.settings);
        return (
            original.primaryColor !== formState.primaryColor ||
            original.primaryTextColor !== formState.primaryTextColor ||
            original.secondaryColor !== formState.secondaryColor ||
            original.secondaryTextColor !== formState.secondaryTextColor
        );
    }, [formState, restaurant]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isEditing) {
            setIsEditing(true);
            return;
        }
        if (!isChanged) {
            setIsEditing(false);
            setFormState(getValidSettings(restaurant?.settings));
            return;
        }
        if (restaurantId) {
            await updateSettings(formState);
            await refresh();
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormState(getValidSettings(restaurant?.settings));
    };

    const totalLoading = settingsLoading || restaurantLoading;

    const buttonText = () => {
        if (totalLoading) return "Carregando...";
        if (isEditing && !isChanged) return "Cancelar";
        if (isEditing) return "Salvar";
        return "Editar Cores";
    };

    return (
        <div className="shadow p-6 rounded bg-white max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Configurações de Cores</h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <InputColor
                    label="Cor Primária"
                    id="primary"
                    name="primaryColor"
                    value={formState.primaryColor}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
                <InputColor
                    label="Texto Primário"
                    id="primary-text"
                    name="primaryTextColor"
                    value={formState.primaryTextColor}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
                <InputColor
                    label="Cor Secundária"
                    id="secondary-color"
                    name="secondaryColor"
                    value={formState.secondaryColor}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
                <InputColor
                    label="Texto Secundário"
                    id="secondary-text-color"
                    name="secondaryTextColor"
                    value={formState.secondaryTextColor}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
                <div className="flex gap-2 mt-2">
                    {isEditing && (
                        <ButtonPrimary
                            id="cancel-settings"
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-500 hover:bg-gray-600 flex-1"
                            disabled={totalLoading}
                        >
                            Cancelar
                        </ButtonPrimary>
                    )}
                    <ButtonPrimary
                        id={isEditing ? (isChanged ? "save-settings" : "cancel-settings") : "edit-settings"}
                        type="submit"
                        className="flex-1"
                        disabled={totalLoading}
                    >
                        {buttonText()}
                    </ButtonPrimary>
                </div>
            </form>
        </div>
    );
}

