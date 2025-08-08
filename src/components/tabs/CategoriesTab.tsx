import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { ButtonPrimary, CategoryModal, ConfirmModal, Input } from "..";
import { LoadingPage } from "../../pages/LoadingPage";
import { deleteCategory, fetchCategoriesByRestaurantId } from "../../services/categoriesService";
import type { CategoryType } from "../../types";

interface CategoriesTabProps {
    restaurantId: string;
}

export function CategoriesTab({ ...props }: CategoriesTabProps) {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [isOpenModalCategory, setIsOpenModalCategory] = useState(false);
    const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [categorySelected, setCategorySelected] = useState<CategoryType | null>(null);

    useEffect(() => {
        setLoading(true);
        async function loadCategories() {
            const restaurantId = localStorage.getItem("restaurantId")?.toString();
            if (!restaurantId) {
                toast.error("Restaurante não encontrado");
                return;
            }
            const fetchedCategories = await fetchCategoriesByRestaurantId(restaurantId);
            setCategories(fetchedCategories);
        }
        loadCategories();
        setLoading(false);
    }, []);


    const reloadCategories = async () => {
        if (props.restaurantId) {
            const updatedCategories = await fetchCategoriesByRestaurantId(props.restaurantId);
            setCategories(updatedCategories);
        }
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
        if (!categorySelected || !props.restaurantId) return;
        try {
            await deleteCategory(props.restaurantId, categorySelected.id);
            await reloadCategories();
            toast.success("Categoria excluída com sucesso!");
        } catch (error) {
            toast.error("Erro ao excluir a categoria");
            console.error("Erro ao excluir a categoria:", error);
        } finally {
            setIsOpenModalConfirm(false);
            setCategorySelected(null);
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 mt-10">
            {loading && <LoadingPage />}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <Input
                    type="text"
                    label="Buscar categoria"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <div className="flex w-full md:w-1/3 gap-2">

                    {categories.length > 0 && (
                        <ButtonPrimary
                            onClick={() => {
                                setCategorySelected(null);
                                setIsOpenModalCategory(true);
                            }}
                        >
                            Nova Categoria
                        </ButtonPrimary>
                    )}
                </div>
            </div>
            {categories.length === 0 ? (
                <p className="text-gray-500 text-center">Nenhuma categoria cadastrada</p>
            ) : (
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-700 text-white">
                            <th className="p-2 text-left">Nome</th>
                            <th className="p-2 text-left">Descrição</th>
                            <th className="p-2">Ações</th>
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

                                <td className="p-2 text-left">{category.name}</td>
                                <td className="p-2 text-left">{category.description}</td>
                                <td className="p-2 w-16 align-middle">
                                    <div className="flex items-center justify-center gap-4 h-full">
                                        <FaEdit
                                            type="button"
                                            size={18}
                                            className="text-teal-600 hover:text-teal-800 hover:cursor-pointer"
                                            onClick={() => handleEditCategory(category)}
                                            title="Editar categoria"
                                        />
                                        <FaTrash
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
                    restaurantId={props.restaurantId}
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