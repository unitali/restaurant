import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../config/firebase";
import { useOrder } from '../contexts/OrderContext';
import type { OrderType } from "../types";
import { useRestaurant } from "../contexts/RestaurantContext";


export function useOrders() {
    const [loadingOrder, setLoadingOrder] = useState(false);
    const { ORDER_KEY, cart, total, orderNumber, deliveryAddress, paymentMethod } = useOrder();
    const { restaurantId } = useRestaurant();

    const createOrder = useCallback(async () => {
        const storedOrder = localStorage.getItem(ORDER_KEY);
        if (!storedOrder) {
            toast.error("Nenhum pedido encontrado.");
            return null;
        }


        setLoadingOrder(true);

        if (!restaurantId) {
            toast.error("ID do restaurante não fornecido.");
            setLoadingOrder(false);
            return null;
        }
        if (cart.length === 0) {
            toast.warn("Seu carrinho está vazio.");
            setLoadingOrder(false);
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
                orderNumber: orderNumber ?? "",
                address: deliveryAddress ?? null,
                paymentMethod: typeof paymentMethod === "string" ? paymentMethod : String(paymentMethod) ?? "",

            };

            const updatedOrders = [...orders, newOrder];
            await updateDoc(restaurantRef, { orders: updatedOrders });

            toast.success("Pedido enviado com sucesso!");
            return newOrder.id;

        } catch (err) {
            const error = err instanceof Error ? err : new Error("Erro desconhecido ao enviar o pedido.");
            console.error("Erro ao criar pedido:", error);
            toast.error("Não foi possível enviar o seu pedido.");
            return null;
        } finally {
            setLoadingOrder(false);
        }
    }, []);

    return {
        loadingOrder,
        createOrder,
    };
}