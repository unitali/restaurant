import { useRestaurant } from "../contexts/RestaurantContext";



export function BannerMenu() {
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
