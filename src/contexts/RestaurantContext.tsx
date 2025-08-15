import { createContext, useCallback, useContext, useEffect } from "react";
import { useRestaurants } from "../hooks/useRestaurants"; // Importe o hook completo
import type { RestaurantType } from "../types";

interface RestaurantContextType {
    restaurant: RestaurantType | null;
    loading: boolean;
    refresh: () => void;
    restaurantId: string;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ restaurantId, children }: { restaurantId: string, children: React.ReactNode }) {
    const {
        currentRestaurant,
        loading,
        fetchRestaurantById
    } = useRestaurants();

    const fetchAndSetData = useCallback(() => {
        if (restaurantId) {
            fetchRestaurantById(restaurantId);
        }
    }, [restaurantId, fetchRestaurantById]);

    useEffect(() => {
        fetchAndSetData();
    }, [fetchAndSetData]);

    const value = {
        restaurant: currentRestaurant,
        loading,
        refresh: fetchAndSetData,
        restaurantId,
    };

    return (
        <RestaurantContext.Provider value={value}>
            {children}
        </RestaurantContext.Provider>
    );
}

export function useRestaurant() {
    const ctx = useContext(RestaurantContext);
    if (!ctx) throw new Error("useRestaurant deve ser usado dentro de um RestaurantProvider");
    return ctx;
}