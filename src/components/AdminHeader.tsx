import { FaSignOutAlt, FaUtensils } from 'react-icons/fa';
import { useRestaurant } from '../contexts/RestaurantContext';
import { useAuth } from '../hooks/useAuth';

export function HeaderAdmin() {
    const { restaurantId, restaurant } = useRestaurant();
    const { logout } = useAuth();

    const handleMenuPage = () => {
        if (restaurantId) {
            window.open(`/menu/${restaurantId}`, "_blank");
        }
    };

    return (
        <header className="bg-gray-800 w-full max-w-2xl md:max-w-none mx-auto px-2 py-2 md:p-4 flex justify-between items-center top-0 left-0 z-50 fixed">
            <div className="text-white text-base md:text-lg font-bold truncate">
                {restaurant?.company.name}
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
        </header>
    );
}
