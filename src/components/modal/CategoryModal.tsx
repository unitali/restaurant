import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ButtonPrimary, Input, Modal, TextArea, type ModalProps } from "..";
import { LoadingPage } from "../../pages/LoadingPage";
import { addCategory, updateCategory } from "../../services/categoriesService";
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
    const [category, setCategory] = useState<CategoryType>(initialCategoryState);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (props.category) {
            setCategory({
                id: props.category?.id,
                name: props.category?.name,
                description: props.category?.description,
            });
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
                await updateCategory(props.restaurantId, {
                    id: props.category.id,
                    name: props.category.name,
                    description: props.category.description,
                });
                toast.success("Categoria atualizada com sucesso!");
            } else if (category) {
                await addCategory(props.restaurantId, category);
                toast.success("Categoria salva com sucesso!");
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
            setCategory(initialCategoryState);
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
                    <h2 className="text-lg font-semibold mb-4">
                        {props.category ? "Editar Categoria" : "Criar Categoria"}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <Input
                            type="text"
                            label="Nome da Categoria"
                            name="name"
                            value={category?.name ?? ""}
                            onChange={handleChange}
                            required
                        />
                        <TextArea
                            id="description"
                            label="Descrição da Categoria"
                            name="description"
                            rows={3}
                            value={category?.description ?? ""}
                            onChange={handleChange}
                        />

                        <ButtonPrimary
                            type="submit"
                        >
                            {props.category ? "Salvar Alterações" : "Criar Categoria"}
                        </ButtonPrimary>
                    </form>
                </div>
            )}
        </Modal>
    );
}
