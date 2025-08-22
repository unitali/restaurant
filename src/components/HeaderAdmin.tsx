import { FaSignOutAlt, FaUtensils } from 'react-icons/fa';
import { FaShop, FaShopLock } from "react-icons/fa6";

import { useState } from 'react';
import { useRestaurant } from '../contexts/RestaurantContext';
import { useAuth } from '../hooks/useAuth';
import { useRestaurants } from '../hooks/useRestaurants';
import { LoadingPage } from '../pages/LoadingPage';
import { PopUpConfirmOpen } from './PopUpConfirmOpen';

export function HeaderAdmin() {
    const { restaurantId, restaurant, refresh, loading: restaurantLoading } = useRestaurant();
    const { updateRestaurantCompany, loading: updateLoading } = useRestaurants();
    const { logout } = useAuth();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const isOpen = restaurant?.company.isOpen ?? false;

    const handleMenuPage = () => {
        if (restaurantId) {
            window.open(`/menu/${restaurantId}`, "_blank");
        }
    };

    const handleOpenCloseClick = () => {
        setIsConfirmOpen(true);
    };

    const handleOpenAndClose = async () => {
        setIsConfirmOpen(false);
        await updateRestaurantCompany(restaurantId, { isOpen: !isOpen });
        refresh();
    };

    if (restaurantLoading || updateLoading || !restaurant) return <LoadingPage />;

    return (
        <header className="bg-gray-800 w-full max-w-2xl md:max-w-none mx-auto px-2 py-2 md:p-4 flex justify-between items-center top-0 left-0 z-50 fixed">
            <div className="text-white text-base md:text-lg font-bold truncate">
                {restaurant?.company.brandName}
            </div>
            <div
                className={`flex items-center space-x-3 md:space-x-4 px-3 py-2 rounded cursor-pointer transition-all select-none ${isOpen ? 'bg-green-100' : 'bg-red-100'}`}
                style={{ minWidth: 120 }}
                onClick={handleOpenCloseClick}
                role="button"
                tabIndex={0}
                aria-pressed={isOpen}
            >
                {isOpen ? (
                    <>
                        <FaShop
                            className="text-green-500"
                            size={24}
                            title='Fechar restaurante'
                        />
                        <span className="text-sm font-semibold text-green-500">Aberto</span>
                    </>
                ) : (
                    <>
                        <FaShopLock
                            className="text-red-500"
                            size={24}
                            title='Abrir restaurante'
                        />
                        <span className="text-sm font-semibold text-red-500">Fechado</span>
                    </>
                )}
            </div>
            <div className="flex items-center space-x-3 md:space-x-4">
                <FaUtensils
                    onClick={handleMenuPage}
                    className="text-white cursor-pointer"
                    size={20}
                    title='Ir para o Cardápio'
                />
                <FaSignOutAlt
                    onClick={logout}
                    className="text-white cursor-pointer"
                    size={20}
                    title='Sair'
                />
            </div>

            {isConfirmOpen && (
                <PopUpConfirmOpen
                    id="confirm-modal"
                    isOpen={isConfirmOpen}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={handleOpenAndClose}
                    title={isOpen ? 'Fechar restaurante' : 'Abrir restaurante'}
                    message={isOpen ? 'Tem certeza que deseja fechar o restaurante?' : 'Tem certeza que deseja abrir o restaurante?'}
                />
            )}
        </header>
    );
}
