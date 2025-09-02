import { useMemo, useState } from "react";
import { FaFileImage } from "react-icons/fa";
import { ButtonPrimary, ButtonPrimaryMinus, ButtonPrimaryPlus, InputText, Modal } from "..";
import { useOrder } from "../../contexts/OrderContext";
import type { ProductType } from "../../types";
import { formatCurrencyBRL } from "../../utils/currency";
interface ProductCardProps {
    product: ProductType;
    setIsAnyProductModalOpen: (isOpen: boolean) => void;
}

export function ProductCard({ product, setIsAnyProductModalOpen }: ProductCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(0);
    const [observation, setObservation] = useState("");

    const { addToOrder } = useOrder();

    const [optionQuantities, setOptionQuantities] = useState(
        Array.isArray(product.options) ? product.options.map(() => 0) : []
    );

    const currentItemTotal = useMemo(() => {
        if (quantity <= 0) return 0;
        const mainProductTotal = product.price * quantity;

        const optionsTotal = Array.isArray(product.options)
            ? product.options.reduce((acc, option, idx) => {
                const optionQuantity = optionQuantities[idx] || 0;
                return acc + ((option.price ?? 0) * optionQuantity);
            }, 0)
            : 0;

        return mainProductTotal + optionsTotal;
    }, [quantity, optionQuantities, product.price, product.options]);


    const handlePlus = () => setQuantity(q => q + 1);
    const handleMinus = () => setQuantity(q => (q > 0 ? q - 1 : 0));

    const handleOptionPlus = (idx: number) => {
        setOptionQuantities(qs => qs.map((q, i) => i === idx ? q + 1 : q));
    };
    const handleOptionMinus = (idx: number) => {
        setOptionQuantities(qs => qs.map((q, i) => i === idx ? (q > 0 ? q - 1 : 0) : q));
    };

    const openModal = () => {
        setQuantity(1);
        setOptionQuantities(Array.isArray(product.options) ? product.options.map(() => 0) : []);
        setObservation("");
        setIsModalOpen(true);
        setIsAnyProductModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsAnyProductModalOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedOptions = Array.isArray(product.options)
            ? product.options
                .map((opt, idx) => ({
                    ...opt,
                    quantity: optionQuantities[idx]
                }))
                .filter(opt => opt.quantity > 0)
            : [];
        const cartItemId = `${product.id}-${Date.now()}`;

        const cartItem = {
            ...product,
            id: cartItemId,
            productId: product.id ?? "",
            quantity,
            observation,
            options: selectedOptions,
        };

        addToOrder(cartItem);
        closeModal();
    };

    return (
        <>
            <button
                type="button"
                className="bg-white rounded shadow p-3 flex flex-row cursor-pointer items-center w-full h-28 mb-3 transition-all duration-300 outline-none hover:scale-102"
                onClick={openModal}
            >
                <div className="flex-1 flex flex-col justify-center">
                    <h3 className="font-bold text-unitali-blue-600">{product.name}</h3>
                    <p className="text-xs text-unitali-blue-400">{product.description}</p>
                    <span className="font-semibold text-green-700 text-base mt-2">
                        {formatCurrencyBRL(product.price)}
                    </span>
                </div>
                <div className="ml-4 flex-shrink-0 flex items-center justify-center h-22 w-22">
                    {product.image?.url ? (
                        <img
                            src={product.image?.url}
                            alt={product.name}
                            className="object-cover rounded"
                        />
                    ) : (
                        <FaFileImage className="w-16 h-16 text-gray-200 rounded" />
                    )}
                </div>
            </button>
            <Modal isOpen={isModalOpen} onClose={closeModal} id={`product-modal-${product.id}`}>
                <form className="max-h-xl overflow-y-auto bg-white" onSubmit={handleSubmit}>
                    <div className="flex flex-col items-center p-2">
                        <h2 className="text-lg font-semibold text-center mb-4 text-unitali-blue-600">{product.name}</h2>
                        <div className="mb-4">
                            {product.image?.url ? (
                                <img
                                    src={product.image?.url}
                                    alt={product.name}
                                    className="object-cover rounded mx-auto h-24"
                                />
                            ) : (
                                <FaFileImage className="w-24 h-24 text-gray-200 rounded mx-auto" />
                            )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                        <span className="font-semibold text-green-700 text-xl mb-4">
                            {formatCurrencyBRL(product.price)}
                        </span>
                        <div className="flex items-center gap-2 mb-4">
                            <ButtonPrimaryMinus
                                id={`product-quantity-minus-${product.id}`}
                                onClick={handleMinus}
                            />
                            <span className="font-bold text-lg">{quantity}</span>
                            <ButtonPrimaryPlus
                                id={`product-quantity-plus-${product.id}`}
                                onClick={handlePlus}
                            />
                        </div>
                        {Array.isArray(product.options) && product.options.length > 0 && (
                            <div id="adicional-options" className="w-full">
                                <h4 className="font-semibold text-gray-700">Adicionais</h4>
                                <ul className="flex flex-col">
                                    {product.options.map((option, idx) => (
                                        <li key={idx} className="flex items-center">
                                            <div className="flex items-center gap-2 mb-2">
                                                <ButtonPrimaryMinus
                                                    id={`optional-quantity-minus-${idx}`}
                                                    onClick={() => handleOptionMinus(idx)}
                                                />
                                                <span className="font-bold text-lg">{optionQuantities[idx]}</span>
                                                <ButtonPrimaryPlus
                                                    id={`optional-quantity-plus-${idx}`}
                                                    onClick={() => handleOptionPlus(idx)}
                                                />
                                            </div>
                                            <label htmlFor={`optional-${idx}`} className="ms-4 text-gray-800 text-xl">
                                                {option.name} (+{formatCurrencyBRL(option.price ?? 0)})
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {product.observationDisplay && (
                            <InputText
                                id={`product-observation-${product.id}`}
                                label="Observação"
                                value={observation}
                                onChange={e => setObservation(e.target.value)}
                                className="w-full mb-4"
                            />
                        )}
                        <ButtonPrimary
                            type="submit"
                            id={`add-product-${product.id}`}
                            className="w-full"
                            disabled={quantity <= 0}
                        >
                            {`Adicionar ao carrinho - ${formatCurrencyBRL(currentItemTotal)}`}
                        </ButtonPrimary>
                    </div>
                </form>
            </Modal>
        </>
    );
}