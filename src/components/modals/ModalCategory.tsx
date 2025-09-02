import { useEffect, useState } from "react";
import { ButtonPrimary, InputText, Modal, TextArea, type ModalProps } from "..";
import { useRestaurant } from "../../contexts/RestaurantContext";
import { useCategories } from "../../hooks/useCategories";
import { LoadingPage } from "../../pages/LoadingPage";
import type { CategoryType } from "../../types";

interface CategoryModalProps extends ModalProps {
    restaurantId: string;
    onCategoryChanged?: () => Promise<void>;
    category?: CategoryType | null;
}
const initialCategoryState: CategoryType = {
    id: "",
    name: "",
    description: "",
};

export function CategoryModal({ ...props }: CategoryModalProps) {
    const { addCategory, updateCategory } = useCategories();
    const [category, setCategory] = useState<CategoryType>(initialCategoryState);
    const [loading, setLoading] = useState(false);
    const { refresh } = useRestaurant();

    useEffect(() => {
        if (props.isOpen) {
            if (props.category) {
                setCategory({
                    id: props.category.id,
                    name: props.category.name,
                    description: props.category.description,
                });
            } else {
                setCategory(initialCategoryState);
            }
        }
    }, [props.category, props.isOpen]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setCategory(prev => {
            if (!prev) return prev;
            let updatedValue: string = value;
            return { ...prev, [name]: updatedValue };
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        try {
            if (props.category) {
                let newCategory = {
                    id: category.id,
                    name: category.name,
                    description: category.description,
                };
                await updateCategory(props.restaurantId, newCategory);
                setCategory(newCategory);
                props.onClose();
            } else if (category) {
                await addCategory(props.restaurantId, category);
                setCategory(initialCategoryState);
            } else {
                throw new Error("Categoria inválida");
            }
            if (props.onCategoryChanged) {
                await props.onCategoryChanged();
            }
        } catch (error) {
            console.error("Erro ao salvar categoria:", error);
        } finally {
            setLoading(false);
            refresh();
        }
    };

    return (
        <Modal
            id="category-modal"
            isOpen={props.isOpen}
            onClose={() => { props.onClose() }}
        >
            {loading ? <LoadingPage /> : (
                <div className="p-4">
                    <h2 id="category-modal-title" className="text-lg font-semibold mb-4">
                        {props.category ? "Editar Categoria" : "Criar Categoria"}
                    </h2>
                    <form id="category-form" onSubmit={handleSubmit}>
                        <InputText
                            id="category-name"
                            type="text"
                            label="Nome da Categoria"
                            name="name"
                            value={category?.name ?? ""}
                            onChange={handleChange}
                            required
                        />

                        <TextArea
                            id="category-description"
                            label="Descrição da Categoria"
                            name="description"
                            rows={3}
                            value={category?.description ?? ""}
                            onChange={handleChange}
                        />

                        <ButtonPrimary
                            id="submit-category"
                            type="submit"
                            children={props.category ? "Salvar Alterações" : "Criar Categoria"}
                        />
                    </form>
                </div>
            )}
        </Modal>
    );
}
