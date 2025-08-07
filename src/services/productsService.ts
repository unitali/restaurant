import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { ProductType } from "../types";

export async function fetchProductsByRestaurantId(restaurantId: string) {
    if (!restaurantId) throw new Error("restaurantId não informado!");

    const restaurantRef = doc(db, "restaurants", restaurantId);
    const restaurantSnap = await getDoc(restaurantRef);

    if (!restaurantSnap.exists()) {
        throw new Error("Restaurante não encontrado");
    }

    const data = restaurantSnap.data();
    return data.products || [];
}

export async function fetchProductById(restaurantId: string, productId: string) {
    if (!restaurantId || !productId) throw new Error("restaurantId ou productId não informado!");

    const restaurantRef = doc(db, "restaurants", restaurantId);
    const restaurantSnap = await getDoc(restaurantRef);

    if (!restaurantSnap.exists()) {
        throw new Error("Restaurante não encontrado");
    }

    const data = restaurantSnap.data();
    const product = data.products?.find((p: { id: string }) => p.id === productId);

    if (!product) {
        throw new Error("Produto não encontrado");
    }

    return product;
}

export async function addProduct(restaurantId: string, product: ProductType) {
    if (!restaurantId) throw new Error("restaurantId não informado!");

    const restaurantRef = doc(db, "restaurants", restaurantId);
    const restaurantSnap = await getDoc(restaurantRef);

    if (!restaurantSnap.exists()) {
        throw new Error("Restaurante não encontrado");
    }

    const data = restaurantSnap.data();
    const products = data.products || [];
    products.push({ ...product, id: crypto.randomUUID() });

    await updateDoc(restaurantRef, { products });
}