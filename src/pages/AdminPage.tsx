import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategoriesTab, HeaderAdmin, ProductsTab } from "../components";
import { webRoutes } from "../routes";
import { fetchRestaurantById } from "../services/restaurantsService";
import type { RestaurantType } from "../types";
import { LoadingPage } from "./LoadingPage";


export function AdminPage() {
    const [restaurant, setRestaurant] = useState<RestaurantType | null>(null);
    const [restaurantId, setRestaurantId] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"products" | "categories">("products");

    const navigate = useNavigate();

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const restaurantId = localStorage.getItem("restaurantId");
                if (!restaurantId) {
                    navigate(webRoutes.login, { replace: true });
                    return;
                }
                setRestaurantId(restaurantId);

                const restaurant = await fetchRestaurantById(restaurantId);
                if (!restaurant) {
                    navigate(webRoutes.login, { replace: true });
                    return;
                }
                setRestaurant(restaurant);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [navigate]);



    return (
        <>
            <HeaderAdmin />

            <div className="flex flex-col items-center bg-gray-50">
                {loading ? <LoadingPage /> : (
                    <div className="bg-white rounded shadow p-40 w-full">
                        <h1 id="admin-panel-title" className="text-2xl font-bold mb-4 text-center">Painel Administrativo</h1>

                        {restaurant && (
                            <div className="mb-6 shadow p-4 rounded bg-gray-100 max-w-md mx-auto">
                                <h2 id="admin-restaurant-name" className="text-xl font-semibold mb-2">{restaurant.name}</h2>
                                <div id="admin-restaurant-address" className="mb-1">
                                    <strong>Endereço:</strong> {restaurant.address}
                                </div>
                                <div id="admin-restaurant-phone">
                                    <strong>Telefone:</strong> {restaurant.phone}
                                </div>
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="flex gap-2 mb-6 border-b border-gray-200">
                            <button
                                id="admin-products-tab"
                                className={`px-4 py-2 font-semibold hover:cursor-pointer ${activeTab === "products" ? "border-b-2 border-teal-600 text-teal-700" : "text-gray-500"}`}
                                onClick={() => setActiveTab("products")}
                            >
                                Produtos
                            </button>
                            <button
                                id="admin-categories-tab"
                                className={`px-4 py-2 font-semibold hover:cursor-pointer ${activeTab === "categories" ? "border-b-2 border-teal-600 text-teal-700" : "text-gray-500"}`}
                                onClick={() => setActiveTab("categories")}
                            >
                                Categorias
                            </button>
                        </div>

                        {/* Conteúdo das Tabs */}
                        {activeTab === "products" && (
                            <ProductsTab
                                restaurantId={restaurantId!}
                            />
                        )}

                        {activeTab === "categories" && (
                            <CategoriesTab
                                restaurantId={restaurantId!}
                            />
                        )}
                    </div>
                )}
            </div>
        </>
    );
}