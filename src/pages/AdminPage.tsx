import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategoriesTab, CompanyTab, HeaderAdmin, ProductsTab, SettingsTab } from "../components";
import { RestaurantProvider } from "../contexts/RestaurantContext";
import { webRoutes } from "../routes";
import { LoadingPage } from "./LoadingPage";

export function AdminPage() {
    const [restaurantId, setRestaurantId] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"products" | "categories" | "settings" | "company">("products");

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
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [navigate]);



    return (
        <RestaurantProvider restaurantId={restaurantId!}>
            <HeaderAdmin />
            <main className="flex flex-col items-center bg-gray-50 min-h-screen py-10 md:py-18">
                {loading ? <LoadingPage /> : (
                    <div className="bg-white rounded shadow p-4 w-full max-w-2xl md:max-w-none mx-auto">
                        <h1 id="admin-panel-title" className="text-2xl font-bold mb-4 text-center">Painel Administrativo</h1>
                        {/* Tabs */}
                        <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
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
                            <button
                                id="admin-company-tab"
                                className={`px-4 py-2 font-semibold hover:cursor-pointer ${activeTab === "company" ? "border-b-2 border-teal-600 text-teal-700" : "text-gray-500"}`}
                                onClick={() => setActiveTab("company")}
                            >
                                Empresa
                            </button>
                            <button
                                id="admin-settings-tab"
                                className={`px-4 py-2 font-semibold hover:cursor-pointer ${activeTab === "settings" ? "border-b-2 border-teal-600 text-teal-700" : "text-gray-500"}`}
                                onClick={() => setActiveTab("settings")}
                            >
                                Configurações
                            </button>
                        </div>

                        {/* Conteúdo das Tabs */}
                        <div className="w-full">
                            {activeTab === "products" && (
                                <ProductsTab />
                            )}

                            {activeTab === "categories" && (
                                <CategoriesTab />
                            )}

                            {activeTab === "company" && (
                                <CompanyTab />
                            )}

                            {activeTab === "settings" && (
                                <SettingsTab />
                            )}
                        </div>
                    </div>
                )}
            </main>
        </RestaurantProvider>
    );
}