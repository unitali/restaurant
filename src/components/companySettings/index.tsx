import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ButtonPrimary, Input } from "..";
import { updateRestaurant } from "../../services/restaurantsService";
import type { CompanyType } from "../../types";
import { useRestaurant } from "../../contexts/RestaurantContext";

export function CompanySettings() {
    const { restaurant, refresh, loading: restaurantLoading, restaurantId } = useRestaurant();
    const [editCompany, setEditCompany] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formRestaurant, setFormRestaurant] = useState<CompanyType | null>(null);

    useEffect(() => {
        if (editCompany && restaurant?.company) {
            setFormRestaurant({
                name: restaurant.company.name,
                address: restaurant.company.address,
                phone: restaurant.company.phone,
            });
        }
    }, [editCompany, restaurant]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!formRestaurant) return;
        setFormRestaurant({ ...formRestaurant, [e.target.name]: e.target.value });
    };

    const isChanged =
        editCompany &&
        restaurant?.company &&
        formRestaurant &&
        (
            restaurant.company.name !== formRestaurant.name ||
            restaurant.company.address !== formRestaurant.address ||
            restaurant.company.phone !== formRestaurant.phone
        );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editCompany) {
            setEditCompany(true);
            setFormRestaurant(restaurant?.company ?? null);
            return;
        }
        if (!isChanged) {
            setEditCompany(false);
            setFormRestaurant(restaurant?.company ?? null);
            return;
        }
        setLoading(true);
        try {
            if (formRestaurant) {
                await updateRestaurant(restaurantId, formRestaurant);
                await refresh();
                setEditCompany(false);
                toast.success("Dados da empresa atualizados com sucesso!");
            }
        } catch (error) {
            toast.error("Erro ao atualizar os dados da empresa.");
        } finally {
            setLoading(false);
        }
    };

    const buttonText = () => {
        if (loading || restaurantLoading) return "Carregando...";
        if (editCompany && !isChanged) return "Cancelar";
        if (editCompany) return "Salvar";
        return "Editar";
    };

    return (
        <section className="shadow p-6 rounded bg-white max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Dados da Empresa</h2>
            </div>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3"
            >
                <Input
                    id="company-name"
                    label="Nome Fantasia"
                    name="name"
                    value={editCompany ? formRestaurant?.name || "" : restaurant?.company?.name || ""}
                    onChange={handleChange}
                    disabled={!editCompany || loading || restaurantLoading}
                />
                <Input
                    id="company-address"
                    label="Endereço"
                    name="address"
                    value={editCompany ? formRestaurant?.address || "" : restaurant?.company?.address || ""}
                    onChange={handleChange}
                    disabled={!editCompany || loading || restaurantLoading}
                />
                <Input
                    id="company-phone"
                    label="WhatsApp"
                    name="phone"
                    value={editCompany ? formRestaurant?.phone || "" : restaurant?.company?.phone || ""}
                    onChange={handleChange}
                    disabled={!editCompany || loading || restaurantLoading}
                />
                <ButtonPrimary
                    id={editCompany ? (isChanged ? "save-company" : "cancel-company") : "edit-company"}
                    type="submit"
                    disabled={loading || restaurantLoading}
                >
                    {buttonText()}
                </ButtonPrimary>
            </form>
        </section>
    );
}