import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ButtonOutline, ButtonPrimary, ImageUpload, Input, LabelCopy } from ".";
import { useRestaurant } from "../contexts/RestaurantContext";
import { useImages } from "../hooks/useImages";
import { useRestaurants as useRestaurantsManager } from "../hooks/useRestaurants";
import type { CompanyType, ImageState } from "../types";
import { getShortUrl } from "../utils/shortUrl";

export function CompanySettings() {
    const { restaurant, refresh, loading: restaurantLoading, restaurantId } = useRestaurant();
    const { updateRestaurantCompany, loading: updateLoading } = useRestaurantsManager();
    const { updateImage } = useImages();

    const [editCompany, setEditCompany] = useState(false);
    const [formRestaurant, setFormRestaurant] = useState<CompanyType | null>(null);
    const [bannerImageState, setBannerImageState] = useState<ImageState>({
        file: null,
        removed: false,
        dirty: false,
        previewUrl: null,
    });
    const [logoImageState, setLogoImageState] = useState<ImageState>({
        file: null,
        removed: false,
        dirty: false,
        previewUrl: null,
    });

    useEffect(() => {
        if (editCompany && restaurant?.company) {
            setFormRestaurant({
                name: restaurant.company.name,
                address: restaurant.company.address,
                phone: restaurant.company.phone,
                banner: restaurant.company.banner,
                logo: restaurant.company.logo,
            } as CompanyType);
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
            restaurant.company.phone !== formRestaurant.phone ||
            bannerImageState.dirty ||
            logoImageState.dirty
        );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editCompany) {
            setEditCompany(true);
            setFormRestaurant(restaurant?.company ?? null);
            return;
        }
        if (!(isChanged || bannerImageState.dirty || logoImageState.dirty)) {
            setEditCompany(false);
            setFormRestaurant(restaurant?.company ?? null);
            return;
        }

        try {
            let updatedCompany: Partial<CompanyType> = {
                name: formRestaurant?.name,
                address: formRestaurant?.address,
                phone: formRestaurant?.phone,
            };

            if (bannerImageState.dirty) {
                if (bannerImageState.file) {
                    const bannerImage = await updateImage({
                        file: bannerImageState.file,
                        oldImagePath: restaurant?.company.banner?.path,
                        restaurantId,
                    });
                    updatedCompany.banner = bannerImage ?? null;
                } else if (bannerImageState.removed) {
                    updatedCompany.banner = null;
                }
            }

            if (logoImageState.dirty) {
                if (logoImageState.file) {
                    const logoImage = await updateImage({
                        file: logoImageState.file,
                        oldImagePath: restaurant?.company.logo?.path,
                        restaurantId,
                    });
                    updatedCompany.logo = logoImage ?? null;
                } else if (logoImageState.removed) {
                    updatedCompany.logo = null;
                }
            }

            (Object.keys(updatedCompany) as (keyof CompanyType)[]).forEach(key => {
                if (updatedCompany[key] === undefined) {
                    delete updatedCompany[key];
                }
            });

            await updateRestaurantCompany(restaurantId, updatedCompany);
            await refresh();
            setEditCompany(false);
        } catch (error) {
            console.error("Erro ao atualizar os dados da empresa:", error);
        }
    };

    const handleCreateShortUrl = async () => {
        if (!restaurant) return;
        try {
            const shortUrl = await getShortUrl(restaurantId);
            await updateRestaurantCompany(restaurantId, { shortUrlMenu: shortUrl });
            refresh();
            toast.success("Link do cardápio criado com sucesso!");
        } catch (error) {
            console.error("Erro ao criar link do cardápio:", error);
            toast.error("Erro ao criar link do cardápio.");
        }
    };

    const buttonText = () => {
        if (updateLoading || restaurantLoading) return "Carregando...";
        if (editCompany && !(isChanged || bannerImageState.dirty || logoImageState.dirty)) return "Cancelar";
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
                    required
                    value={editCompany ? formRestaurant?.name : restaurant?.company?.name}
                    onChange={handleChange}
                    disabled={!editCompany || updateLoading || restaurantLoading}
                />
                <Input
                    id="company-address"
                    label="Endereço"
                    name="address"
                    required
                    value={editCompany ? formRestaurant?.address : restaurant?.company?.address}
                    onChange={handleChange}
                    disabled={!editCompany || updateLoading || restaurantLoading}
                />
                <Input
                    id="company-phone"
                    label="WhatsApp"
                    name="phone"
                    required
                    value={editCompany ? formRestaurant?.phone : restaurant?.company?.phone}
                    onChange={handleChange}
                    disabled={!editCompany || updateLoading || restaurantLoading}
                />
                <ImageUpload
                    id="banner-image"
                    label="Banner da Empresa"
                    required={false}
                    initialUrl={restaurant?.company.banner?.url}
                    onStateChange={setBannerImageState}
                    disabled={!editCompany || updateLoading || restaurantLoading}
                />
                <ImageUpload
                    id="logo-image"
                    label="Logo da Empresa"
                    required={false}
                    initialUrl={restaurant?.company.logo?.url || null}
                    onStateChange={setLogoImageState}
                    disabled={!editCompany || updateLoading || restaurantLoading}
                />
                <ButtonPrimary
                    id={editCompany ? (isChanged ? "save-company" : "cancel-company") : "edit-company"}
                    type="submit"
                    disabled={updateLoading || restaurantLoading}
                >
                    {buttonText()}
                </ButtonPrimary>
                {restaurant?.company?.shortUrlMenu ? (
                    <LabelCopy
                        id="link-menu"
                        label="Link do Cardapio"
                        name="menuLink"
                        value={restaurant?.company?.shortUrlMenu}
                        disabled={!editCompany || updateLoading || restaurantLoading}
                    />
                ) : (
                    <ButtonOutline
                        id="create-menu-link"
                        children="Criar Link do Cardápio"
                        onClick={handleCreateShortUrl}
                    />
                )}
            </form>
        </section>
    );
}