import { useState } from "react";
import { toast } from "react-toastify";
import { Modal, type ModalProps } from ".";
import { LoadingPage } from "../../pages/LoadingPage";
import { addCategoryToRestaurant } from "../../services/categoriesService";
import type { CategoryType } from "../../types";
import { ButtonPrimary, Input, TextArea } from "../index";

interface CategoryModalProps extends ModalProps {
    category?: CategoryType;
    restaurantId: string;
}


export function CategoryModal({ ...props }: CategoryModalProps) {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(props.category?.name || "");
    const [description, setDescription] = useState(props.category?.description || "");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        try {
            await addCategoryToRestaurant({
                restaurantId: props.restaurantId,
                name,
                description,
            });
            toast.success("Categoria salva com sucesso!");
        } catch (error) {
            toast.error("Erro ao salvar categoria");
        } finally {
            setLoading(false);
            props.onClose();

        }
    };

    return (
        <Modal
            isOpen={true}
            onClose={() => { props.onClose() }}
        >
            {loading ? (
                <LoadingPage />
            ) : (
                <>
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
                </>
            )}
        </Modal>
    );
}