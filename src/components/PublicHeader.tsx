import { FaArrowLeft, FaPlusCircle, FaSignInAlt, FaUtensils } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router";
import { webRoutes } from "../routes";

export function HeaderPublic() {
    const navigate = useNavigate();
    const location = useLocation();
    const isCreateRestaurant = location.pathname.includes(webRoutes.createRestaurant);
    const isLoginPage = location.pathname.includes(webRoutes.login);
    const isHomePage = location.pathname === webRoutes.home;

    return (
        <header className="bg-gray-800 p-4 flex top-0 left-0 w-full z-50 fixed">
            {!isHomePage && (
                <button
                    className="text-white flex flex-row items-center px-4 cursor-pointer"
                    type="button"
                    onClick={() => navigate(webRoutes.home)}
                >
                    <span className="p-2 flex items-center">
                        <FaArrowLeft className="text-white" size={24} />
                    </span>
                    Voltar a Home
                </button>
            )}
            <div className="flex-1" />
            <div className="flex items-center relative justify-end space-x-2">
                {!isCreateRestaurant && (
                    <button
                        className="text-white flex flex-row items-center cursor-pointer"
                        type="button"
                        onClick={() => navigate(webRoutes.createRestaurant)}
                    >
                        <span className="p-2 flex items-center gap-1 relative">
                            <FaUtensils className="text-white" size={24} />
                            <FaPlusCircle
                                className="text-white absolute"
                                size={14}
                                title="Criar Restaurante"
                                style={{ left: 30, top: -2 }}
                            />
                        </span>
                    </button>
                )}
                {!isLoginPage && (
                    <button
                        className="text-white flex flex-row items-center cursor-pointer"
                        type="button"
                        onClick={() => navigate(webRoutes.admin)}
                    >
                        <span className="p-2 flex items-center">
                            <FaSignInAlt className="text-white" size={24} title="Fazer Login" />
                        </span>
                    </button>
                )}
            </div>
        </header>
    );
}
