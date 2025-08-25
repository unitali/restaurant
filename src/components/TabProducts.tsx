import { useState } from "react";
import { toast } from "react-toastify";
import { ButtonPrimary, ConfirmModal, Input, ProductModal, ProductTable, Select } from ".";
import { useRestaurant } from "../contexts/RestaurantContext";
import { useProducts } from "../hooks/useProducts";
import { LoadingPage } from "../pages/LoadingPage";
import type { CategoryType, ProductType } from "../types";

export function ProductsTab() {
    const { restaurant, loading: restaurantLoading, refresh, restaurantId } = useRestaurant();
    const { deleteProduct } = useProducts();
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpenModalProduct, setIsOpenModalProduct] = useState(false);
    const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
    const [productSelected, setProductSelected] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState("all");

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

    const filteredProducts = (() => {
        let result = products;

        if (selectedCategory === "topPick") {
            result = result.filter(product => product.topPick === true);
        } else if (selectedCategory !== "all") {
            result = result.filter(product => product.categoryId === selectedCategory);
        }

        if (search.trim() && result.length > 0) {
            const searchLower = search.trim().toLowerCase();
            result = result.filter(product =>
                product.name?.toLowerCase().includes(searchLower) ||
                product.description?.toLowerCase().includes(searchLower)
            );
        }

        return result;
    })();

    if (restaurantLoading || loading) {
        return <LoadingPage />;
    }

    return (
        <section>
            {categories.length !== 0 ? (
                <div className="flex flex-col gap-4">
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
                                            { value: "all", label: "Todas" },
                                            { value: "topPick", label: "Destaques" },
                                            ...categories.map(category => ({
                                                value: category.id || "",
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
                        <ProductTable
                            products={filteredProducts}
                            selectedCategory={selectedCategory}
                            onEdit={handleEditProduct}
                            onDelete={handleDeleteProduct}
                        />
                    )}

                    {isOpenModalProduct && (
                        <ProductModal
                            id="product-modal"
                            isOpen={isOpenModalProduct}
                            onClose={() => setIsOpenModalProduct(false)}
                            onProductChanged={async () => { refresh(); }}
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
                    <p id="no-category-message" className="text-gray-500">
                        Nenhuma categoria encontrada. Cadastre uma categoria para começar a cadastrar produtos.
                    </p>
                </div>
            )}
        </section>
    );
}