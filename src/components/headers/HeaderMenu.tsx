import { useState } from "react";
import { FaShop, FaShopLock } from "react-icons/fa6";
import { useRestaurant } from "../../contexts/RestaurantContext";
import { daysLabels, daysOfWeek } from "../../utils/date";


export function HeaderMenu() {
    const { restaurant } = useRestaurant();
    const [showHours, setShowHours] = useState(false);

    const openingDays = restaurant?.openingHours || {};

    const handleShowHours = () => {
        setShowHours((prev) => !prev);
    };

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
                <div className="absolute bottom-4 right-4 flex items-center space-x-2 z-10">
                    {/* Botão Aberto/Fechado */}
                    <div
                        className={`bg-opacity-80 rounded-full p-3 shadow cursor-pointer flex items-center ${restaurant?.isOpen ? 'bg-green-100' : 'bg-red-100'}`}
                        onClick={handleShowHours}
                        id="open-hours-btn"
                    >
                        {restaurant?.isOpen ? (
                            <>
                                <FaShop
                                    className="text-green-500"
                                    size={22}
                                    title='Ver horários de abertura'
                                />
                                <span className="text-sm  mx-2 font-semibold text-green-500">Aberto</span>
                            </>
                        ) : (
                            <>
                                <FaShopLock
                                    className="text-red-500"
                                    size={22}
                                    title='Ver horários de abertura'
                                />
                                <span className="text-sm mx-2 font-semibold text-red-500">Fechado</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {showHours && (
                <div
                    className="absolute right-4"
                    style={{
                        top: 'calc(8rem + 1rem)',
                        zIndex: 50,
                    }}
                >
                    <div className="bg-gray-100 bg-opacity-95 rounded shadow-lg p-4 w-64 max-h-64 overflow-y-auto">
                        <h3 className="text-base font-semibold mb-2">Horários de Funcionamento</h3>
                        <ul className="text-sm">
                            {daysOfWeek.map(day => {
                                const info = openingDays[day];
                                return (
                                    <li key={day} className="mb-1">
                                        <span className="font-medium">{daysLabels[day] || day}:</span>{" "}
                                        {info?.open
                                            ? (info.hours || "Horário não informado")
                                            : <span className="text-red-500">Fechado</span>
                                        }
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            )}
            <div className="absolute left-1/2 -translate-x-1/2 z-10">
                <div className="bg-white rounded-full shadow-lg flex items-center justify-center w-32 h-32 border-4 border-unitali-blue-600 relative overflow-hidden">
                    {restaurant?.company.logo?.url && (
                        <img
                            src={restaurant.company.logo.url}
                            alt="Logo do restaurante"
                            className="w-28 h-28 object-contain rounded-full relative z-10"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
