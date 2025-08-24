import { doc, getDoc, setDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../config/firebase";
import { useOrder } from '../contexts/OrderContext';
import { useRestaurant } from "../contexts/RestaurantContext";
import type { OrderType } from "../types";


export function useOrders() {
    const [loadingOrder, setLoadingOrder] = useState(false);
    const { ORDER_KEY, cart, total, deliveryAddress, paymentMethod } = useOrder();
    const { restaurantId } = useRestaurant();

    const createOrder = useCallback(async (orderNumber: string) => {
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

            const orderDocRef = doc(db, "restaurants", restaurantId, "orders", orderNumber ?? "");
            const newOrder: OrderType = {
                items: cart.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    observation: item.observation,
                    options: item.options,
                })),
                status: 'pending',
                createdAt: new Date(),
                address: deliveryAddress ?? null,
                paymentMethod: typeof paymentMethod === "string" ? paymentMethod : String(paymentMethod) ?? "",
            };

            const order = await setDoc(orderDocRef, newOrder);

            toast.success("Pedido enviado com sucesso!");
            return order;

        } catch (err) {
            console.error("Erro ao criar pedido:", err);
            toast.error("Não foi possível enviar o seu pedido.");
            return null;
        } finally {
            setLoadingOrder(false);
        }
    }, [ORDER_KEY, cart, total, deliveryAddress, paymentMethod, restaurantId]);

    return {
        loadingOrder,
        createOrder,
    };
}