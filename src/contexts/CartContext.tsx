import type { ReactNode } from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { ProductType, CartItem } from "../types";


interface CartContextType {
    cart: CartItem[];
    addToCart: (product: ProductType) => void;
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

    function addToCart(product: ProductType) {
        setCart((prev) => {
            const exists = prev.find((item) => item.product.id === product.id);
            if (exists) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1, price: product.price }];
        });
    }

    function removeFromCart(productId: string) {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.product.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    }

    function clearCart() {
        setCart([]);
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
}