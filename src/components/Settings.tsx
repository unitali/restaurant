import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ButtonPrimary, InputColor } from ".";
import { useRestaurant } from "../contexts/RestaurantContext";
import { updateSettings } from "../services/settingsService";
import type { SettingsType } from "../types";

const defaultSettings: SettingsType = {
    primaryColor: "#2563eb",
    primaryTextColor: "#ffffff",
    secondaryColor: "#fbbf24",
    secondaryTextColor: "#000000",
};

function getValidSettings(settingsFromDb?: Partial<SettingsType>): SettingsType {
    return {
        ...defaultSettings,
        ...(settingsFromDb && Object.keys(settingsFromDb).length > 0 ? settingsFromDb : {}),
    };
}

export function Settings() {
    const { restaurant, refresh, loading: restaurantLoading, restaurantId } = useRestaurant();
    const [editSettings, setEditSettings] = useState(false);
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState<SettingsType>(
        getValidSettings(restaurant?.settings)
    );

    useEffect(() => {
        setSettings(getValidSettings(restaurant?.settings));
    }, [restaurant?.settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const isChanged =
        editSettings &&
        restaurant?.settings &&
        settings &&
        (
            restaurant.settings.primaryColor !== settings.primaryColor ||
            restaurant.settings.primaryTextColor !== settings.primaryTextColor ||
            restaurant.settings.secondaryColor !== settings.secondaryColor ||
            restaurant.settings.secondaryTextColor !== settings.secondaryTextColor
        );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editSettings) {
            setEditSettings(true);
            setSettings(getValidSettings(restaurant?.settings));
            return;
        }
        if (!isChanged) {
            setEditSettings(false);
            setSettings(getValidSettings(restaurant?.settings));
            return;
        }
        setLoading(true);
        try {
            await updateSettings(restaurantId, settings);
            await refresh();
            setEditSettings(false);
            toast.success("Configurações de cores atualizadas!");
        } catch (error) {
            console.error("Erro ao atualizar configurações de cores:", error);
            toast.error("Erro ao atualizar as configurações de cores.");
        } finally {
            setLoading(false);
        }
    };

    const buttonText = () => {
        if (loading || restaurantLoading) return "Carregando...";
        if (editSettings && !isChanged) return "Cancelar";
        if (editSettings) return "Salvar";
        return "Editar";
    };

    return (
        <div className="shadow p-6 rounded bg-white max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Configurações de Cores</h2>
            </div>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3"
            >
                <InputColor
                    label="Cor Primária"
                    id="primary"
                    name="primaryColor"
                    value={settings.primaryColor}
                    onChange={handleChange}
                    required
                    disabled={!editSettings}
                />
                <InputColor
                    label="Texto Primário"
                    id="primary-text"
                    name="primaryTextColor"
                    value={settings.primaryTextColor}
                    onChange={handleChange}
                    required
                    disabled={!editSettings}
                />
                <InputColor
                    label="Cor Secundária"
                    id="secondary-color"
                    name="secondaryColor"
                    value={settings.secondaryColor}
                    onChange={handleChange}
                    required
                    disabled={!editSettings}
                />
                <InputColor
                    label="Texto Secundário"
                    id="secondary-text-color"
                    name="secondaryTextColor"
                    value={settings.secondaryTextColor}
                    onChange={handleChange}
                    required
                    disabled={!editSettings}
                />
                <ButtonPrimary
                    id={editSettings ? (isChanged ? "save-settings" : "cancel-settings") : "edit-settings"}
                    type="submit"
                    disabled={loading || restaurantLoading}
                >
                    {buttonText()}
                </ButtonPrimary>
            </form>
        </div>
    );
}

