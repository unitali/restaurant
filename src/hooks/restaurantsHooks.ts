import { useEffect, useState } from "react";
import { fetchRestaurants } from "../services/restaurantsService";
import type { Restaurant } from "../types/restaurantsTypes";

export const useRestaurants = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    useEffect(() => {
        fetchRestaurants().then(setRestaurants);
    }, []);

    return restaurants;
};
