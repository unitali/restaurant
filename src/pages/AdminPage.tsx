import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategoriesTab, ProductsTab } from "../components";
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
        <div className="flex flex-col items-center bg-gray-50">
            {loading ? <LoadingPage /> : (
                <div className="bg-white rounded shadow p-40 w-full">
                    <h1 className="text-2xl font-bold mb-4 text-center">Painel Administrativo</h1>

                    {restaurant && (
                        <div className="mb-6 shadow p-4 rounded bg-gray-100 max-w-md mx-auto">
                            <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
                            <p><strong>Endereço:</strong> {restaurant.address}</p>
                            <p><strong>Telefone:</strong> {restaurant.phone}</p>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 border-b border-gray-200">
                        <button
                            className={`px-4 py-2 font-semibold ${activeTab === "products" ? "border-b-2 border-teal-600 text-teal-700" : "text-gray-500"}`}
                            onClick={() => setActiveTab("products")}
                        >
                            Produtos
                        </button>
                        <button
                            className={`px-4 py-2 font-semibold ${activeTab === "categories" ? "border-b-2 border-teal-600 text-teal-700" : "text-gray-500"}`}
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
    );
}