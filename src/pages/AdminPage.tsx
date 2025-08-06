import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ButtonPrimary, Input } from "../components";
import { db } from "../firebase";
import { webRoutes } from "../routes";
import { fetchRestaurantById } from "../services/restaurantsService";
import type { CategoryType, ProductType, RestaurantType } from "../types";
import { LoadingPage } from "./LoadingPage";
import { CategoryModal } from "../components/modal/CategoryModal";
import { ProductModal } from "../components/modal/ProductModal";


export function AdminPage() {
    const [restaurant, setRestaurant] = useState<RestaurantType | null>(null);
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
                const restaurantId = localStorage.getItem("restaurantId");
                if (!restaurantId) {
                    navigate(webRoutes.login, { replace: true });
                    return;
                }
                const response = await fetchRestaurantById(restaurantId);
                if (!response) {
                    navigate(webRoutes.login, { replace: true });
                    return;
                }
                setRestaurant(response as RestaurantType);

                const categoriesSnap = await getDocs(collection(db, `restaurants/${restaurantId}/categories`));
                const allCategories: CategoryType[] = [];
                let allProducts: ProductType[] = [];
                for (const categoryDoc of categoriesSnap.docs) {
                    const categoryData = categoryDoc.data();
                    const productsArr = Array.isArray(categoryData.products) ? categoryData.products : [];
                    allCategories.push({
                        id: categoryDoc.id,
                        name: categoryData.name || '',
                        description: categoryData.description || '',
                        products: productsArr,
                    });
                    allProducts = allProducts.concat(
                        productsArr.map((prod: ProductType) => ({
                            ...prod,
                            categoryName: categoryData.name,
                        }))
                    );
                }
                setCategories(allCategories);
                setProducts(allProducts);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [navigate]);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

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
                                onClick={() => setIsOpenModalCategory(true)}
                            >
                                Nova Categoria
                            </ButtonPrimary>
                            {categories.length > 0 && (
                                <ButtonPrimary
                                    onClick={() => setIsOpenModalProduct(true)}
                                >
                                    Novo Produto
                                </ButtonPrimary>
                            )}
                        </div>
                    </div>
                    {(categories.length === 0 || products.length === 0) ? (
                        <div className="text-center text-gray-500 py-12">
                            Nenhum produto e/ou categoria registrado.
                        </div>
                    ) : (
                        filteredProducts.length === 0 ? (
                            <p className="text-gray-500">Nenhum produto encontrado.</p>
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
                                    {filteredProducts.map(product => (
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
                        )
                    )}
                </div>
            )}

            {isOpenModalCategory && (
                <CategoryModal
                    isOpen={isOpenModalCategory}
                    onClose={() => setIsOpenModalCategory(false)}
                    restaurantId={restaurant?.id || ""}
                />
            )}
            {isOpenModalProduct && (
                <ProductModal
                    isOpen={isOpenModalProduct}
                    onClose={() => setIsOpenModalProduct(false)}
                />
            )}
        </div>
    );
}
