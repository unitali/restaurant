import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { AddressType, CartItem, PaymentMethodsType } from "../types";
import { createOrderNumber as orderNumberGenetator } from "../utils/orderNumber";

const generateItemSignature = (product: CartItem): string => {
    const sortedOptions = product.options
        ? [...product.options].sort((a, b) => (a.id || "").localeCompare(b.id || ""))
        : [];

    const optionsString = sortedOptions
        .map(opt => `${opt.id}:${opt.quantity}`)
        .join(',');

    return `${product.productId}|obs:${product.observation || ''}|opts:${optionsString}`;
};

const ORDER_KEY = "restaurant_order";

interface OrderContextType {
    cart: CartItem[];
    total: number;
    addToOrder: (itemToAdd: CartItem) => void;
    removeFromOrder: (productId: string) => void;
    clearOrder: () => void;
    addDeliveryAddress: (address: AddressType | null) => void;
    deliveryAddress: AddressType | null;
    paymentMethod: PaymentMethodsType | null;
    setPaymentMethod: (method: PaymentMethodsType | null) => void;
    orderNumber: string | null;
    createOrderNumber: () => string;
    ORDER_KEY: typeof ORDER_KEY;
    deliveryTax: number;
    setDeliveryTax: (tax: number) => void;
}


const OrderContext = createContext<OrderContextType | null>(null);


export function OrderProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [deliveryAddress, setDeliveryAddress] = useState<AddressType | null>(null);
    const [deliveryTax, setDeliveryTax] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodsType | null>(null);
    const [orderNumber, setOrderNumber] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem(ORDER_KEY);
        if (stored) setCart(JSON.parse(stored));
    }, []);

    useEffect(() => {
        localStorage.setItem(ORDER_KEY, JSON.stringify(cart));
    }, [cart]);

    const total = cart.reduce((grandTotal, product) => {
        const optionsPricePerUnit = product.options?.reduce((optionsSubtotal, option) => {
            return optionsSubtotal + ((option.price ?? 0) * (option.quantity ?? 1));
        }, 0) ?? 0;

        const singleItemPrice = (product.price ?? 0) + optionsPricePerUnit;
        const lineItemTotal = singleItemPrice * product.quantity;
        return grandTotal + lineItemTotal;
    }, 0) + (deliveryAddress && deliveryTax ? deliveryTax : 0);

    function setDeliveryTaxValue(tax: number) {
        setDeliveryTax(tax);

        const storedOrder = localStorage.getItem(ORDER_KEY);
        let orderData = storedOrder ? JSON.parse(storedOrder) : {};
        orderData = {
            ...orderData,
            deliveryTax: tax
        };
        localStorage.setItem(ORDER_KEY, JSON.stringify(orderData));
    }

    function addToOrder(productToAdd: CartItem) {
        const signatureToAdd = generateItemSignature(productToAdd);

        setCart((prevCart) => {
            const existingItemIndex = prevCart.findIndex(
                (product) => generateItemSignature(product) === signatureToAdd
            );

            if (existingItemIndex > -1) {
                const updatedCart = [...prevCart];
                const existingItem = { ...updatedCart[existingItemIndex] };

                existingItem.quantity += productToAdd.quantity;

                if (existingItem.options && productToAdd.options) {
                    existingItem.options = existingItem.options.map(existingOpt => {
                        const optionToAdd = productToAdd.options?.find(opt => opt.id === existingOpt.id);
                        if (optionToAdd) {
                            return {
                                ...existingOpt,
                                quantity: (existingOpt.quantity ?? 0) + (optionToAdd.quantity ?? 0)
                            };
                        }
                        return existingOpt;
                    });
                }

                updatedCart[existingItemIndex] = existingItem;
                return updatedCart;
            } else {
                return [...prevCart, productToAdd];
            }
        });
    }

    function createOrderNumber() {
        const newOrderNumber = orderNumberGenetator();
        setOrderNumber(newOrderNumber);
        return newOrderNumber;
    }

    function removeFromOrder(productId: string) {
        setCart((prev) => {
            const itemToRemove = prev.find(product => product.productId === productId);

            if (itemToRemove && itemToRemove.quantity > 1) {
                return prev.map(product =>
                    product.productId === productId
                        ? { ...product, quantity: product.quantity - 1 }
                        : product
                );
            } else {
                return prev.filter(product => product.productId !== productId);
            }
        });
    }

    function clearOrder() {
        setCart([]);
    }

    function addDeliveryAddress(address: AddressType | null) {
        setDeliveryAddress(address);

        const storedOrder = localStorage.getItem(ORDER_KEY);
        let orderData = storedOrder ? JSON.parse(storedOrder) : {};
        orderData = {
            ...orderData,
            deliveryAddress: address
        };
        localStorage.setItem(ORDER_KEY, JSON.stringify(orderData));
    }

    function setPaymentMethodAndPersist(method: PaymentMethodsType | null) {
        setPaymentMethod(method);

        const storedOrder = localStorage.getItem(ORDER_KEY);
        let orderData = storedOrder ? JSON.parse(storedOrder) : {};
        orderData = {
            ...orderData,
            paymentMethod: method
        };
        localStorage.setItem(ORDER_KEY, JSON.stringify(orderData));
    }

    return (
        <OrderContext.Provider
            value={{
                cart,
                total,
                addToOrder,
                removeFromOrder,
                clearOrder,
                addDeliveryAddress,
                deliveryAddress,
                paymentMethod,
                setPaymentMethod: setPaymentMethodAndPersist,
                ORDER_KEY,
                orderNumber,
                createOrderNumber,
                deliveryTax,
                setDeliveryTax: setDeliveryTaxValue 
            }}
        >
            {children}
        </OrderContext.Provider>
    );
}

export function useOrder() {
    const context = useContext(OrderContext);
    if (!context) throw new Error("useOrder must be used within an OrderProvider");
    return context;
}