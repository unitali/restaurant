import { useState } from "react";
import { FaEdit, FaFileImage, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { ButtonPrimary, ConfirmModal, Input, Select, ProductModal } from "..";
import { useRestaurant } from "../../contexts/RestaurantContext";
import { LoadingPage } from "../../pages/LoadingPage";
import { deleteProduct } from "../../services/productsService";
import type { CategoryType, ProductType } from "../../types";
import { formatCurrencyBRL } from "../../utils/currency";

export function ProductsTab() {
    const { restaurant, loading: restaurantLoading, refresh, restaurantId } = useRestaurant();
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpenModalProduct, setIsOpenModalProduct] = useState(false);
    const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
    const [productSelected, setProductSelected] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState("");

    const products: ProductType[] = Array.isArray(restaurant?.products) ? restaurant.products : [];
    const categories: CategoryType[] = Array.isArray(restaurant?.categories) ? restaurant.categories : [];

    const confirmDelete = async () => {
        setLoading(true);
        if (!productSelected || !restaurantId) return;
        try {
            await deleteProduct(restaurantId, productSelected);
            await refresh();
            toast.success("Produto excluído com sucesso!");
        } catch (error) {
            toast.error("Erro ao excluir o produto");
            console.error("Erro ao excluir o produto:", error);
        } finally {
            setIsOpenModalConfirm(false);
            setProductSelected(null);
            setLoading(false);
        }
    };

    const handleEditProduct = (productId: string) => {
        setProductSelected(productId);
        setIsOpenModalProduct(true);
    };

    const handleDeleteProduct = (productId: string) => {
        setProductSelected(productId);
        setIsOpenModalConfirm(true);
    };

    if (restaurantLoading || loading) {
        return <LoadingPage />;
    }

    return (
        <>
            {categories.length !== 0 ? (
                <div className="flex flex-col gap-4 mt-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        {products.length !== 0 && (
                            <>
                                <Input
                                    id="search-product"
                                    type="text"
                                    label="Buscar produto"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                <div className="flex w-full md:w-1/3 gap-2">
                                    <Select
                                        id="category-select"
                                        label="Buscar produtos por categoria"
                                        name="categoryId"
                                        value={selectedCategory}
                                        onChange={e => setSelectedCategory(e.target.value)}
                                        required={false}
                                        options={[
                                            { value: "", label: "Todas" },
                                            ...categories.map(category => ({
                                                value: category.id ?? "",
                                                label: category.name,
                                            }))
                                        ]}
                                    />
                                </div>
                            </>
                        )}
                        <div className={`flex gap-2 ${products.length === 0 ? "w-full" : "md:w-1/3"}`}>
                            <ButtonPrimary
                                id="new-product"
                                onClick={() => {
                                    setProductSelected(null);
                                    setIsOpenModalProduct(true);
                                }}
                            >
                                Novo Produto
                            </ButtonPrimary>
                        </div>
                    </div>
                    {products.length === 0 ? (
                        <p id="no-products-message" className="text-gray-500 text-center">Nenhum produto encontrado.</p>
                    ) : (
                        <table id="admin-products-table" className="w-full text-sm">
                            {products.filter(product =>
                                product.name.toLowerCase().includes(search.toLowerCase()) &&
                                (selectedCategory === "" || product.categoryId === selectedCategory)
                            ).length > 0 && (
                                    <thead>
                                        <tr className="bg-gray-700 text-white">
                                            <th id="product-image" className="p-4" style={{ width: 32, height: 32 }}></th>
                                            <th id="product-name" className="p-2 text-center">Nome</th>
                                            <th id="product-description" className="p-2 text-left">Descrição</th>
                                            <th id="product-price" className="p-2 text-center">Preço</th>
                                            <th id="product-actions" className="p-2">Ações</th>
                                        </tr>
                                    </thead>
                                )}
                            <tbody>
                                {products
                                    .filter(product =>
                                        product.name.toLowerCase().includes(search.toLowerCase()) &&
                                        (selectedCategory === "" || product.categoryId === selectedCategory)
                                    )
                                    .map((product, idx) => (
                                        <tr
                                            id={`product-${idx}`}
                                            key={product.id}
                                            className={
                                                idx % 2 === 0
                                                    ? "bg-gray-50"
                                                    : "bg-gray-200"
                                            }
                                        >
                                            <td id={`product-image-${idx}`}
                                                className="p-2" style={{ width: 80 }}>
                                                {product.image?.url ? (
                                                    <img
                                                        src={product.image.url}
                                                        alt={product.name}
                                                        className="w-full object-cover rounded"
                                                    />
                                                ) : (
                                                    <FaFileImage size={30}
                                                        className="w-full object-cover rounded text-gray-400"
                                                    />
                                                )}
                                            </td>
                                            <td id={`product-name-${idx}`} className="p-2 text-left">{product.name}</td>
                                            <td id={`product-description-${idx}`} className="p-2 text-left">{product.description}</td>
                                            <td id={`product-price-${idx}`} className="p-2 w-32 text-center font-bold">{formatCurrencyBRL(product.price)}</td>
                                            <td id={`product-actions-${idx}`} className="p-2 w-16 align-middle">
                                                <div className="flex items-center justify-center gap-4 h-full">
                                                    <FaEdit
                                                        id={`product-edit-${idx}`}
                                                        type="button"
                                                        size={18}
                                                        className="text-teal-600 hover:text-teal-800 hover:cursor-pointer"
                                                        onClick={() => handleEditProduct(product.id!)}
                                                        title="Editar produto"
                                                    />
                                                    <FaTrash
                                                        id={`product-delete-${idx}`}
                                                        type="button"
                                                        size={18}
                                                        className="text-red-600 hover:text-red-800 hover:cursor-pointer"
                                                        onClick={() => handleDeleteProduct(product.id!)}
                                                        title="Excluir produto"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    )}

                    {isOpenModalProduct && (
                        <ProductModal
                            id="product-modal"
                            isOpen={isOpenModalProduct}
                            onClose={() => setIsOpenModalProduct(false)}
                            restaurantId={restaurantId}
                            categories={categories}
                            onProductChanged={refresh}
                            productId={productSelected}
                        />
                    )}

                    {isOpenModalConfirm && (
                        <ConfirmModal
                            id="confirm-delete-modal"
                            isOpen={isOpenModalConfirm}
                            message={`Tem certeza que deseja excluir o produto ${products.find(p => p.id === productSelected)?.name || ""}?`}
                            onCancel={() => setIsOpenModalConfirm(false)}
                            onConfirm={confirmDelete}
                            onClose={() => setIsOpenModalConfirm(false)}
                            loading={loading}
                        />
                    )}
                </div>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p id="no-category-message" className="text-gray-500">Nenhuma categoria encontrada. Cadastre uma categoria para começar a cadastrar produtos.</p>
                </div>
            )}
        </>
    );
}