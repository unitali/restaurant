import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchRestaurantById, updateRestaurant } from "../../services/restaurantsService";
import type { RestaurantType } from "../../types";

interface CompanySettingsProps {
    restaurantId: string;
}

export function CompanySettings({ restaurantId }: CompanySettingsProps) {
    const [editCompany, setEditCompany] = useState(false);
    const [savingCompany, setSavingCompany] = useState(false);
    const [restaurant, setRestaurant] = useState<RestaurantType | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const restaurantData = await fetchRestaurantById(restaurantId);
                if (restaurantData) {
                    setRestaurant(restaurantData);
                }
            } catch (error) {
                console.error("Error fetching restaurant data:", error);
            }
        }
        fetchData();
    }, [restaurantId]);

    // Company handlers
    const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!restaurant) return;
        setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
    };

    const handleCompanySave = async () => {
        setSavingCompany(true);
        try {
            if (restaurant) {
                await updateRestaurant(restaurantId, restaurant);
                setEditCompany(false);
                toast.success("Dados da empresa atualizados!");
            }
        } catch (error) {
            toast.error("Erro ao salvar dados da empresa.");
        } finally {
            setSavingCompany(false);
        }
    };

    return (
        <div className="shadow p-6 rounded bg-white max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Dados da Empresa</h2>
                {!editCompany ? (
                    <button
                        className="text-blue-600 hover:underline"
                        onClick={() => setEditCompany(true)}
                    >
                        Editar
                    </button>
                ) : (
                    <button
                        className="text-gray-500 hover:underline"
                        onClick={() => {
                            setEditCompany(false);
                            setRestaurant(restaurant);
                        }}
                    >
                        Cancelar
                    </button>
                )}
            </div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    handleCompanySave();
                }}
                className="flex flex-col gap-3"
            >
                <label>
                    <span className="font-semibold">Nome:</span>
                    <input
                        type="text"
                        name="name"
                        value={restaurant?.name || ""}
                        onChange={handleCompanyChange}
                        className="border rounded px-2 py-1 w-full"
                        disabled={!editCompany}
                    />
                </label>
                <label>
                    <span className="font-semibold">Endereço:</span>
                    <input
                        type="text"
                        name="address"
                        value={restaurant?.address || ""}
                        onChange={handleCompanyChange}
                        className="border rounded px-2 py-1 w-full"
                        disabled={!editCompany}
                    />
                </label>
                <label>
                    <span className="font-semibold">Telefone:</span>
                    <input
                        type="text"
                        name="phone"
                        value={restaurant?.phone || ""}
                        onChange={handleCompanyChange}
                        className="border rounded px-2 py-1 w-full"
                        disabled={!editCompany}
                    />
                </label>
                {editCompany && (
                    <button
                        type="submit"
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
                        disabled={savingCompany}
                    >
                        {savingCompany ? "Salvando..." : "Salvar"}
                    </button>
                )}
            </form>
        </div>
    );
}