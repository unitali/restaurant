
import { useState } from "react";
import { createRestaurant } from "../migrates/createRestaurant";



export const HomePage = () => {

    const [restaurantName, setRestaurantName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (restaurantName.trim()) {
            createRestaurant(restaurantName.trim());
            setRestaurantName("");
        }
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nome do restaurante"
                    value={restaurantName}
                    onChange={e => setRestaurantName(e.target.value)}
                />
                <button type="submit">Criar Restaurante</button>
            </form>
        </div>
    );
}
