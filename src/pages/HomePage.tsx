
import { useState } from "react";
import { createRestaurant } from "../migrates/createRestaurant";
import type { Restaurant } from "../types/restaurantsTypes";



export const HomePage = () => {

    const [restaurantName, setRestaurantName] = useState<Restaurant | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (restaurantName) {
            createRestaurant(restaurantName);
            setRestaurantName(null);
        }
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nome do restaurante"
                    value={restaurantName?.name || ""}
                    onChange={e => setRestaurantName(prevState => ({ ...prevState, name: e.target.value } as Restaurant))}
                />
                <input
                    type="text"
                    placeholder="Endereço"
                    value={restaurantName?.address || ""}
                    onChange={e => setRestaurantName(prevState => ({ ...prevState, address: e.target.value } as Restaurant))}
                />
                <input
                    type="text"
                    placeholder="Telefone"
                    value={restaurantName?.phone || ""}
                    onChange={e => setRestaurantName(prevState => ({ ...prevState, phone: e.target.value } as Restaurant))}
                />
                <button type="submit">Criar Restaurante</button>
            </form>
        </div>
    );
}
