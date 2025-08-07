import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ButtonPrimary, CategoryModal, Input, ProductModal } from "../components";
import { webRoutes } from "../routes";
import { fetchCategoriesByRestaurantId } from "../services/categoriesService";
import { fetchProductsByRestaurantId } from "../services/productsService";
import { fetchRestaurantById } from "../services/restaurantsService";
import type { CategoryType, ProductType, RestaurantType } from "../types";
import { LoadingPage } from "./LoadingPage";


export function AdminPage() {
    const [restaurant, setRestaurant] = useState<RestaurantType | null>(null);
    const [restaurantId, setRestaurantId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [products, setProducts] = useState<ProductType[]>([]);
    const [search, setSearch] = useState("");
    const [isOpenModalCategory, setIsOpenModalCategory] = useState(false);
    const [isOpenModalProduct, setIsOpenModalProduct] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

        async function loadData() {
            try {
                const id = localStorage.getItem("restaurantId");
                setRestaurantId(id);
                if (!id) {
                    navigate(webRoutes.login, { replace: true });
                    return;
                }
                const restaurant = await fetchRestaurantById(id);
                if (!restaurant) {
                    navigate(webRoutes.login, { replace: true });
                    return;
                }
                setRestaurant(restaurant);
                setCategories(await fetchCategoriesByRestaurantId(id));
                setProducts(await fetchProductsByRestaurantId(id));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [navigate]);

    const reloadCategories = async () => {
        if (restaurantId) {
            const updatedCategories = await fetchCategoriesByRestaurantId(restaurantId);
            setCategories(updatedCategories);
        }
    };

    const reloadProducts = async () => {
        if (restaurantId) {
            const updatedProducts = await fetchProductsByRestaurantId(restaurantId);
            setProducts(updatedProducts);
        }
    };

    return (
        <div className="flex flex-col items-center  bg-gray-50">
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
                    <h2 className="text-xl font-semibold mb-4">Produtos</h2>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <Input
                            type="text"
                            label="Buscar produto"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <div className="flex w-full md:w-1/3 gap-2">
                            <ButtonPrimary
                                onClick={() => {
                                    setIsOpenModalCategory(true);
                                }}
                            >
                                Nova Categoria
                            </ButtonPrimary>
                            {categories.length > 0 && (
                                <ButtonPrimary
                                    onClick={() => {
                                        setIsOpenModalProduct(true);
                                    }}
                                >
                                    Novo Produto
                                </ButtonPrimary>
                            )}
                        </div>
                    </div>
                    {categories.length === 0 || products.length === 0 ? (
                        <p className="text-gray-500 text-center">Nenhum produto encontrado</p>
                    ) : (
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border">Imagem</th>
                                    <th className="p-2 border">Nome</th>
                                    <th className="p-2 border">Descrição</th>
                                    <th className="p-2 border">Preço</th>
                                    <th className="p-2 border">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id} className="text-center">
                                        <td className="p-2 border">
                                            {product.image?.url ? (
                                                <img src={product.image.url} alt={product.name} className="h-12 w-12 object-cover rounded" />
                                            ) : (
                                                <span className="text-gray-400">Sem imagem</span>
                                            )}
                                        </td>
                                        <td className="p-2 border">{product.name}</td>
                                        <td className="p-2 border">{product.description}</td>
                                        <td className="p-2 border">€ {product.price}</td>
                                        <td className="p-2 border flex justify-center gap-2">
                                            <button className="text-teal-600 hover:text-teal-800" title="Editar">
                                                <FaEdit />
                                            </button>
                                            <button className="text-red-600 hover:text-red-800" title="Deletar">
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {isOpenModalCategory && (
                <CategoryModal
                    id="category-modal"
                    isOpen={isOpenModalCategory}
                    onClose={() => setIsOpenModalCategory(false)}
                    restaurantId={restaurantId || ""}
                    onCategoryChanged={reloadCategories}
                />
            )}
            {isOpenModalProduct && (
                <ProductModal
                    id="product-modal"
                    isOpen={isOpenModalProduct}
                    onClose={() => setIsOpenModalProduct(false)}
                    restaurantId={restaurantId || ""}
                    categories={categories}
                    onProductChanged={reloadProducts}
                />
            )}
        </div>
    );
}