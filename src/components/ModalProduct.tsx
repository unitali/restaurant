import { useCallback, useEffect, useState } from "react";
import { FaSave, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { ButtonOutline, ButtonPrimary, ImageUpload, Input, Modal, Select, Switch } from ".";
import { useRestaurant } from "../contexts/RestaurantContext";
import { useImages } from '../hooks/useImages';
import { useProducts } from "../hooks/useProducts";
import { LoadingPage } from "../pages/LoadingPage";
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
    topPick: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    options: [],
};

const initialImageState: ImageState = {
    file: null,
    removed: false,
    dirty: false,
    previewUrl: null
};

interface ProductModalProps extends React.ComponentProps<typeof Modal> {
    product?: ProductType;
    productId?: string | null;
    onProductChanged?: () => Promise<void>;
}

export function ProductModal(props: ProductModalProps) {
    const { restaurantId, restaurant } = useRestaurant();
    const { addProduct, updateProduct } = useProducts();
    const { updateImage } = useImages();

    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState<ProductType>(initialProductState);
    const [originalImage, setOriginalImage] = useState<ImageType | null>(null);
    const [imageState, setImageState] = useState<ImageState>(initialImageState);
    const [newOption, setNewOption] = useState<ProductOptionsType>({ id: "", name: "", price: 0 });
    const [showOptionInputs, setShowOptionInputs] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    const categories: CategoryType[] = Array.isArray(restaurant?.categories) ? restaurant.categories : [];
    const products: ProductType[] = Array.isArray(restaurant?.products) ? restaurant.products : [];

    const resetForm = useCallback(() => {
        setProduct({
            ...initialProductState,
            categoryId: categories[0]?.id ?? ""
        });
        setOriginalImage(null);
        setImageState(initialImageState);
    }, [categories]);

    useEffect(() => {
        setLoading(true);
        if (!props.isOpen) return;
        if (props.productId) {
            const productData = products.find(p => p.id === props.productId);
            if (productData) {
                setProduct(productData);
                setOriginalImage(productData.image || null);
                setImageState({
                    file: null,
                    removed: false,
                    dirty: false,
                    previewUrl: productData.image?.url || null
                });
            }
        } else {
            resetForm();
        }
        setLoading(false);
    }, [props.isOpen, props.productId, products, resetForm]);

    useEffect(() => {
        if (!props.productId) {
            setIsDirty(true);
            return;
        }
        const original = products.find(p => p.id === props.productId);
        if (!original) {
            setIsDirty(false);
            return;
        }
        const changed =
            product.name !== original.name ||
            product.description !== original.description ||
            product.price !== original.price ||
            product.categoryId !== original.categoryId ||
            product.observationDisplay !== original.observationDisplay ||
            product.topPick !== original.topPick ||
            JSON.stringify(product.options) !== JSON.stringify(original.options) ||
            (product.image?.url ?? null) !== (original.image?.url ?? null) ||
            imageState.dirty || imageState.removed;
        setIsDirty(changed);
    }, [product, imageState, props.productId, products]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: name === "price"
                ? (Number(value.replace(/\D/g, "")) / 100)
                : value
        }));
    };

    const handleSwitch = (name: "observationDisplay" | "topPick", value: boolean) => {
        setProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRemoveOption = (index: number) => {
        setProduct(prev => ({
            ...prev,
            options: prev.options?.filter((_, idx) => idx !== index) || []
        }));
    };

    const handleAddOption = () => {
        if (!(newOption.name ?? "").trim()) {
            toast.error("Informe o nome do opcional.");
            return;
        }
        setProduct(prev => ({
            ...prev,
            options: [
                ...(prev.options || []),
                {
                    id: newOption.id,
                    name: newOption.name,
                    price: newOption.price,
                }
            ]
        }));
        setNewOption({ id: "", name: "", price: 0 });
        setShowOptionInputs(false);
    };

    const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "optionName") {
            setNewOption(prev => ({ ...prev, name: value }));
        } else if (name === "optionPrice") {
            const numeric = Number(value.replace(/\D/g, "")) / 100;
            setNewOption(prev => ({ ...prev, price: isNaN(numeric) ? 0 : numeric }));
        }
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
                    productToSave.image = imageResult
                        ? {
                            path: imageResult.path ?? "",
                            url: imageResult.url ?? "",
                            imageId: imageResult.imageId ?? ""
                        }
                        : { path: "", url: "", imageId: "" };
                } else if (imageState.removed && originalImage?.path) {
                    await updateImage({ oldImagePath: originalImage.path, restaurantId, file: new File([""], "dummy.txt") });
                    productToSave.image = null;
                }
            }
            if (props.productId) {
                await updateProduct(restaurantId, productToSave);
                props.onClose();
            } else {
                await addProduct(restaurantId, productToSave);
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
            console.error("Erro ao salvar produto:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal id={props.id} onClose={props.onClose} isOpen={true}>
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
                            value={product.name}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            id="product-description"
                            label="Descrição"
                            name="description"
                            value={product.description}
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
                        <div className="flex flex-col md:flex-row gap-2 mb-2">
                            <div className="flex flex-1 items-center justify-between p-4 border bg-white rounded border-unitali-blue-600">
                                <span className="text-unitali-blue-600 mr-2">
                                    Adicionar Campo Observação?
                                </span>
                                <Switch
                                    id="product-observation"
                                    value={product.observationDisplay}
                                    onChange={val => handleSwitch("observationDisplay", val)}
                                />
                            </div>
                            <div className="flex flex-1 items-center justify-between p-4 border bg-white rounded border-unitali-blue-600">
                                <span className="text-unitali-blue-600 mr-2">
                                    Produto em Destaque?
                                </span>
                                <Switch
                                    id="product-top-pick"
                                    value={product.topPick}
                                    onChange={val => handleSwitch("topPick", val)}
                                />
                            </div>
                        </div>
                        {showOptionInputs && (
                            <div className="border bg-gray-100 rounded p-2 pt-4 border-unitali-blue-600">
                                <Input
                                    id="product-option-name"
                                    label="Nome do opcional"
                                    name="optionName"
                                    value={newOption.name}
                                    onChange={handleOptionChange}
                                    required
                                />
                                <div className="flex flex-row justify-center align-items-center gap-2">
                                    <div className="flex-1">
                                        <Input
                                            id="option-price"
                                            label="Preço"
                                            name="optionPrice"
                                            value={formatCurrencyBRL(newOption.price ?? 0)}
                                            onChange={handleOptionChange}
                                        />
                                    </div>
                                    {newOption.name ? (
                                        <button
                                            type="button"
                                            className="mb-2 p-3 bg-unitali-blue-600 text-white rounded hover:bg-unitali-blue-500"
                                            onClick={handleAddOption}
                                            title="Salvar opcional"
                                        >
                                            <FaSave className="text-2xl" />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="mb-2 bg-red-500 text-white p-3 rounded hover:bg-red-700"
                                            onClick={() => setShowOptionInputs(false)}
                                            title="Fechar opcional"
                                        >
                                            <FaTrash className="text-2xl" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                        {product.options && product.options.length > 0 && (
                            <div className="mb-2">
                                <span className="font-semibold">Opcionais Adicionados:</span>
                                <ul className="list-disc space-y-2">
                                    {product.options.map((opt, idx) => (
                                        <li key={idx} className="flex items-center w-full p-4 pt-5 rounded left-3 top-0 bg-white text-unitali-blue-600 border border-unitali-blue-600">
                                            <span>{opt.name} - {formatCurrencyBRL(opt.price ?? 0)}</span>
                                            <FaTrash className="ml-auto text-red-500 cursor-pointer"
                                                onClick={() => handleRemoveOption(idx)} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="flex gap-2 mt-2">
                            <ButtonOutline
                                id="product-option-cancel"
                                onClick={() => setShowOptionInputs(true)}
                                children="Adicionar Opcional"
                            />
                            <ButtonPrimary
                                id="product-submit"
                                type="submit"
                                disabled={loading || !isDirty}
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