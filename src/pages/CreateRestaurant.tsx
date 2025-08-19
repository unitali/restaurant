import { useState } from "react";
import { ButtonPrimary, Input } from "../components";
import { HeaderPublic } from "../components/HeaderPublic";
import { useRestaurants } from "../hooks/useRestaurants";
import type { CompanyType, UserType } from "../types";
import { plusDays, today } from "../utils/date";
import { LoadingPage } from "./LoadingPage";

const restaurantInitialState: CompanyType = {
    id: "",
    name: "",
    address: "",
    phone: "",
    createdAt: today(),
    expiredAt: plusDays(today(), 30),
    status: "active",
    logo: null,
    banner: null
};

const userInitialState: UserType = {
    id: "",
    email: "",
    profile: "admin",
    restaurantId: "",
    password: "",
    confirmPassword: "",
    createdAt: new Date(),
};


export function CreateRestaurant() {
    const { createRestaurantWithAdmin, loading } = useRestaurants();
    const [restaurant, setRestaurant] = useState<CompanyType>(restaurantInitialState);
    const [userAdmin, setUserAdmin] = useState<UserType>(userInitialState);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await createRestaurantWithAdmin(
            restaurant,
            userAdmin,
            () => {
                setRestaurant(restaurantInitialState);
                setUserAdmin(userInitialState);
            }
        );
    }
    return (
        <>
            <HeaderPublic />

            <div className="flex justify-center items-center min-h-screen">

                {loading ? <LoadingPage /> : (
                    <div className="w-full max-w-md bg-white p-8 rounded shadow">
                        <h2 id="create-restaurant-title" className="text-xl font-bold m-6">Criar Restaurante e Admin</h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <Input
                                id="restaurant-name"
                                label="Nome do restaurante"
                                value={restaurant.name}
                                onChange={e => setRestaurant({ ...restaurant, name: e.target.value })}
                                required
                            />
                            <Input
                                id="restaurant-address"
                                label="Endereço"
                                value={restaurant.address}
                                onChange={e => setRestaurant({ ...restaurant, address: e.target.value })}
                                required
                            />
                            <Input
                                id="restaurant-phone"
                                type="tel"
                                label="Telefone"
                                value={restaurant.phone}
                                onChange={e => setRestaurant({ ...restaurant, phone: e.target.value })}
                                required
                            />
                            <Input
                                id="admin-email"
                                type="email"
                                label="E-mail do admin"
                                value={userAdmin.email}
                                onChange={e => setUserAdmin({ ...userAdmin, email: e.target.value })}
                                required
                            />
                            <Input
                                id="admin-password"
                                type="password"
                                label="Senha do admin"
                                value={userAdmin.password}
                                onChange={e => setUserAdmin({ ...userAdmin, password: e.target.value })}
                                required
                            />
                            <Input
                                id="admin-confirm-password"
                                type="password"
                                label="Confirmar Senha do admin"
                                value={userAdmin.confirmPassword}
                                onChange={e => setUserAdmin({ ...userAdmin, confirmPassword: e.target.value })}
                                required
                            />
                            <ButtonPrimary
                                id="create-restaurant-button"
                                className="w-full"
                                type="submit"
                                children="Iniciar Período de Teste"
                            />
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}