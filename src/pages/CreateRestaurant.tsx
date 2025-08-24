import { useState } from "react";
import { ButtonPrimary, Input } from "../components";
import { HeaderPublic } from "../components/HeaderPublic";
import { useRestaurants } from "../hooks/useRestaurants";
import type { CompanyType, UserType } from "../types";
import { LoadingPage } from "./LoadingPage";

const restaurantInitialState: CompanyType = {
    id: "",
    legalName: "",
    brandName: "",
    document: "",
    address: {
        street: "",
        number: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: ""
    },
    phone: "",
    logo: null,
    banner: null,
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

    // Validação simples de senha
    const isPasswordValid = userAdmin.password.length >= 6;
    const isPasswordMatch = userAdmin.password === userAdmin.confirmPassword;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!isPasswordValid || !isPasswordMatch) return;
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
                                value={restaurant.brandName}
                                onChange={e => setRestaurant({ ...restaurant, brandName: e.target.value })}
                                required
                            />
                            <Input
                                id="restaurant-address-street"
                                label="Endereço"
                                value={restaurant.address.street}
                                onChange={e => setRestaurant({ ...restaurant, address: { ...restaurant.address, street: e.target.value } })}
                                required
                            />
                            <Input
                                id="restaurant-address-number"
                                label="Número"
                                value={restaurant.address.number}
                                onChange={e => setRestaurant({ ...restaurant, address: { ...restaurant.address, number: e.target.value } })}
                                required
                            />
                            <Input
                                id="restaurant-address-neighborhood"
                                label="Bairro"
                                value={restaurant.address.neighborhood}
                                onChange={e => setRestaurant({ ...restaurant, address: { ...restaurant.address, neighborhood: e.target.value } })}
                                required
                            />
                            <Input
                                id="restaurant-address-city"
                                label="Cidade"
                                value={restaurant.address.city}
                                onChange={e => setRestaurant({ ...restaurant, address: { ...restaurant.address, city: e.target.value } })}
                                required
                            />
                            <Input
                                id="restaurant-address-state"
                                label="Estado"
                                value={restaurant.address.state}
                                onChange={e => setRestaurant({ ...restaurant, address: { ...restaurant.address, state: e.target.value } })}
                                required
                            />
                            <Input
                                id="restaurant-address-zip-code"
                                label="CEP"
                                value={restaurant.address.zipCode}
                                onChange={e => setRestaurant({ ...restaurant, address: { ...restaurant.address, zipCode: e.target.value } })}
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
                                minLength={6}
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
                                disabled={!isPasswordValid || !isPasswordMatch}
                                children="Iniciar Período de Teste"
                            />
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}