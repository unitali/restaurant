import { useState } from "react";
import { toast } from "react-toastify";
import { Modal, type ModalProps } from ".";
import { addCategory } from "../../services/categoriesService";
import type { CategoryType } from "../../types";
import { ButtonPrimary, Input, TextArea } from "../index";
import { LoadingPage } from "../../pages/LoadingPage";

interface CategoryModalProps extends ModalProps {
    restaurantId: string;
    onCategoryChanged?: () => Promise<void>;
    category?: CategoryType;
}


export function CategoryModal({ ...props }: CategoryModalProps) {
    const [name, setName] = useState(props.category?.name || "");
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState(props.category?.description || "");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        try {
            await addCategory({
                restaurantId: props.restaurantId,
                name,
                description,
            });
            toast.success("Categoria salva com sucesso!");
            if (props.onCategoryChanged) {
                await props.onCategoryChanged();
            }
            props.onClose();
        } catch (error) {
            console.error("Erro ao salvar categoria:", error);
            toast.error("Erro ao salvar categoria");
        } finally {
            setLoading(false);
        }
    };

    return (

        <Modal
            isOpen={props.isOpen}
            onClose={() => { props.onClose() }}
            id="category-modal"
        >
            {loading ? (
                <LoadingPage />
            ) : (
                <div>
                    <h2 className="text-lg font-semibold text-center mb-4">{props.category ? "Editar Categoria" : "Criar Categoria"}</h2>
                    <form onSubmit={handleSubmit}>
                        <Input
                            type="text"
                            label="Nome da Categoria"
                            name="categoryName"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                        <TextArea
                            id="description"
                            label="Descrição da Categoria"
                            name="description"
                            rows={3}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />

                        <ButtonPrimary
                            type="submit"
                            children={
                                props.category ? "Salvar Alterações" : "Criar Categoria"
                            }
                        />
                    </form>
                </div>
            )}
        </Modal>
    );
}