import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { ModalProps } from "..";
import { ButtonPrimary, Input, Modal, Select } from "..";
import { addProduct } from "../../services/productsService";
import type { ProductType } from "../../types";
import { formatCurrencyBRL } from "../../utils/currency";
import { LoadingPage } from "../../pages/LoadingPage";

interface ProductModalProps extends ModalProps {
    product?: ProductType;
    restaurantId: string;
    categories: { id: string; name: string }[];
    onProductChanged?: () => Promise<void>;
}

export function ProductModal({ ...props }: ProductModalProps) {
    const [loading, setLoading] = useState(false);
    const [isPriceFormatted, setIsPriceFormatted] = useState(false);
    const initializedRef = useRef(false);

    const [product, setProduct] = useState<ProductType>(() => {
        if (props.product) {
            return props.product;
        } else {
            return {
                name: "",
                price: 0,
                categoryId: props.categories[0]?.id || "",
            };
        }
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setProduct(prev => {
            if (!prev) return prev;
            let updatedValue: string = value;

            if (name === "price" && value) {
                const numericString = value.replace(/\D/g, "");
                const numeric = Number(numericString) / 100;
                updatedValue = numeric.toFixed(2);
            }

            return { ...prev, [name]: updatedValue };
        });
        if (name === "price") setIsPriceFormatted(false);
    };

    const handlePriceBlur = () => {
        setIsPriceFormatted(true);
    };

    const handlePriceFocus = () => {
        setIsPriceFormatted(false);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        try {
            await addProduct(props.restaurantId, product);
            toast.success("Produto salvo com sucesso!");
            if (props.onProductChanged) {
                await props.onProductChanged();
            }
        } catch (error) {
            toast.error("Erro ao salvar produto.");
            console.error("Erro ao salvar produto:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (props.isOpen && !props.product && props.categories.length > 0 && !initializedRef.current) {
            setProduct(prev => {
                initializedRef.current = true;
                return { ...prev, categoryId: props.categories[0].id };
            });
        }

        if (!props.isOpen) {
            initializedRef.current = false;
        }
    }, [props.isOpen, props.product, props.categories]);

    return (
        <Modal id={props.id}
            onClose={props.onClose}
            isOpen={props.isOpen}
        >
            {loading ? (
                <LoadingPage />
            ) : (
                <>
                    <h2 className="text-lg font-semibold text-center mb-4">{props.product ? "Editar Produto" : "Criar Produto"}</h2>
                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Produto"
                            name="name"
                            value={product?.name || ""}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Descrição"
                            name="description"
                            value={product?.description || ""}
                            onChange={handleChange}
                        />
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    label="Preço"
                                    name="price"
                                    value={
                                        isPriceFormatted && product?.price
                                            ? formatCurrencyBRL(product.price)
                                            : product?.price || ""
                                    }
                                    onChange={handleChange}
                                    onBlur={handlePriceBlur}
                                    onFocus={handlePriceFocus}
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <Select
                                    label="Categoria"
                                    name="categoryId"
                                    value={product.categoryId}
                                    onChange={handleChange}
                                    required
                                    options={props.categories.map(category => ({
                                        value: category.id,
                                        label: category.name,
                                    }))}
                                    id="productCategory"
                                />
                            </div>
                        </div>
                        <ButtonPrimary
                            type="submit"
                            children={
                                props.product ? "Salvar Alterações" : "Criar Produto"
                            }
                        />
                    </form>
                </>
            )}
        </Modal>
    )
}