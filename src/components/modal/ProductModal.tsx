import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { ModalProps } from "..";
import { ButtonPrimary, ImageUpload, Input, Modal, Select } from "..";
import { LoadingPage } from "../../pages/LoadingPage";
import { removeImage, updateImage, uploadImage } from '../../services/imagesServices';
import { addProduct, fetchProductById, updateProduct } from "../../services/productsService";
import type { CategoryType, ProductType } from "../../types";
import { formatCurrencyBRL } from "../../utils/currency";

interface ProductModalProps extends ModalProps {
    product?: ProductType;
    restaurantId: string;
    categories: CategoryType[];
    onProductChanged?: () => Promise<void>;
    productId?: string | null;
}

const initialProductState: ProductType = {
    id: "",
    name: "",
    price: 0,
    categoryId: "",
    image: null,
};

export function ProductModal({ ...props }: ProductModalProps) {
    const [loading, setLoading] = useState(false);
    const initializedRef = useRef(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [product, setProduct] = useState<ProductType>(initialProductState);

    useEffect(() => {
        async function loadProductData() {
            if (props.productId) {
                setLoading(true);
                try {
                    const productData = await fetchProductById(props.restaurantId, props.productId);
                    if (productData) {
                        setProduct(productData);
                    } else {
                        toast.error("Produto não encontrado.");
                    }
                } catch (error) {
                    console.error("Erro ao buscar produto:", error);
                    toast.error("Erro ao buscar produto.");
                } finally {
                    setLoading(false);
                }
            } else if (props.isOpen) {
                setProduct({
                    ...initialProductState,
                    categoryId: props.categories[0]?.id || "",
                });
                setSelectedImage(null);
            }
        }

        loadProductData();

        if (!props.isOpen) {
            initializedRef.current = false;
        }
    }, [props.isOpen, props.productId, props.restaurantId]);

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
    };

    const handleImageChange = async (file: File | null) => {
        if (file) {
            setSelectedImage(file);
        } else {
            if (product?.image?.path) {
                try {
                    await removeImage(product.image.path);
                } catch (error) {
                    console.error("Erro ao remover imagem do storage:", error);
                }
            }
            setSelectedImage(null);
            setProduct(prev => ({
                ...prev,
                image: null
            }));
        }
    };

    const processImageUpload = async (file: File): Promise<{ url: string; path: string; imageId?: string }> => {
        const isEditing = Boolean(props.product?.image?.path);

        if (isEditing) {
            return await updateImage({
                file,
                folder: 'products',
                oldImagePath: props.product!.image!.path
            });
        } else {
            return await uploadImage({
                file,
                folder: 'products'
            });
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        try {
            let productToSave = { ...product };

            if (selectedImage) {
                try {
                    const imageResult = await processImageUpload(selectedImage);
                    productToSave.image = {
                        url: imageResult.url,
                        path: imageResult.path,
                        imageId: imageResult.imageId || props.product?.image?.imageId || ""
                    };
                } catch (imageError) {
                    console.error("Erro no upload da imagem:", imageError);
                    toast.error("Erro ao fazer upload da imagem");
                    return;
                }
            }

            if (props.productId) {
                await updateProduct(props.restaurantId, productToSave);
                toast.success("Produto atualizado com sucesso!");
            } else {
                await addProduct(props.restaurantId, productToSave);
                toast.success("Produto cadastrado com sucesso!");
            }

            if (props.onProductChanged) {
                await props.onProductChanged();
            }
        } catch (error) {
            toast.error("Erro ao salvar produto.");
            console.error("Erro ao salvar produto:", error);
        } finally {
            setLoading(false);
            setProduct(initialProductState);
        }
    };

    return (
        <Modal id={props.id}
            onClose={props.onClose}
            isOpen={props.isOpen}>
            {loading ? <LoadingPage /> : (
                <>
                    <h2 className="text-lg font-semibold text-center mb-4">
                        {props.productId ? "Editar Produto" : "Criar Produto"}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <ImageUpload
                            id="product-image"
                            label="Imagem do Produto"
                            value={product?.image?.url}
                            onChange={handleImageChange}
                            disabled={loading}
                        />
                        <Input
                            id="product-name"
                            label="Produto"
                            name="name"
                            value={product?.name || ""}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            id="product-description"
                            label="Descrição"
                            name="description"
                            value={product?.description || ""}
                            onChange={handleChange}
                        />
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    id="product-price"
                                    label="Preço"
                                    name="price"
                                    value={formatCurrencyBRL(product.price)}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <Select
                                    id="product-category"
                                    label="Categoria"
                                    name="categoryId"
                                    value={product.categoryId}
                                    onChange={handleChange}
                                    required
                                    options={props.categories.map(category => ({
                                        value: category.id ?? "",
                                        label: category.name,
                                    }))}
                                />
                            </div>
                        </div>
                        <ButtonPrimary
                            id="product-submit"
                            type="submit"
                            children={
                                props.productId ? "Salvar Alterações" : "Criar Produto"
                            }
                        />
                    </form>
                </>
            )}
        </Modal>
    )
}