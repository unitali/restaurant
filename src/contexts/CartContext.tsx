import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { CartItem } from "../types";

const generateItemSignature = (item: CartItem): string => {
    const sortedOptions = item.selectedOptions
        ? [...item.selectedOptions].sort((a, b) => (a.price || 0) - (b.price || 0))
        : [];

    const optionsString = sortedOptions
        .map(opt => `${opt.id}:${opt.price}`)
        .join(',');

    return `${item.id}|obs:${item.observation || ''}|opts:${optionsString}`;
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

    const total = cart.reduce((grandTotal, item) => {
        const optionsPricePerUnit = item.selectedOptions?.reduce((optionsSubtotal, option) => {
            return optionsSubtotal + (option.price * (option.quantity ?? 1));
        }, 0) ?? 0;

        const singleItemPrice = item.price + optionsPricePerUnit;
        const lineItemTotal = singleItemPrice * item.quantity;
        return grandTotal + lineItemTotal;
    }, 0);


    function addToCart(itemToAdd: CartItem) {
        const signatureToAdd = generateItemSignature(itemToAdd);

        setCart((prevCart) => {
            const existingItemIndex = prevCart.findIndex(
                (item) => generateItemSignature(item) === signatureToAdd
            );
            if (existingItemIndex > -1) {
                const updatedCart = [...prevCart];
                const existingItem = updatedCart[existingItemIndex];

                updatedCart[existingItemIndex] = {
                    ...existingItem,
                    quantity: existingItem.quantity + itemToAdd.quantity,
                };
                return updatedCart;
            } else {
                return [...prevCart, itemToAdd];
            }
        });
    }

    function removeFromCart(cartItemId: string) {
        setCart((prev) => {
            const itemToRemove = prev.find(item => item.id === cartItemId);

            if (itemToRemove && itemToRemove.quantity > 1) {
                return prev.map(item =>
                    item.id === cartItemId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            } else {
                return prev.filter(item => item.id !== cartItemId);
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