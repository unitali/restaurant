import { FaSignOutAlt } from 'react-icons/fa';
import { RiRestaurantFill } from "react-icons/ri";
import { handleLogout } from '../../services/loginServices';
import { useRestaurant } from '../../contexts/RestaurantContext';



export function HeaderAdmin() {
    const { restaurantId } = useRestaurant();

    const handleMenuPage = () => {
        if (restaurantId) {
            window.open(`/menu/${restaurantId}`, "_blank");
        }
    };

    return (
        <header className="bg-gray-800 p-4 flex justify-between items-center top-0 left-0 w-full z-50 fixed">
            <div className="text-white text-lg font-bold">
                Bem-vindo ao Painel Administrativo
            </div>

            <div className="flex items-center space-x-4">
                   <RiRestaurantFill
                    onClick={handleMenuPage}
                    className="text-white cursor-pointer"
                    size={24}
                    title='Ir para o Cardápio'
                />
                <FaSignOutAlt
                    onClick={handleLogout}
                    className="text-white cursor-pointer"
                    size={24}
                    title='Sair'
                />
            </div>
        </header>
    );
}
