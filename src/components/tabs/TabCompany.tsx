import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ButtonOutline, ButtonPrimary, ImageUpload, InputText, LabelCopy } from "..";
import { useRestaurant } from "../../contexts/RestaurantContext";
import { useImages } from "../../hooks/useImages";
import { useRestaurants as useRestaurantsManager } from "../../hooks/useRestaurants";
import type { CompanyType, ImageState } from "../../types";
import { getShortUrl } from "../../utils/shortUrl";

export function CompanyTab() {
    const { restaurant, refresh, loading: restaurantLoading, restaurantId } = useRestaurant();
    const { updateRestaurant, loading: updateLoading, updateRestaurantCompany } = useRestaurantsManager();
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
                brandName: restaurant.company.brandName,
                legalName: restaurant.company.legalName,
                document: restaurant.company.document,
                address: restaurant.company.address,
                phone: restaurant.company.phone,
                banner: restaurant.company.banner,
                logo: restaurant.company.logo,
            });
        }
    }, [editCompany, restaurant]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!formRestaurant) return;
        const { name, value } = e.target;

        if (name.startsWith("address")) {
            const addressField = name.replace("address", "").replace(/^\w/, c => c.toLowerCase());
            setFormRestaurant({
                ...formRestaurant,
                address: {
                    ...formRestaurant.address,
                    [addressField]: value,
                },
            });
        } else {
            setFormRestaurant({ ...formRestaurant, [name]: value });
        }
    };

    const isChanged =
        editCompany &&
        restaurant?.company &&
        formRestaurant &&
        (
            restaurant.company.brandName !== formRestaurant.brandName ||
            restaurant.company.legalName !== formRestaurant.legalName ||
            restaurant.company.document !== formRestaurant.document ||
            restaurant.company.address.street !== formRestaurant.address.street ||
            restaurant.company.address.city !== formRestaurant.address.city ||
            restaurant.company.address.state !== formRestaurant.address.state ||
            restaurant.company.address.zipCode !== formRestaurant.address.zipCode ||
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
                brandName: formRestaurant?.brandName,
                legalName: formRestaurant?.legalName,
                document: formRestaurant?.document,
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
            await updateRestaurant(restaurantId, { shortUrlMenu: shortUrl });
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
        <section className="flex flex-col w-full mx-auto px-2 justify-center">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col"
            >
                <h2 className="text-xl font-semibold">Dados da Empresa</h2>
                <InputText
                    id="company-legal-name"
                    label="Razão Social / Nome Completo"
                    name="legalName"
                    value={editCompany ? formRestaurant?.legalName : restaurant?.company?.legalName}
                    onChange={handleChange}
                    disabled={!editCompany || updateLoading || restaurantLoading}
                />
                <div className="flex flex-col md:flex-row md:gap-2">
                    <InputText
                        id="company-name"
                        label="Nome Fantasia"
                        name="brandName"
                        required
                        value={editCompany ? formRestaurant?.brandName : restaurant?.company?.brandName}
                        onChange={handleChange}
                        disabled={!editCompany || updateLoading || restaurantLoading}
                    />
                    <InputText
                        id="company-document"
                        label="CNPJ / CPF"
                        name="document"
                        required
                        value={editCompany ? formRestaurant?.document : restaurant?.company?.document}
                        onChange={handleChange}
                        disabled={!editCompany || updateLoading || restaurantLoading}
                    />
                </div>
                <InputText
                    id="company-street"
                    label="Endereço"
                    name="addressStreet"
                    required
                    value={editCompany ? formRestaurant?.address.street : restaurant?.company?.address.street}
                    onChange={handleChange}
                    disabled={!editCompany || updateLoading || restaurantLoading}
                />
                <div className="flex flex-col md:flex-row md:gap-2">
                    <InputText
                        id="company-city"
                        label="Cidade"
                        name="addressCity"
                        required
                        value={editCompany ? formRestaurant?.address.city : restaurant?.company?.address.city}
                        onChange={handleChange}
                        disabled={!editCompany || updateLoading || restaurantLoading}
                        className="flex-1"
                    />
                    <InputText
                        id="company-state"
                        label="Estado"
                        name="addressState"
                        required
                        value={editCompany ? formRestaurant?.address.state : restaurant?.company?.address.state}
                        onChange={handleChange}
                        disabled={!editCompany || updateLoading || restaurantLoading}
                        className="flex-1"
                    />
                    <InputText
                        id="company-zip-code"
                        label="CEP"
                        name="addressZipCode"
                        type="number"
                        required
                        value={editCompany ? formRestaurant?.address.zipCode : restaurant?.company?.address.zipCode}
                        onChange={handleChange}
                        disabled={!editCompany || updateLoading || restaurantLoading}
                        className="flex-1"
                    />
                    <InputText
                        id="company-phone"
                        label="WhatsApp"
                        name="phone"
                        type="tel"
                        required
                        value={editCompany ? formRestaurant?.phone : restaurant?.company?.phone}
                        onChange={handleChange}
                        disabled={!editCompany || updateLoading || restaurantLoading}
                    />
                </div>
                <div className="flex flex-col md:flex-row md:gap-2">
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
                </div>
                <ButtonPrimary
                    id={editCompany ? (isChanged ? "save-company" : "cancel-company") : "edit-company"}
                    type="submit"
                    disabled={updateLoading || restaurantLoading}
                >
                    {buttonText()}
                </ButtonPrimary>
                <div className="pt-3">
                    {restaurant?.shortUrlMenu ? (
                        <LabelCopy
                            id="link-menu"
                            label="Link do Cardapio"
                            name="menuLink"
                            value={restaurant?.shortUrlMenu}
                            disabled={!editCompany || updateLoading || restaurantLoading}
                        />
                    ) : (
                        <ButtonOutline
                            id="create-menu-link"
                            children="Criar Link do Cardápio"
                            onClick={handleCreateShortUrl}
                        />
                    )}
                </div>
            </form>
        </section>
    );
}