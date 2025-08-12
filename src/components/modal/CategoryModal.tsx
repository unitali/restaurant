import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ButtonPrimary, Input, Modal, TextArea, type ModalProps } from "..";
import { LoadingPage } from "../../pages/LoadingPage";
import { addCategory, updateCategory } from "../../services/categoriesService";
import type { CategoryType } from "../../types";
import { useRestaurant } from "../../contexts/RestaurantContext";

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
                toast.success("Categoria atualizada com sucesso!");
                setCategory(newCategory);
                props.onClose();
            } else if (category) {
                await addCategory(props.restaurantId, category);
                toast.success("Categoria cadastrada com sucesso!");
                setCategory(initialCategoryState);
            } else {
                throw new Error("Categoria inválida");
            }
            if (props.onCategoryChanged) {
                await props.onCategoryChanged();
            }
        } catch (error) {
            console.error("Erro ao salvar categoria:", error);
            toast.error("Erro ao salvar categoria");
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
                        <Input
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
