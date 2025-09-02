import { ButtonPrimary, ButtonPrimaryMinus, ButtonPrimaryPlus } from "..";
import { useOrder } from "../../contexts/OrderContext";
import { formatCurrencyBRL } from "../../utils/currency";


export function CartProducts({ onNext }: { onNext: () => void }) {
    const { cart, removeFromOrder, addToOrder, total } = useOrder();
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                {cart.map((product, index) => (
                    <div
                        key={`product-${index}`}
                        className="bg-white rounded-lg shadow p-5 flex flex-col gap-1 border border-unitali-blue-100 w-full"
                    >
                        <div className="font-bold text-base mb-1">
                            {product.name}
                        </div>
                        {product.observation && (
                            <p className="text-sm text-gray-500 pl-2">
                                Obs: {product.observation}
                            </p>
                        )}
                        {product.options && product.options.length > 0 && (
                            <ul className="text-sm text-gray-500 pl-2">
                                {product.options.map((option, index) => (
                                    <li key={`option-${index}`}>
                                        - {option.quantity}x {option.name} (
                                        {formatCurrencyBRL(option.price ?? 0)})
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="flex items-center gap-2 w-full mt-2">
                            <ButtonPrimaryMinus
                                id={`remove-item-${index}`}
                                onClick={() => removeFromOrder(product.productId!)}
                            />
                            <span className="font-semibold mx-2 text-unitali-blue-700">{product.quantity}</span>
                            <ButtonPrimaryPlus
                                id={`add-item-${index}`}
                                onClick={() => addToOrder({ ...product, quantity: 1 })}
                            />
                            <span className="ml-3 text-green-700 font-bold flex-1 text-right">
                                {formatCurrencyBRL(
                                    ((product.price ?? 0) +
                                        (product.options?.reduce(
                                            (acc, opt) =>
                                                acc + (opt.price ?? 0) * (opt.quantity ?? 1),
                                            0
                                        ) ?? 0)) *
                                    product.quantity
                                )}
                            </span>
                        </div>
                    </div>
                ))}
                <div className="mt-4">
                    <span className="font-bold text-lg">Total: </span>
                    <span className="text-green-700 font-bold">
                        {formatCurrencyBRL(total)}
                    </span>
                </div>
                <div className="mt-4 w-full flex flex-col gap-2">
                    <ButtonPrimary
                        id="submit-order"
                        type="button"
                        onClick={onNext}
                        children="Continuar"
                    />
                </div>
            </div>
        </div>
    );
}
