import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../config/firebase";
import type { CartItem, OrderType } from "../types";


interface CreateOrderParams {
    restaurantId: string;
    cart: CartItem[];
    total: number;
    orderNumber: string;
}

export function useOrders() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createOrder = useCallback(async (params: CreateOrderParams) => {
        const { restaurantId, cart, total, orderNumber } = params;

        setLoading(true);
        setError(null);

        if (!restaurantId) {
            toast.error("ID do restaurante não fornecido.");
            setLoading(false);
            return null;
        }
        if (cart.length === 0) {
            toast.warn("Seu carrinho está vazio.");
            setLoading(false);
            return null;
        }

        try {
            const restaurantRef = doc(db, "restaurants", restaurantId);
            const restaurantSnap = await getDoc(restaurantRef);
            if (!restaurantSnap.exists()) throw new Error("Restaurante não encontrado.");

            const orders: OrderType[] = restaurantSnap.data().orders || [];

            const newOrder: OrderType = {
                items: cart,
                total,
                status: 'pending',
                createdAt: new Date(),
                orderNumber,
            };

            const updatedOrders = [...orders, newOrder];
            await updateDoc(restaurantRef, { orders: updatedOrders });

            toast.success("Pedido enviado com sucesso!");
            return newOrder.id;

        } catch (err) {
            const error = err instanceof Error ? err : new Error("Erro desconhecido ao enviar o pedido.");
            setError(error);
            console.error("Erro ao criar pedido:", err);
            toast.error("Não foi possível enviar o seu pedido.");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        createOrder,
    };
}