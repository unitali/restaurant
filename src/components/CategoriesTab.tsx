import { useState } from "react";
import { toast } from "react-toastify";
import { ButtonPrimary, CategoryModal, CategoryTable, ConfirmModal, Input } from ".";
import { useRestaurant } from "../contexts/RestaurantContext";
import { LoadingPage } from "../pages/LoadingPage";
import { deleteCategory } from "../services/categoriesService";
import type { CategoryType } from "../types";

export function CategoriesTab() {
    const { restaurant, loading: restaurantLoading, refresh, restaurantId } = useRestaurant();
    const [isOpenModalCategory, setIsOpenModalCategory] = useState(false);
    const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [categorySelected, setCategorySelected] = useState<CategoryType | null>(null);

    const categories: CategoryType[] = Array.isArray(restaurant?.categories) ? restaurant.categories : [];

    const reloadCategories = async () => {
        setLoading(true);
        await refresh();
        setLoading(false);
    };

    const handleEditCategory = (category: CategoryType) => {
        setCategorySelected(category);
        setIsOpenModalCategory(true);
    };

    const handleDeleteCategory = (category: CategoryType) => {
        setCategorySelected(category);
        setIsOpenModalConfirm(true);
    };

    const confirmDelete = async () => {
        setLoading(true);
        if (!categorySelected) return;
        try {
            await deleteCategory(restaurantId, categorySelected.id || "");
            await reloadCategories();
            toast.success("Categoria removida com sucesso!");
        } catch (error) {
            toast.error("Erro ao remover a categoria");
            console.error("Erro ao remover a categoria:", error);
        } finally {
            setIsOpenModalConfirm(false);
            setCategorySelected(null);
            setLoading(false);
        }
    };

    if (restaurantLoading || loading) {
        return <LoadingPage />;
    }

    return (
        <div className="flex flex-col gap-2 items-center">
            <div className="w-full max-w-2xl md:max-w-none mx-auto">
                <div className="mb-2 md:mb-4 flex flex-col md:flex-row gap-2">
                    {categories.length > 0 && (
                        <Input
                            id="search-category"
                            type="text"
                            label="Buscar categoria"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full"
                        />
                    )}
                    <ButtonPrimary
                        id="new-category"
                        className="md:w-xs"
                        onClick={() => {
                            setCategorySelected(null);
                            setIsOpenModalCategory(true);
                        }}
                        children="Nova Categoria"
                    />
                </div>
                <div className="flex w-full items-stretch mb-4">
                </div>
            </div>
            {categories.length > 0 && (
                <CategoryTable
                    categories={categories}
                    search={search}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteCategory}
                />
            )}

            {/* Modal de Categoria */}
            {isOpenModalCategory && (
                <CategoryModal
                    id="category-modal"
                    isOpen={isOpenModalCategory}
                    onClose={() => setIsOpenModalCategory(false)}
                    restaurantId={restaurantId}
                    onCategoryChanged={reloadCategories}
                    category={categorySelected ?? null}
                />
            )}

            {isOpenModalConfirm && (
                <ConfirmModal
                    id="confirm-delete-modal"
                    isOpen={isOpenModalConfirm}
                    message={`Tem certeza que deseja excluir a categoria ${categories.find(c => c.id === categorySelected?.id)?.name || ""}?`}
                    onCancel={() => setIsOpenModalConfirm(false)}
                    onConfirm={confirmDelete}
                    onClose={() => setIsOpenModalConfirm(false)}
                    loading={loading}
                />
            )}
        </div>
    );
}