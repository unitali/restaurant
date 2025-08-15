import { createContext, useContext, useEffect, useState } from "react";
import { fetchRestaurantById } from "../hooks/restaurantsService";
import type { RestaurantType } from "../types";

interface RestaurantContextType {
    restaurant: RestaurantType | null;
    loading: boolean;
    refresh: () => Promise<void>;
    restaurantId: string;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ restaurantId, children }: { restaurantId: string, children: React.ReactNode }) {
    const [restaurant, setRestaurant] = useState<RestaurantType | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchRestaurant = async () => {
        setLoading(true);
        const data = await fetchRestaurantById(restaurantId);
        setRestaurant(data as RestaurantType);
        setLoading(false);
    };

    useEffect(() => {
        if (restaurantId) fetchRestaurant();
    }, [restaurantId]);

    return (
        <RestaurantContext.Provider value={{ restaurant, loading, refresh: fetchRestaurant, restaurantId }}>
            {children}
        </RestaurantContext.Provider>
    );
}

export function useRestaurant() {
    const ctx = useContext(RestaurantContext);
    if (!ctx) throw new Error("useRestaurant must be used within a RestaurantProvider");
    return ctx;
}