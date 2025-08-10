import { useState } from "react";
import { toast } from "react-toastify";
import { useRestaurant } from "../../contexts/RestaurantContext";
import { updateSettings } from "../../services/settingsService";
import type { SettingsType } from "../../types";

const defaultSettings: SettingsType = {
    primaryColor: "#2563eb",
    primaryTextColor: "#ffffff",
    secondaryColor: "#fbbf24",
    secondaryTextColor: "#000000",
};

export function Settings() {
    const { restaurantId, restaurant } = useRestaurant();
    const [editSettings, setEditSettings] = useState(false);
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState<SettingsType>(
        restaurant?.settings && Object.values(restaurant.settings).some(Boolean)
            ? restaurant.settings
            : defaultSettings
    );

    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSettingsSave = async () => {
        setLoading(true);
        try {
            await updateSettings(restaurantId, settings);
            setEditSettings(false);
            toast.success("Configurações de cores atualizadas!");
        } catch (error) {
            toast.error("Erro ao salvar configurações.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="shadow p-6 rounded bg-white max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Configurações de Cores</h2>
                {!editSettings ? (
                    <button
                        className="text-blue-600 hover:underline"
                        onClick={() => setEditSettings(true)}
                    >
                        Editar
                    </button>
                ) : (
                    <button
                        className="text-gray-500 hover:underline"
                        onClick={() => {
                            setEditSettings(false);
                        }}
                    >
                        Cancelar
                    </button>
                )}
            </div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    handleSettingsSave();
                }}
                className="flex flex-col gap-3"
            >
                <label className="flex items-center gap-2">
                    <span>Cor Primária:</span>
                    <input
                        type="color"
                        name="primaryColor"
                        value={settings.primaryColor}
                        onChange={handleSettingsChange}
                        disabled={!editSettings}
                    />
                    <input
                        type="text"
                        name="primaryColor"
                        value={settings.primaryColor}
                        onChange={handleSettingsChange}
                        className="border rounded px-2 py-1 w-28"
                        disabled={!editSettings}
                    />
                </label>
                <label className="flex items-center gap-2">
                    <span>Texto Primário:</span>
                    <input
                        type="color"
                        name="primaryTextColor"
                        value={settings.primaryTextColor}
                        onChange={handleSettingsChange}
                        disabled={!editSettings}
                    />
                    <input
                        type="text"
                        name="primaryTextColor"
                        value={settings.primaryTextColor}
                        onChange={handleSettingsChange}
                        className="border rounded px-2 py-1 w-28"
                        disabled={!editSettings}
                    />
                </label>
                <label className="flex items-center gap-2">
                    <span>Cor Secundária:</span>
                    <input
                        type="color"
                        name="secondaryColor"
                        value={settings.secondaryColor}
                        onChange={handleSettingsChange}
                        disabled={!editSettings}
                    />
                    <input
                        type="text"
                        name="secondaryColor"
                        value={settings.secondaryColor}
                        onChange={handleSettingsChange}
                        className="border rounded px-2 py-1 w-28"
                        disabled={!editSettings}
                    />
                </label>
                <label className="flex items-center gap-2">
                    <span>Texto Secundário:</span>
                    <input
                        type="color"
                        name="secondaryTextColor"
                        value={settings.secondaryTextColor}
                        onChange={handleSettingsChange}
                        disabled={!editSettings}
                    />
                    <input
                        type="text"
                        name="secondaryTextColor"
                        value={settings.secondaryTextColor}
                        onChange={handleSettingsChange}
                        className="border rounded px-2 py-1 w-28"
                        disabled={!editSettings}
                    />
                </label>
                {editSettings && (
                    <button
                        type="submit"
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? "Salvando..." : "Salvar"}
                    </button>
                )}
            </form>
        </div>
    );
}
