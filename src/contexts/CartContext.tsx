import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { CartItem } from "../types";

const generateItemSignature = (product: CartItem): string => {
    const sortedOptions = product.options
        ? [...product.options].sort((a, b) => (a.id || "").localeCompare(b.id || ""))
        : [];

    const optionsString = sortedOptions
        .map(opt => `${opt.id}:${opt.quantity}`)
        .join(',');

    return `${product.productId}|obs:${product.observation || ''}|opts:${optionsString}`;
};
interface CartContextType {
    cart: CartItem[];
    total: number;
    addToCart: (itemToAdd: CartItem) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = "restaurant_cart";

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(CART_KEY);
        if (stored) setCart(JSON.parse(stored));
    }, []);

    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }, [cart]);

    const total = cart.reduce((grandTotal, product) => {
        const optionsPricePerUnit = product.options?.reduce((optionsSubtotal, option) => {
            return optionsSubtotal + (option.price * (option.quantity ?? 1));
        }, 0) ?? 0;

        const singleItemPrice = product.price + optionsPricePerUnit;
        const lineItemTotal = singleItemPrice * product.quantity;
        return grandTotal + lineItemTotal;
    }, 0);


    function addToCart(productToAdd: CartItem) {
        const signatureToAdd = generateItemSignature(productToAdd);

        setCart((prevCart) => {
            const existingItemIndex = prevCart.findIndex(
                (product) => generateItemSignature(product) === signatureToAdd
            );

            if (existingItemIndex > -1) {
                const updatedCart = [...prevCart];
                const existingItem = { ...updatedCart[existingItemIndex] }; // Crie uma cópia para modificar

                // 2. Some a quantidade principal
                existingItem.quantity += productToAdd.quantity;

                // 3. Some as quantidades dos opcionais
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

    function removeFromCart(productId: string) {
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

    function clearCart() {
        setCart([]);
    }

    return (
        <CartContext.Provider value={{ cart, total, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
}