import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { ButtonPrimary, CategoryModal, ConfirmModal, Input } from "..";
import { useRestaurant } from "../../contexts/RestaurantContext";
import { LoadingPage } from "../../pages/LoadingPage";
import { deleteCategory } from "../../services/categoriesService";
import type { CategoryType } from "../../types";

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
        <section className="flex flex-col gap-4 mt-10">
            <div className="flex gap-2 mb-6 items-stretch">
                {categories.length > 0 && (
                    <div className="flex-1">
                        <Input
                            id="search-category"
                            type="text"
                            label="Buscar categoria"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                )}
                <div className={categories.length > 0 ? "flex items-stretch" : "flex w-full items-stretch"}>
                    <ButtonPrimary
                        id="new-category"
                        className={categories.length > 0 ? "w-40" : ""}
                        onClick={() => {
                            setCategorySelected(null);
                            setIsOpenModalCategory(true);
                        }}
                        children="Nova Categoria"
                    />
                </div>
            </div>
            {categories.length > 0 && (
                <table id="admin-categories-table" className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-700 text-white">
                            <th id="category-name-header" className="p-2 text-left">Nome</th>
                            <th id="category-description-header" className="p-2 text-left">Descrição</th>
                            <th id="category-actions-header" className="p-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.filter(category =>
                            category.name.toLowerCase().includes(search.toLowerCase())
                        ).map((category, idx) => (
                            <tr
                                key={category.id}
                                className={
                                    idx % 2 === 0
                                        ? "bg-gray-50"
                                        : "bg-gray-200"
                                }
                            >

                                <td id={`category-name-${idx}`} className="p-2 text-left">{category.name}</td>
                                <td id={`category-description-${idx}`} className="p-2 text-left">{category.description}</td>
                                <td className="p-2 w-16 align-middle">
                                    <div className="flex items-center justify-center gap-4 h-full">
                                        <FaEdit
                                            id={`edit-category-${idx}`}
                                            type="button"
                                            size={18}
                                            className="text-teal-600 hover:text-teal-800 hover:cursor-pointer"
                                            onClick={() => handleEditCategory(category)}
                                            title="Editar categoria"
                                        />
                                        <FaTrash
                                            id={`delete-category-${idx}`}
                                            type="button"
                                            size={18}
                                            className="text-red-600 hover:text-red-800 hover:cursor-pointer"
                                            onClick={() => handleDeleteCategory(category)}
                                            title="Excluir categoria"
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
        </section>
    );
}