import { useCallback, useEffect, useRef, useState } from "react";
import { FaSave, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { ButtonOutline, ButtonPrimary, ImageUpload, Input, Modal, Select, Switch } from ".";
import { useRestaurant } from "../contexts/RestaurantContext";
import { LoadingPage } from "../pages/LoadingPage";
import { updateImage } from '../services/imagesServices';
import { addProduct, updateProduct } from "../services/productsService";
import type { CategoryType, ImageState, ImageType, ProductOptionsType, ProductType } from '../types';
import { formatCurrencyBRL } from "../utils/currency";

const initialProductState: ProductType = {
    id: "",
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    image: null,
    observationDisplay: false,
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
    const [newOption, setNewOption] = useState<ProductOptionsType>({ name: "", addPrice: 0 });
    const [showOptionInputs, setShowOptionInputs] = useState(false);
    const [isActive, setIsActive] = useState(product.observationDisplay ?? false);

    useEffect(() => {
        setProduct(prev => ({
            ...prev,
            observationDisplay: isActive
        }));
    }, [isActive]);

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
        if (name === "optionName") {
            setNewOption(prev => ({ ...prev, name: value }));
        } else if (name === "optionPrice") {
            const numeric = Number(value.replace(/\D/g, "")) / 100;
            setNewOption(prev => ({ ...prev, addPrice: isNaN(numeric) ? 0 : numeric }));
        } else {
            setProduct(prev => ({
                ...prev,
                [name]: name === "price"
                    ? (Number(value.replace(/\D/g, "")) / 100)
                    : value
            }));
        }
    };

    const handleRemoveOption = (index: number) => {
        setProduct(prev => ({
            ...prev,
            options: prev.options?.filter((_, idx) => idx !== index) || []
        }));
    };

    const handleAddOption = () => {
        if (!newOption.name.trim()) {
            toast.error("Informe o nome do opcional.");
            return;
        }
        setProduct(prev => ({
            ...prev,
            options: [...(prev.options || []), { ...newOption, addPrice: Number(newOption.addPrice) }]
        }));
        setNewOption({ name: "", addPrice: 0 });
        setShowOptionInputs(false);
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
                <div className="flex items-center justify-center min-h-2xl">
                    <LoadingPage />
                </div>
            ) : (
                <div className="max-h-[80vh] overflow-y-auto px-1">
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
                        <div className="flex items-center justify-between my-4 p-4 border bg-white rounded border-teal-500">
                            <span className="text-teal-500 mr-2">
                                Adicionar Campo Observação?
                            </span>
                            <Switch
                                value={isActive}
                                onChange={setIsActive}
                            />
                        </div>
                        {showOptionInputs && (
                            <div className="border rounded-md p-3 mb-2 border-teal-600 shadow">
                                <div className="flex flex-col md:flex-row gap-2 mb-2">
                                    <Input
                                        id="product-option-name"
                                        label="Nome do opcional"
                                        name="optionName"
                                        value={newOption.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full"
                                    />
                                </div>
                                <div className="flex gap-2 items-end">
                                    <Input
                                        id="option-price"
                                        label="Preço"
                                        type="number"
                                        name="optionPrice"
                                        value={formatCurrencyBRL(newOption.addPrice)}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        className="bg-teal-600 text-white px-4 py-2 rounded flex items-center hover:bg-teal-700"
                                        onClick={handleAddOption}
                                        title="Salvar opcional"
                                    >
                                        <FaSave />
                                    </button>
                                </div>
                            </div>
                        )}
                        {product.options && product.options.length > 0 && (
                            <div className="mb-2">
                                <span className="font-semibold">Opcionais Adicionados:</span>
                                <ul className="list-disc space-y-2">
                                    {product.options.map((opt, idx) => (
                                        <li key={idx} className="flex items-center w-full p-4 pt-5 rounded left-3 top-0 bg-white text-teal-500 border border-teal-500">
                                            <span>{opt.name} - {formatCurrencyBRL(opt.addPrice)}</span>
                                            <FaTrash className="ml-auto text-red-500 cursor-pointer"
                                                onClick={() => handleRemoveOption(idx)} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="flex gap-2">
                            <ButtonOutline
                                id="product-option-cancel"
                                onClick={() => setShowOptionInputs(true)}
                                children="Adicionar Opcional"
                            />
                            <ButtonPrimary
                                id="product-submit"
                                type="submit"
                                disabled={loading}
                            >
                                {props.productId ? "Salvar Alterações" : "Criar Produto"}
                            </ButtonPrimary>
                        </div>
                    </form>
                </div>
            )}
        </Modal>
    );
}