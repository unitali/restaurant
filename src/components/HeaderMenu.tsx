import { FaShop, FaShopLock } from "react-icons/fa6";
import { useRestaurant } from "../contexts/RestaurantContext";

export function HeaderMenu() {
    const { restaurant } = useRestaurant();
    return (
        <div className="relative w-full flex flex-col items-center">
            <div className="w-full h-32 rounded mb-4 flex items-center justify-center relative overflow-hidden">
                {restaurant?.company.banner?.url && (
                    <img
                        src={restaurant.company.banner.url}
                        alt="Banner do restaurante"
                        className="absolute inset-0 w-full h-full object-cover rounded"
                    />
                )}
                <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-white bg-opacity-80 rounded-full px-3 py-1 shadow">
                    {restaurant?.company.isOpen ? (
                        <>
                            <FaShop
                                className="text-green-500"
                                size={22}
                                title='Fechar restaurante'
                            />
                            <span className="text-sm font-semibold text-green-500">Aberto</span>
                        </>
                    ) : (
                        <>
                            <FaShopLock
                                className="text-red-500"
                                size={22}
                                title='Abrir restaurante'
                            />
                            <span className="text-sm font-semibold text-red-500">Fechado</span>
                        </>
                    )}
                </div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 z-10">
                <div className="bg-white rounded-full shadow-lg flex items-center justify-center w-32 h-32 border-4 border-teal-500">
                    {restaurant?.company.logo?.url && (
                        <img
                            src={restaurant.company.logo.url}
                            alt="Logo do restaurante"
                            className="w-28 h-28 object-contain rounded-full"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
