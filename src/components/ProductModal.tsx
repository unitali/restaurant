import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ButtonPrimary, ImageUpload, Input, Modal, Select } from ".";
import { useRestaurant } from "../contexts/RestaurantContext";
import { LoadingPage } from "../pages/LoadingPage";
import { updateImage } from '../services/imagesServices';
import { addProduct, updateProduct } from "../services/productsService";
import type { CategoryType, ImageState, ImageType, ProductType } from '../types';
import { formatCurrencyBRL } from "../utils/currency";

const initialProductState: ProductType = {
    id: "",
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    image: null,
    createdAt: new Date(),
    updatedAt: new Date()
};

const initialImageState: ImageState = {
    file: null,
    removed: false,
    dirty: false,
    previewUrl: null
};

export function ProductModal(props: {
    product?: ProductType;
    productId?: string | null;
    onProductChanged?: () => Promise<void>;
} & React.ComponentProps<typeof Modal>) {
    const { restaurantId, restaurant } = useRestaurant();
    const initializedRef = useRef(false);


    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState<ProductType>(initialProductState);
    const [products, setProducts] = useState<ProductType[]>(Array.isArray(restaurant?.products) ? restaurant.products : []);
    const [originalImage, setOriginalImage] = useState<ImageType | null>(null);
    const [imageState, setImageState] = useState<ImageState>(initialImageState);

    const categories: CategoryType[] = Array.isArray(restaurant?.categories) ? restaurant.categories : [];

    const resetForm = useCallback(() => {
        setProduct({
            ...initialProductState,
            categoryId: Array.isArray(categories) && categories.length > 0 ? categories[0]?.id ?? "" : ""
        });
        setOriginalImage(null);
        setImageState(initialImageState);
    }, [categories]);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setProducts(Array.isArray(restaurant?.products) ? restaurant.products : []);
                if (!props.isOpen) {
                    initializedRef.current = false;
                    return;
                }
                if (props.productId) {
                    const productData = products.length > 0
                        ? products.find(p => p.id === props.productId) || null
                        : null;
                    if (productData) {
                        setProduct(productData);
                        setOriginalImage(productData.image || null);
                        setImageState({
                            file: null,
                            removed: false,
                            dirty: false,
                            previewUrl: productData.image?.url || null
                        });
                    } else {
                        toast.error("Produto não encontrado.");
                    }
                } else {
                    resetForm();
                }
            } catch (error) {
                console.error("Erro ao carregar produto:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [props.isOpen, props.productId, products, categories, resetForm]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: name === "price"
                ? (Number(value.replace(/\D/g, "")) / 100).toFixed(2)
                : value
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        try {
            let productToSave = { ...product };
            if (imageState.dirty) {
                if (imageState.file) {
                    const imageResult = await updateImage({
                        file: imageState.file,
                        oldImagePath: originalImage?.path,
                        restaurantId
                    });
                    productToSave.image = { ...imageResult };
                } else if (imageState.removed && originalImage?.path) {
                    await updateImage({ oldImagePath: originalImage.path, restaurantId, file: new File([""], "dummy.txt") });
                    productToSave.image = null;
                }
            }
            if (props.productId) {
                await updateProduct(restaurantId, productToSave);
                toast.success("Produto atualizado com sucesso!");
                props.onClose();
            } else {
                await addProduct(restaurantId, productToSave);
                toast.success("Produto cadastrado com sucesso!");
            }
            if (props.onProductChanged) await props.onProductChanged();
            props.productId ? setOriginalImage(productToSave.image || null) : resetForm();
            setImageState({
                file: null,
                removed: false,
                dirty: false,
                previewUrl: productToSave.image?.url || null
            });
        } catch (error) {
            toast.error("Erro ao salvar produto.");
            console.error("Erro ao salvar produto:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal id={props.id} onClose={props.onClose} isOpen={props.isOpen}>
            {loading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                    <LoadingPage />
                </div>
            ) : (
                <>
                    <h2 className="text-lg font-semibold text-center mb-4">
                        {props.productId ? "Editar Produto" : "Criar Produto"}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <ImageUpload
                            id="product-image"
                            disabled={loading}
                            required={false}
                            initialUrl={originalImage?.url || null}
                            onStateChange={setImageState}
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
                                    options={categories.map(category => ({
                                        value: category.id ?? "",
                                        label: category.name,
                                    }))}
                                />
                            </div>
                        </div>
                        <ButtonPrimary
                            id="product-submit"
                            type="submit"
                            disabled={loading}
                        >
                            {props.productId ? "Salvar Alterações" : "Criar Produto"}
                        </ButtonPrimary>
                    </form>
                </>
            )}
        </Modal>
    );
}