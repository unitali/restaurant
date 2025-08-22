import { doc, updateDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../config/firebase";
import { useRestaurant } from "../contexts/RestaurantContext";
import type { SettingsType } from "../types";

export function useSettings() {
    const [settings, setSettings] = useState<SettingsType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const { restaurantId } = useRestaurant();

    const updateSettings = useCallback(async (newSettings: Partial<SettingsType>) => {
        if (!restaurantId) {
            setError(new Error("ID do restaurante não fornecido."));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const restaurantRef = doc(db, "restaurants", restaurantId);
            await updateDoc(restaurantRef, {
                settings: newSettings
            });

            setSettings(prevSettings => ({ ...prevSettings, ...newSettings } as SettingsType));
            toast.success("Configurações salvas com sucesso!");

        } catch (err) {
            console.error("Erro ao atualizar configurações:", err);
            setError(err instanceof Error ? err : new Error("Ocorreu um erro desconhecido."));
            toast.error("Não foi possível salvar as configurações.");
        } finally {
            setLoading(false);
        }
    }, []);

    return { settings, loading, error, updateSettings };
}