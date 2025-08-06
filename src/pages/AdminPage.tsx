import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { webRoutes } from "../routes";
import { fetchRestaurantById } from "../services/restaurantsService";
import type { RestaurantType } from "../types";
import { LoadingPage } from "./LoadingPage";


export function AdminPage() {
    const restaurantId = localStorage.getItem("restaurantId");
    const [restaurant, setRestaurant] = useState<RestaurantType | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            if (!restaurantId) {
                navigate(webRoutes.login, { replace: true });
                return;
            }
            fetchRestaurantById(restaurantId).then(data => {
                setRestaurant(data as RestaurantType);
                setLoading(false);
            }).catch(error => {
                console.error("Error fetching restaurant:", error);
                navigate(webRoutes.login, { replace: true });
            });
        } catch (error) {
            console.error("Error in AdminPage:", error);
            navigate(webRoutes.login, { replace: true });
        } finally {
            setLoading(false);
        }

    }, [restaurantId, navigate]);

    return (
        <div>
            {loading ? LoadingPage() : (
                <>
                    {restaurant && <p>Nome do Restaurante: {restaurant.name}</p>}
                </>
            )}
        </div>
    );
};
